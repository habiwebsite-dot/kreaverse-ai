const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Fungsi menebak ekstensi dari isi kode
function guessExtension(code) {
  const firstLine = code.trimStart().split('\n')[0] || '';
  // HTML
  if (/^<!DOCTYPE html>/i.test(firstLine) || /<html[>\s]|<div|<body/i.test(code)) return 'html';
  // CSS
  if (/{[\s\S]*?\b(margin|padding|color|background|display|font-size)\s*:/i.test(code)) return 'css';
  // Python
  if (/\bimport\s+\w+|def |print\(|elif |if __name__ ==/.test(code)) return 'py';
  // JavaScript / TypeScript
  if (/\bconst |let |function |console\.log\(|import .* from/.test(code)) return 'js';
  // JSON
  if (/^\s*[\{\[]/.test(code.trim()) && /[\[{]\s*"[^"]+"\s*:/.test(code)) return 'json';
  // Markdown
  if (/^#{1,6}\s/.test(code) || /\*\*|__/.test(code)) return 'md';
  // Default
  return 'txt';
}

(async () => {
  const url = process.env.GEMINI_URL;
  if (!url) {
    console.error('❌ GEMINI_URL tidak ditemukan.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: undefined  // biarkan cari Chromium bawaan Puppeteer
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    console.log('🌐 Membuka halaman Gemini...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Tunggu elemen <pre> (blok kode) muncul
    await page.waitForSelector('pre', { timeout: 15000 }).catch(() => {
      console.log('⚠️ Tidak menemukan elemen <pre>. Mungkin halaman tidak mengandung kode.');
    });

    // Ambil semua elemen <pre> dan teks di atasnya (untuk mencari petunjuk nama file)
    const codeBlocks = await page.evaluate(() => {
      const pres = Array.from(document.querySelectorAll('pre'));
      return pres.map(pre => {
        // Coba ambil teks dari elemen sebelumnya yang mungkin berisi nama file
        let hint = '';
        let sibling = pre.previousElementSibling;
        while (sibling && sibling.tagName !== 'PRE') {
          hint += sibling.textContent + '\n';
          sibling = sibling.previousElementSibling;
        }
        return {
          code: pre.textContent,
          hint: hint.trim()
        };
      });
    });

    if (codeBlocks.length === 0) {
      console.log('❌ Tidak ada blok kode yang ditemukan.');
      process.exit(0);
    }

    let fileIndex = 0;
    for (let block of codeBlocks) {
      const code = block.code.trim();
      if (!code) continue;

      let filename = null;

      // Cari nama file di hint (contoh: "// File: index.html" atau "index.js")
      const nameMatch = block.hint.match(/(?:\/\/|#)\s*File:\s*(.+?\.[a-z]+)/i) ||
                        block.hint.match(/([a-zA-Z0-9_\-/]+\.[a-z]{1,6})/i);
      if (nameMatch) {
        filename = nameMatch[1].trim();
      } else {
        // Coba dari baris pertama kode jika ada komentar
        const firstLine = code.split('\n')[0];
        const fileComment = firstLine.match(/^\s*(?:\/\/|#)\s*File:\s*(.+?\.[a-z]+)/i) ||
                            firstLine.match(/^\s*(?:\/\/|#)\s*([a-zA-Z0-9_\-/]+\.[a-z]{1,6})/i);
        if (fileComment) {
          filename = fileComment[1].trim();
        }
      }

      // Jika tetap tidak ada, buat nama berdasarkan ekstensi yang terdeteksi
      if (!filename) {
        const ext = guessExtension(code);
        fileIndex++;
        filename = `code_${fileIndex}.${ext}`;
      }

      // Pastikan filename tidak mengandung karakter ilegal
      filename = filename.replace(/[<>:"|?*\\]/g, '_');

      fs.writeFileSync(filename, code, 'utf-8');
      console.log(`✅ Tersimpan: ${filename}`);
    }

  } catch (err) {
    console.error('❌ Gagal:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
