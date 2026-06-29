const SUPABASE_URL = 'https://iifibvnfgytzelgrtdwk.supabase.co'
const SUPABASE_KEY = 'sb_publishable_JTZ3m6KsVzysRb788v1iZQ_syh1i0Gh'
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

const categories = [
  {cat:'baju', title:'👕 BAJU'},
  {cat:'celanaPanjang', title:'👖 CELANA PANJANG'},
  {cat:'celanaPendek', title:'🩳 CELANA PENDEK'},
  {cat:'jam', title:'⌚ JAM TANGAN'},
  {cat:'sepatu', title:'👟 SEPATU'},
]

const outfitData = [
  {img:'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=400', title:'OUTFIT KASUAL', desc:'Simple & Nyaman'},
  {img:'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', title:'STREET STYLE', desc:'Cool & Stylish'},
  {img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', title:'DAILY LOOK', desc:'Minimalis & Rapi'},
  {img:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', title:'ALL BLACK', desc:'Bold & Clean'},
  {img:'https://images.unsplash.com/photo-1492562080023-ab3db95eef65?w=400', title:'SMART CASUAL', desc:'Rapi & Keren'},
  {img:'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400', title:'SIMPLE LOOK', desc:'Effortless & Fresh'},
]

document.getElementById('menuBtn').onclick = () => document.getElementById('sidebar').classList.toggle('open')
document.getElementById('themeBtn').onclick = () => document.body.classList.toggle('light')

async function loadProducts() {
  const { data: products, error } = await supabase.from('produk').select('*').order('id', {ascending:false})
  if(error){ console.error(error); return; }
  
  document.getElementById('outfitSlider').innerHTML = outfitData.map(o=>`
    <div class="outfit-card"><img src="${o.img}"><div><b>${o.title}</b><small>${o.desc}</small></div></div>
  `).join('')

  const sections = categories.map(c=>{
    const items = products.filter(p=>p.cat===c.cat).slice(0,4)
    return `
    <section data-cat="${c.cat}">
      <div class="section-head"><h2>${c.title}</h2><a href="#">Lihat Semua ></a></div>
      <div class="product-grid">
        ${items.length ? items.map(p=>`
          <div class="product-card">
            <img src="${p.gambar}" onerror="this.src='https://placehold.co/400x400/1a1a1a/aaa?text=No+Image'">
            <div><b>${p.nama}</b><p>${p.harga}</p></div>
          </div>
        `).join('') : '<p style="color:var(--muted);grid-column:1/-1">Belum ada produk</p>'}
      </div>
    </section>`
  }).join('')

  document.getElementById('productSections').innerHTML = sections + `
  <div class="footer">
    <div class="footer-item">🎁 <div><b>Produk Berkualitas</b><br>Pilihan terbaik & terpercaya</div></div>
    <div class="footer-item">💰 <div><b>Harga Terbaik</b><br>Harga bersaing setiap hari</div></div>
    <div class="footer-item">🚚 <div><b>Pengiriman Cepat</b><br>Aman & sampai cepat</div></div>
    <div class="footer-item">🛡️ <div><b>100% Aman</b><br>Belanja aman & nyaman</div></div>
  </div>`

  document.querySelectorAll('.sidebar a').forEach(a=>{
    a.onclick = e=>{
      e.preventDefault();
      document.querySelectorAll('.sidebar a').forEach(x=>x.classList.remove('active'))
      a.classList.add('active')
      const cat = a.dataset.cat;
      if(cat==='all'){document.querySelectorAll('section[data-cat]').forEach(s=>s.classList.remove('hidden'))}
      else{document.querySelectorAll('section[data-cat]').forEach(s=>s.classList.add('hidden')); document.querySelector(`section[data-cat="${cat}"]`)?.classList.remove('hidden')}
    }
  })
}

loadProducts()
async function renderAdmin(){
  const { data: products, error } = await supabase.from('produk').select('*').order('id', { ascending: false });
  if(error){ return alert('Gagal load: ' + error.message); }
  const list = document.getElementById('adminList');
  list.innerHTML = products.map((p) => `
    <div class="admin-item">
      <img src="${p.gambar}">
      <div><b>${p.nama}</b><br><small>${p.cat} • ${p.harga}</small></div>
      <button class="danger" onclick="deleteProduct('${p.id}')">Hapus</button>
    </div>`
  ).join('');
}

async function deleteProduct(id){
  if(!confirm('Hapus produk ini?')) return;
  const { error } = await supabase.from('produk').delete().eq('id', id);
  if(error){ return alert('Gagal hapus: ' + error.message); }
  renderAdmin();
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const file = document.getElementById('gambarFile').files[0];
  if(!file){ return alert('Upload gambar dulu'); }
  const fileName = `${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage.from('produk').upload(fileName, file);
  if(uploadError){ return alert('Gagal upload gambar: ' + uploadError.message); }
  
  // INI YANG DIBENERIN TITIK KURUNG NYA
  const { data: { publicUrl } = supabase.storage.from('produk').getPublicUrl(fileName);
  
  const { error } = await supabase.from('produk').insert([{
    nama: nama.value, harga: harga.value, cat: cat.value,
    link: link.value, desc: desc.value, gambar: publicUrl
  }]);
  if(error){ alert('Gagal simpan: ' + error.message); }
  else {
    form.reset();
    renderAdmin();
    alert('Produk berhasil ditambahkan');
  }
});
</script>
