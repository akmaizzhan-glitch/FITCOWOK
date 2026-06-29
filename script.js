const SUPABASE_URL = "https://iifibvnfgytzelgrtdwk.supabase.co";
const SUPABASE_KEY = "sb_publishable_JTZ3m6KsVzysRb788v1iZQ_syh1i0Gh";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadProducts() {
  const productContainer = document.getElementById("product-list");
  if (!productContainer) return;

  productContainer.innerHTML = "<p>Loading produk...</p>";

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    productContainer.innerHTML = "<p>Gagal memuat produk.</p>";
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    productContainer.innerHTML = "<p>Belum ada produk.</p>";
    return;
  }

  productContainer.innerHTML = "";

  data.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    const affiliateLink = product.link || product.affiliate_link || "#";

    productCard.innerHTML = `
      <img src="${product.image || product.image_url || ""}" alt="${product.name || "Produk"}">

      <div class="product-info">
        <h3>${product.name || "Nama Produk"}</h3>
        <p>${product.description || ""}</p>

        ${
          product.price
            ? `<span class="price">Rp ${Number(product.price).toLocaleString("id-ID")}</span>`
            : ""
        }

        <a 
          href="${affiliateLink}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="buy-btn"
        >
          Beli Sekarang
        </a>
      </div>
    `;

    productContainer.appendChild(productCard);
  });
}

loadProducts();let products = [], cart = JSON.parse(localStorage.getItem("fc_cart") || "[]"), selectedProduct = null;
async function loadProducts(){
  products = defaultProducts;
  if(db){
    const {data,error}=await db.from(TABLE).select("*").order("id",{ascending:false});
    if(!error && data && data.length) products = data;
  }
  renderAll(); renderAdmin();
}
function renderAll(){ if(!document.getElementById("productSections")) return; renderOutfits(); renderSections(); updateCart(); }
function card(p,type="product"){return `<article class="${type}-card" data-id="${p.id || p.name}"><img src="${p.image}" onerror="this.src='assets/logo-fc.png'" alt="${p.name}">${type==="outfit"?`<div class="cap"><b>${p.name}</b><span>${p.description||""}</span></div>`:`<b>${p.name}</b><div class="price">${rupiah(p.price)}</div>`}</article>`}
function renderOutfits(){ const list=products.filter(p=>p.category==="Outfit").slice(0,6); document.getElementById("outfitGrid").innerHTML=list.map(p=>card(p,"outfit")).join(""); bindCards(); }
function renderSections(filter="all",keyword=""){
 const cats=["Baju","Celana Panjang","Celana Pendek","Jam Tangan","Sepatu"]; const icons={"Baju":"👕","Celana Panjang":"👖","Celana Pendek":"🩳","Jam Tangan":"⌚","Sepatu":"👟"};
 const wrap=document.getElementById("productSections"); wrap.innerHTML="";
 cats.filter(c=>filter==="all"||filter===c).forEach((c,i)=>{let list=products.filter(p=>p.category===c && p.name.toLowerCase().includes(keyword.toLowerCase())).slice(0,c==="Jam Tangan"||c==="Sepatu"?5:4); if(!list.length)return; wrap.innerHTML+=`<section class="category-box ${c==="Jam Tangan"||c==="Sepatu"?"wide":""}"><div class="category-title"><h2>${icons[c]} ${c.toUpperCase()}</h2><button>Lihat Semua ›</button></div><div class="products">${list.map(p=>card(p)).join("")}</div></section>`}); bindCards(); }
function bindCards(){ document.querySelectorAll("[data-id]").forEach(el=>el.onclick=()=>openProduct(el.dataset.id)); }
function openProduct(id){ selectedProduct=products.find(p=>(p.id||p.name).toString()===id.toString()); if(!selectedProduct)return; modalImg.src=selectedProduct.image; modalName.textContent=selectedProduct.name; modalDesc.textContent=selectedProduct.description||"Produk fashion pilihan FITCOWOK.ID"; modalPrice.textContent=selectedProduct.price?rupiah(selectedProduct.price):"Outfit Inspiration"; modal.classList.remove("hidden"); }
function updateCart(){ const el=document.getElementById("cartCount"); if(el) el.textContent=cart.length; localStorage.setItem("fc_cart",JSON.stringify(cart)); }
window.addEventListener("click",e=>{ if(e.target.id==="closeModal"||e.target.id==="modal") modal.classList.add("hidden"); if(e.target.id==="addCart"&&selectedProduct){cart.push(selectedProduct);updateCart();alert("Produk masuk keranjang");}});
document.querySelectorAll(".sidebar a").forEach(a=>a.onclick=()=>{document.querySelectorAll(".sidebar a").forEach(x=>x.classList.remove("active"));a.classList.add("active");renderSections(a.dataset.filter,searchInput?.value||"");});
if(document.getElementById("searchInput")) searchInput.oninput=()=>renderSections(document.querySelector(".sidebar a.active").dataset.filter,searchInput.value);
if(document.getElementById("themeBtn")) themeBtn.onclick=()=>document.body.classList.toggle("light");

const ADMIN_PASS="fitcowok2024";
if(document.getElementById("loginBtn")){ loginBtn.onclick=()=>{ if(adminPass.value===ADMIN_PASS){loginBox.classList.add("hidden");adminPanel.classList.remove("hidden");renderAdmin();}else alert("Password salah"); }; }
async function saveProduct(e){e.preventDefault(); const item={name:name.value,price:Number(price.value),category:category.value,image:image.value,description:description.value}; if(!db) return alert("Supabase tidak terhubung"); let res; if(productId.value) res=await db.from(TABLE).update(item).eq("id",productId.value); else res=await db.from(TABLE).insert(item); if(res.error) return alert("Gagal simpan: "+res.error.message); productForm.reset(); productId.value=""; await loadProducts();}
if(document.getElementById("productForm")) productForm.onsubmit=saveProduct;
if(document.getElementById("resetBtn")) resetBtn.onclick=()=>{productForm.reset();productId.value=""};
function renderAdmin(){ if(!document.getElementById("adminList")) return; adminList.innerHTML=products.filter(p=>p.category!=="Outfit").map(p=>`<div class="admin-item"><img src="${p.image}" onerror="this.src='assets/logo-fc.png'"><div><b>${p.name}</b><p>${p.category} • ${rupiah(p.price)}</p><small>${p.description||""}</small></div><div class="admin-actions"><button class="ghost" onclick='editProduct(${JSON.stringify(p).replace(/'/g,"&#39;")})'>Edit</button><button class="primary" onclick='deleteProduct("${p.id||""}")'>Hapus</button></div></div>`).join(""); }
window.editProduct=p=>{productId.value=p.id||"";name.value=p.name;price.value=p.price;category.value=p.category;image.value=p.image;description.value=p.description||"";scrollTo(0,0)};
window.deleteProduct=async id=>{ if(!id) return alert("Produk default tidak bisa dihapus. Tambahkan produk ke Supabase dulu."); if(!confirm("Hapus produk ini?"))return; const {error}=await db.from(TABLE).delete().eq("id",id); if(error) return alert(error.message); await loadProducts(); };
loadProducts();
  
