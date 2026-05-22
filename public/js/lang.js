const translations = {
  id: {
    home: 'Beranda', tools: 'Tool Model', services: 'Layanan', about: 'Tentang', login: 'Login', logout: 'Logout',
    dashboard: 'Dashboard', heroTitle: 'Kreaverse AI', heroSub: 'Platform Agregasi 11 Provider AI Terlengkap di Indonesia',
    tryNow: 'Coba Sekarang', viewServices: 'Lihat Layanan', categoryImage: 'Gambar', categoryVideo: 'Video',
    categoryAudio: 'Audio', categoryChat: 'Chat AI', audioBanner: '🎤 Audio AI – Ciptakan Lagu Hanya dengan Prompt!',
    playground: 'Playground', inputPrompt: 'Prompt', generate: 'Generate', result: 'Hasil', download: 'Unduh',
    uploadFile: 'Upload File', referral: 'Kode Undangan', referralDesc: 'Bagikan kode ini dan dapatkan trial 3 hari untuk setiap teman yang mendaftar.',
    enterReferral: 'Masukkan kode undangan', apiKeyOn: 'API Key Server (ON)', apiKeyOff: 'API Key Pribadi (OFF)',
    save: 'Simpan', delete: 'Hapus', statusActive: 'Aktif', statusInactive: 'Tidak Aktif', getApiKey: 'Dapatkan API Key',
    chat: 'Chat AI', send: 'Kirim', copy: 'Salin', uploadImage: 'Upload Gambar', referenceImages: 'Gambar Referensi',
    resolution: 'Resolusi', aspectRatio: 'Aspek Rasio', duration: 'Durasi', style: 'Gaya', lyrics: 'Lirik',
    vocalGender: 'Gender Vokal', negativeTags: 'Tag Negatif', styleWeight: 'Bobot Gaya', weirdnessConstraint: 'Batasan Aneh',
    audioWeight: 'Bobot Audio', title: 'Judul', musicCover: 'Music Cover', selectProvider: 'Pilih Provider',
    selectModel: 'Pilih Model', processing: 'Memproses...', completed: 'Selesai', failed: 'Gagal',
    noResults: 'Belum ada hasil', account: 'Akun', settings: 'Pengaturan', adminPanel: 'Panel Admin'
  },
  en: {
    home: 'Home', tools: 'Tools', services: 'Services', about: 'About', login: 'Login', logout: 'Logout',
    dashboard: 'Dashboard', heroTitle: 'Kreaverse AI', heroSub: 'The Ultimate 11 AI Provider Aggregation Platform in Indonesia',
    tryNow: 'Try Now', viewServices: 'View Services', categoryImage: 'Image', categoryVideo: 'Video',
    categoryAudio: 'Audio', categoryChat: 'Chat AI', audioBanner: '🎤 Audio AI – Create Songs with Just a Prompt!',
    playground: 'Playground', inputPrompt: 'Prompt', generate: 'Generate', result: 'Result', download: 'Download',
    uploadFile: 'Upload File', referral: 'Referral Code', referralDesc: 'Share this code and get 3 days trial for each friend who signs up.',
    enterReferral: 'Enter referral code', apiKeyOn: 'Server API Key (ON)', apiKeyOff: 'Personal API Key (OFF)',
    save: 'Save', delete: 'Delete', statusActive: 'Active', statusInactive: 'Inactive', getApiKey: 'Get API Key',
    chat: 'Chat AI', send: 'Send', copy: 'Copy', uploadImage: 'Upload Image', referenceImages: 'Reference Images',
    resolution: 'Resolution', aspectRatio: 'Aspect Ratio', duration: 'Duration', style: 'Style', lyrics: 'Lyrics',
    vocalGender: 'Vocal Gender', negativeTags: 'Negative Tags', styleWeight: 'Style Weight', weirdnessConstraint: 'Weirdness Constraint',
    audioWeight: 'Audio Weight', title: 'Title', musicCover: 'Music Cover', selectProvider: 'Select Provider',
    selectModel: 'Select Model', processing: 'Processing...', completed: 'Completed', failed: 'Failed',
    noResults: 'No results yet', account: 'Account', settings: 'Settings', adminPanel: 'Admin Panel'
  }
};
let currentLang = localStorage.getItem('lang') || 'id';
function t(key) { return translations[currentLang]?.[key] || key; }
function setLang(lang) { currentLang = lang; localStorage.setItem('lang', lang); if (typeof renderPage === 'function') renderPage(); }