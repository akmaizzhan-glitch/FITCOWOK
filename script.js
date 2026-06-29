const SUPABASE_URL = "https://iifibvnfgytzelgrtdwk.supabase.co";
const SUPABASE_KEY = "sb_publishable_JTZ3m6KsVzysRb788v1iZQ_syh1i0Gh";
const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
const TABLE = "products";
const rupiah = n => "Rp " + Number(n || 0).toLocaleString("id-ID");
const img = q => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=700&q=85`;
const demoLink = "https://example.com/link-affiliate-produk";

const defaultProducts = [
 {name:"Outfit Kasual",category:"Outfit",price:0,description:"Simple & Nyaman",image:img("photo-1617137968427-85924c800a22"),link:demoLink},
 {name:"Street Style",category:"Outfit",price:0,description:"Cool & Stylish",image:img("photo-1516257984-b1b4d707412e"),link:demoLink},
 {name:"Daily Look",category:"Outfit",price:0,description:"Minimalis & Rapi",image:img("photo-1610652492500-ded49ceeb378"),link:demoLink},
 {name:"All Black",category:"Outfit",price:0,description:"Bold & Clean",image:img("photo-1515886657613-9f3515b0c78f"),link:demoLink},
 {name:"Smart Casual",category:"Outfit",price:0,description:"Rapi & Keren",image:img("photo-1620012253295-c15cc3e65df4"),link:demoLink},
 {name:"Simple Look",category:"Outfit",price:0,description:"Effortless & Fresh",image:img("photo-1602810318383-e386cc2a3ccf"),link:demoLink},
 {name:"Oversize Tee",category:"Baju",price:99000,description:"Kaos oversize hitam premium.",image:img("photo-1521572163474-6864f9cf17ab"),link:demoLink},
 {name:"Basic Tee",category:"Baju",price:79000,description:"Kaos basic putih harian.",image:img("photo-1581655353564-df123a1eb820"),link:demoLink},
 {name:"Striped Shirt",category:"Baju",price:129000,description:"Kemeja garis casual.",image:img("photo-1598032895397-b9472444bf93"),link:demoLink},
 {name:"Polo Shirt",category:"Baju",price:119000,description:"Polo shirt clean look.",image:img("photo-1622470953794-aa9c70b0fb9d"),link:demoLink},
 {name:"Cargo Pants",category:"Celana Panjang",price:149000,description:"Cargo pants abu-abu.",image:img("photo-1473966968600-fa801b869a1a"),link:demoLink},
 {name:"Jeans Slim Fit",category:"Celana Panjang",price:159000,description:"Jeans slim fit pria.",image:img("photo-1542272604-787c3835535d"),link:demoLink},
 {name:"Chino Pants",category:"Celana Panjang",price:139000,description:"Chino warna cream.",image:img("photo-1624378439575-d8705ad7ae80"),link:demoLink},
 {name:"Formal Pants",category:"Celana Panjang",price:149000,description:"Celana formal hitam.",image:img("photo-1594938298603-c8148c4dae35"),link:demoLink},
 {name:"Short Pants",category:"Celana Pendek",price:89000,description:"Celana pendek hitam.",image:img("photo-1591195853828-11db59a44f6b"),link:demoLink},
 {name:"Cargo Pendek",category:"Celana Pendek",price:99000,description:"Cargo pendek casual.",image:img("photo-1562157873-818bc0726f68"),link:demoLink},
 {name:"Chino Pendek",category:"Celana Pendek",price:89000,description:"Chino pendek putih.",image:img("photo-1506629905607-d9e297d03993"),link:demoLink},
 {name:"Basic Pendek",category:"Celana Pendek",price:79000,description:"Basic shorts nyaman.",image:img("photo-1594633312681-425c7b97ccd1"),link:demoLink},
 {name:"Analog Classic",category:"Jam Tangan",price:299000,description:"Jam analog klasik.",image:img("photo-1523275335684-37898b6baf30"),link:demoLink},
 {name:"Chronograph",category:"Jam Tangan",price:359000,description:"Jam chronograph sporty.",image:img("photo-1539874754764-5a96559165b0"),link:demoLink},
 {name:"Digital Sport",category:"Jam Tangan",price:199000,description:"Jam digital sport.",image:img("photo-1434493789847-2f02dc6ca35d"),link:demoLink},
 {name:"Minimalist",category:"Jam Tangan",price:279000,description:"Jam putih minimalis.",image:img("photo-1524592094714-0f0654e20314"),link:demoLink},
 {name:"Metal Strap",category:"Jam Tangan",price:329000,description:"Jam rantai metal.",image:img("photo-1614164185128-e4ec99c436d7"),link:demoLink},
 {name:"Sneakers Putih",category:"Sepatu",price:299000,description:"Sneakers putih clean.",image:img("photo-1549298916-b41d501d3772"),link:demoLink},
 {name:"Sneakers Hitam",category:"Sepatu",price:299000,description:"Sneakers hitam casual.",image:img("photo-1542291026-7eec264c27ff"),link:demoLink},
 {name:"Canvas Shoes",category:"Sepatu",price:199000,description:"Canvas shoes santai.",image:img("photo-1525966222134-fcfa99b8ae77"),link:demoLink},
 {name:"Sport Sneakers",category:"Sepatu",price:349000,description:"Sepatu olahraga.",image:img("photo-1543508282-6319a3e2621f"),link:demoLink},
 {name:"Loafers",category:"Sepatu",price:289000,description:"Loafers formal pria.",image:img("photo-1614252369475-531eba835eb1"),link:demoLink}
];

let products = [], selectedProduct = null;

async function loadProducts(){
  products = defaultProducts;
  if(db){
    const {data,error} = await db.from(TABLE).select("*").order("id",{ascending:false});
    if(!error && data && data.length) products = data;
  }
  renderAll();
  renderAdmin();
}

function renderAll(){
  if(!document.getElementById("productSections")) return;
  renderOutfits();
  renderSections();
}

function getLink(p){ return p.link || p.affiliate_link || p.url || ""; }

function card(p,type="product"){
  return `<article class="${type}-card" data-id="${p.id || p.name}">
    <img src="${p.image}" onerror="this.src='assets/logo-fc.png'" alt="${p.name}">
    ${type==="outfit" ? `<div class="cap"><b>${p.name}</b><span>${p.description||""}</span></div>` : `<b>${p.name}</b><div class="price">${rupiah(p.price)}</div>`}
  </article>`;
}

function renderOutfits(){
  const el = document.getElementById("outfitGrid");
  if(!el) return;
  const list = products.filter(p=>p.category==="Outfit").slice(0,6);
  el.innerHTML = list.map(p=>card(p,"outfit")).join("");
  bindCards();
}

function renderSections(filter="all"){
  const cats = ["Baju","Celana Panjang","Celana Pendek","Jam Tangan","Sepatu"];
  const icons = {"Baju":"👕","Celana Panjang":"👖","Celana Pendek":"🩳","Jam Tangan":"⌚","Sepatu":"👟"};
  const wrap = document.getElementById("productSections");
  if(!wrap) return;
  wrap.innerHTML = "";
  cats.filter(c=>filter==="all" || filter===c).forEach(c=>{
    let limit = c==="Jam Tangan" || c==="Sepatu" ? 5 : 4;
    let list = products.filter(p=>p.category===c).slice(0,limit);
    if(!list.length) return;
    wrap.innerHTML += `<section class="category-box ${c==="Jam Tangan"||c==="Sepatu"?"wide":""}">
      <div class="category-title"><h2>${icons[c]} ${c.toUpperCase()}</h2><button>Lihat Semua ›</button></div>
      <div class="products">${list.map(p=>card(p)).join("")}</div>
    </section>`;
  });
  bindCards();
}

function bindCards(){
  document.querySelectorAll("[data-id]").forEach(el=>{
    el.onclick = () => openProduct(el.dataset.id);
  });
}

function openProduct(id){
  selectedProduct = products.find(p => (p.id || p.name).toString() === id.toString());
  if(!selectedProduct) return;
  modalImg.src = selectedProduct.image || "assets/logo-fc.png";
  modalName.textContent = selectedProduct.name;
  modalDesc.textContent = selectedProduct.description || "Produk fashion pilihan FITCOWOK.ID";
  modalPrice.textContent = selectedProduct.price ? rupiah(selectedProduct.price) : "Outfit Inspiration";
  modal.classList.remove("hidden");
}

window.addEventListener("click", e => {
  if(e.target.id === "closeModal" || e.target.id === "modal") modal.classList.add("hidden");
  if(e.target.id === "buyBtn" && selectedProduct){
    const link = getLink(selectedProduct);
    if(!link){ alert("Link produk belum diisi."); return; }
    window.open(link, "_blank", "noopener,noreferrer");
  }
});

document.querySelectorAll(".sidebar a").forEach(a=>{
  a.onclick = () => {
    document.querySelectorAll(".sidebar a").forEach(x=>x.classList.remove("active"));
    a.classList.add("active");
    renderSections(a.dataset.filter);
    document.getElementById("sidebar")?.classList.remove("show");
  };
});

if(document.getElementById("themeBtn")) themeBtn.onclick = () => document.body.classList.toggle("light");
if(document.getElementById("openSide")) openSide.onclick = () => sidebar.classList.toggle("show");
if(document.getElementById("menuBtn")) menuBtn.onclick = () => sidebar.classList.toggle("show");

const ADMIN_PASS = "fitcowok2024";
if(document.getElementById("loginBtn")){
  loginBtn.onclick = () => {
    if(adminPass.value === ADMIN_PASS){
      loginBox.classList.add("hidden");
      adminPanel.classList.remove("hidden");
      renderAdmin();
    } else alert("Password salah");
  };
}

async function saveProduct(e){
  e.preventDefault();
  const item = {
    name: name.value,
    price: Number(price.value || 0),
    category: category.value,
    image: image.value,
    description: description.value,
    link: link.value
  };
  if(!db) return alert("Supabase tidak terhubung");
  let res;
  if(productId.value) res = await db.from(TABLE).update(item).eq("id", productId.value);
  else res = await db.from(TABLE).insert(item);
  if(res.error) return alert("Gagal simpan: " + res.error.message);
  productForm.reset();
  productId.value = "";
  await loadProducts();
}

if(document.getElementById("productForm")) productForm.onsubmit = saveProduct;
if(document.getElementById("resetBtn")) resetBtn.onclick = () => { productForm.reset(); productId.value=""; };

function renderAdmin(){
  if(!document.getElementById("adminList")) return;
  adminList.innerHTML = products.map(p => `<div class="admin-item">
    <img src="${p.image}" onerror="this.src='assets/logo-fc.png'">
    <div><b>${p.name}</b><p>${p.category} • ${rupiah(p.price)}</p><small>${p.description||""}</small><em>${getLink(p)||"Belum ada link"}</em></div>
    <div class="admin-actions">
      <button class="ghost" onclick='editProduct(${JSON.stringify(p).replace(/'/g,"&#39;")})'>Edit</button>
      <button class="primary" onclick='deleteProduct("${p.id||""}")'>Hapus</button>
    </div>
  </div>`).join("");
}

window.editProduct = p => {
  productId.value = p.id || "";
  name.value = p.name || "";
  price.value = p.price || "";
  category.value = p.category || "Baju";
  image.value = p.image || "";
  description.value = p.description || "";
  link.value = getLink(p);
  scrollTo(0,0);
};

window.deleteProduct = async id => {
  if(!id) return alert("Produk default tidak bisa dihapus. Tambahkan produk ke Supabase dulu.");
  if(!confirm("Hapus produk ini?")) return;
  const { error } = await db.from(TABLE).delete().eq("id", id);
  if(error) return alert(error.message);
  await loadProducts();
};

loadProducts();
   
