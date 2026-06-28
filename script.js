const starterProducts = [
  {cat:'branda', nama:'Outfit Casual', desc:'Simple & nyaman', harga:'Rp 199.000', gambar:'https://via.placeholder.com/400x500', link:'#'},
  {cat:'branda', nama:'Street Style', desc:'Cool & stylish', harga:'Rp 249.000', gambar:'https://via.placeholder.com/400x500', link:'#'},
  {cat:'branda', nama:'Daily Look', desc:'Minimalis & rapi', harga:'Rp 189.000', gambar:'https://via.placeholder.com/400x500', link:'#'},
  {cat:'baju', nama:'Oversize Tee', desc:'Kaos oversize pria', harga:'Rp 99.000', gambar:'https://via.placeholder.com/400x500', link:'#'},
  {cat:'celanaPanjang', nama:'Cargo Pants', desc:'Celana cargo pria', harga:'Rp 149.000', gambar:'https://via.placeholder.com/400x500', link:'#'},
  {cat:'celanaPendek', nama:'Short Pants', desc:'Celana pendek santai', harga:'Rp 89.000', gambar:'https://via.placeholder.com/400x500', link:'#'},
  {cat:'jam', nama:'Analog Classic', desc:'Jam tangan klasik', harga:'Rp 299.000', gambar:'https://via.placeholder.com/400x500', link:'#'},
  {cat:'sepatu', nama:'Sneakers Putih', desc:'Sepatu putih clean', harga:'Rp 299.000', gambar:'https://via.placeholder.com/400x500', link:'#'}
];
function getProducts(){
  const saved = localStorage.getItem('fitcowok_products');
  if(saved) return JSON.parse(saved);
  localStorage.setItem('fitcowok_products', JSON.stringify(starterProducts));
  return starterProducts;
}
function saveProducts(products){localStorage.setItem('fitcowok_products', JSON.stringify(products));}
const titles = {branda:'🔥 SPIL HASIL OUTFIT', baju:'👕 BAJU', celanaPanjang:'👖 CELANA PANJANG', celanaPendek:'🩳 CELANA PENDEK', jam:'⌚ JAM TANGAN', sepatu:'👟 SEPATU'};
function render(category='branda'){
  const app=document.getElementById('app'); if(!app) return;
  const products=getProducts().filter(p=>p.cat===category);
  let html='';
  if(category==='branda') html+=`<div class="logo-banner"><img src="logo.png" alt="FITCOWOK Logo"></div>`;
  html+=`<div class="section-title">${titles[category]}</div>`;
  if(products.length===0){html+=`<div class="empty">Belum ada produk di kategori ini. Tambahkan dari halaman Admin Produk.</div>`; app.innerHTML=html; return;}
  html+='<div class="grid">';
  products.forEach(p=>{html+=`<div class="card"><img src="${p.gambar}" alt="${p.nama}"><div class="card-body"><h3>${p.nama}</h3><p>${p.desc}</p><div class="price">${p.harga}</div><a class="btn" href="${p.link}" target="_blank">Lihat Produk</a></div></div>`});
  html+='</div>'; app.innerHTML=html;
}
function openMenu(){document.getElementById('sidebar').classList.add('active');document.getElementById('overlay').classList.add('active')}
function closeMenu(){document.getElementById('sidebar').classList.remove('active');document.getElementById('overlay').classList.remove('active')}
document.querySelectorAll('.menu button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.menu button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render(btn.dataset.cat);closeMenu()}));
render('branda');
