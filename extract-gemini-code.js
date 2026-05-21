const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = process.env.GEMINI_URL;
  if (!url) {
    console.error('❌ GEMINI_URL tidak ditemukan.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    console.log('🌐 Membuka halaman Gemini...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Tunggu agar elemen kode benar-benar dimuat (deteksi keberadaan <pre>)
    await page.waitForSelector('pre', { timeout: 15000 }).catch(() => {
      console.log('⚠️ Tidak menemukan <pre>, mungkin halaman tidak berisi kode.');
    });

    // Ambil seluruh teks dari halaman
    const pageText = await page.evaluate(() => document.body.innerText);

    // --- Deteksi file dari teks ---
    // Pola 1: ===FILE: path===
    // Pola 2: blok kode yang dipisahkan oleh ``` (jika ada)
    const files = {};

    // Coba deteksi format ===FILE: path===
    const fileRegex = /===FILE:\s*(.+?)===\s*([\s\S]*?)(?=\n===FILE:|$)/g;
    let match;
    while ((match = fileRegex.exec(pageText)) !== null) {
      files[match[1].trim()] = match[2].trim();
    }

    // Jika tidak ada format khusus, cari blok ```...``` 
    if (Object.keys(files).length === 0) {
      const codeBlockRegex = /```([\s\S]*?)```/g;
      let idx = 0;
      while ((match = codeBlockRegex.exec(pageText)) !== null) {
        idx++;
        let code = match[1];
        // hapus label bahasa di baris pertama (```python, ```js, dll)
        code = code.replace(/^.*\n?/, ''); 
        files[`code_${idx}.txt`] = code.trim();
      }
    }

    // Jika masih kosong, ambil semua teks dan buat satu file
    if (Object.keys(files).length === 0) {
      files['output.txt'] = pageText;
    }

    // Tulis setiap file
    for (const [name, content] of Object.entries(files)) {
      fs.writeFileSync(name, content, 'utf-8');
      console.log(`✅ Berhasil diekstrak: ${name}`);
    }

  } catch (err) {
    console.error('❌ Gagal:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
