<script>
const SUPABASE_URL = 'https://zksdswzmzllqffvfvqyr.supabase.co'
const SUPABASE_KEY = 'sb_publishable_8hZnoJH3vA2yont9BMBsuw_1MzOpkUC'
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

const loginBox = document.getElementById('loginBox');
const adminBox = document.getElementById('adminBox');

supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) { showAdmin(); }
})

document.getElementById('btnLogin').onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  })
  if(error){ 
    document.getElementById('loginError').innerText = 'Login Gagal: ' + error.message 
  } else { 
    showAdmin() 
  }
}

document.getElementById('btnLogout').onclick = async () => {
  await supabase.auth.signOut()
  location.reload();
}

function showAdmin(){
  loginBox.classList.add('hidden');
  adminBox.classList.remove('hidden');
  renderAdmin();
}

const form = document.getElementById('productForm');

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
