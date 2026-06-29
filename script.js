const SUPABASE_URL = 'https://zksdswzmzllqffvfvqyr.supabase.co'
const SUPABASE_KEY = 'sb_publishable_8hZnoJH3vA2yont9BMBsuw_1MzOpkUC'
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

let allProducts = [];
const titles = {
  branda:'🔥 SPIL HASIL OUTFIT', baju:'👕 BAJU', celanaPanjang:'👖 CELANA PANJANG', 
  celanaPendek:'🩳 CELANA PENDEK', jam:'⌚ JAM TANGAN', sepatu:'👟 SEPATU'
};

async function loadProducts() {
  const { data, error } = await supabase.from('produk').select('*').order('id', { ascending: false });
  if (error) {
    document.getElementById('app').innerHTML = '<div class="empty">Gagal memuat produk: '+error.message+'</div>';
    return;
  }
  allProducts = data || [];
  render('branda');
}
loadProducts();

function render(category='branda'){
  const app=document.getElementById('app'); 
  if(!app) return;
  const products = allProducts.filter(p=>p.cat===category);
  let html='';
  if(category==='branda') html+=`<div class="logo-banner"><img src="logo.png" alt="FITCOWOK Logo"></div>`;
  html+=`<div class="section-title">${titles[category]}</div>`;
  if(products.length===0){
    html+=`<div class="empty">Belum ada produk di kategori ini. Tambahkan dari halaman Admin Produk.</div>`; 
    app.innerHTML=html; 
    return;
  }
  html+='<div class="grid">';
  products.forEach(p=>{
    const imgUrl = p.gambar || 'placeholder.png'; 
    if(category === 'branda'){
      html+=`<div class="card"><img src="${imgUrl}" alt="${p.nama}"><div class="card-body"><h3>${p.nama}</h3><p>${p.desc}</p></div></div>`
    } else {
      html+=`<div class="card"><img src="${imgUrl}" alt="${p.nama}"><div class="card-body"><h3>${p.nama}</h3><p>${p.desc}</p><div class="price">${p.harga}</div><a class="btn" href="${p.link}" target="_blank">Lihat Produk</a></div></div>`
    }
  });
  html+='</div>'; 
  app.innerHTML=html;
}

function openMenu(){ document.getElementById('sidebar').classList.add('active'); document.getElementById('overlay').classList.add('active') }
function closeMenu(){ document.getElementById('sidebar').classList.remove('active'); document.getElementById('overlay').classList.remove('active') }
document.querySelectorAll('.menu button').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.menu button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  render(btn.dataset.cat);
  closeMenu()
}));
