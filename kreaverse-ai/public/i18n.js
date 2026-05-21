// kreaverse-ai i18n (id default, jw, mad, en)
window.I18N = {
  id: { 'nav.services':'Layanan','nav.providers':'Provider','nav.dangdut':'Dangdut AI','nav.price':'Harga','nav.invite':'Undang' },
  jw: { 'nav.services':'Layanan','nav.providers':'Panyedhiya','nav.dangdut':'Dangdut AI','nav.price':'Rega','nav.invite':'Ngundang' },
  mad:{ 'nav.services':'Layanan','nav.providers':'Penyadhia','nav.dangdut':'Dangdut AI','nav.price':'Argha','nav.invite':'Ngundhang' },
  en: { 'nav.services':'Services','nav.providers':'Providers','nav.dangdut':'Dangdut AI','nav.price':'Pricing','nav.invite':'Invite' },
};
window.applyI18n = function(lang){
  const dict = window.I18N[lang] || window.I18N.id;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if (dict[k]) el.textContent = dict[k];
  });
  localStorage.setItem('kv_lang', lang);
};
