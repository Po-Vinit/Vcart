

const API_URL = "http://localhost:8080";

async function fetchProducts() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/products`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Products load nahi hue: " + response.status);
        }

        const data = await response.json();

        // Backend data ko existing UI ke format mein badalna
        return data.map(p => ({
            ...p,
            old: p.price,
            cat: "All Products",
            icon: "📦",
            desc: p.description
        }));

    } catch (error) {
        console.error("API Error:", error);
        toast("Backend se products load nahi hue");
        return [];
    }
}

let products=[
 {id:1,name:"VCart Pro Laptop",price:55000,old:62000,cat:"Laptop",icon:"💻",desc:"Powerful everyday laptop with a premium design, fast performance and long battery life."},
 {id:2,name:"VCart X Phone",price:20000,old:24000,cat:"Mobile",icon:"📱",desc:"Modern smartphone with a bright display, excellent camera and smooth performance."},
 {id:3,name:"AirSound Headphones",price:3000,old:4200,cat:"Audio",icon:"🎧",desc:"Wireless headphones with rich sound, comfortable cushions and long battery backup."},
 {id:4,name:"Smart Watch",price:4500,old:6000,cat:"Wearables",icon:"⌚",desc:"Smart fitness watch with activity tracking, notifications and stylish design."},
 {id:5,name:"Gaming Mouse",price:1800,old:2400,cat:"Accessories",icon:"🖱️",desc:"Fast and comfortable gaming mouse with accurate tracking."},
 {id:6,name:"Mechanical Keyboard",price:3200,old:3900,cat:"Accessories",icon:"⌨️",desc:"Tactile mechanical keyboard designed for work and gaming."},
 {id:7,name:"Tablet Air",price:28000,old:32000,cat:"Tablet",icon:"📲",desc:"Slim tablet for entertainment, study and productivity."},
 {id:8,name:"Portable Speaker",price:2500,old:3200,cat:"Audio",icon:"🔊",desc:"Compact Bluetooth speaker with powerful sound."}
];

let cart=JSON.parse(localStorage.getItem("vcart"))||[];
const money=n=>"₹"+n.toLocaleString("en-IN");
function save(){localStorage.setItem("vcart",JSON.stringify(cart))}
function count(){return cart.reduce((s,x)=>s+x.qty,0)}
function add(id) {
    let p = products.find(x => x.id == id);

    if (!p || !p.name || p.price == null) {
        toast("Product data nahi mila!");
        return;
    }

    let item = cart.find(x => x.id == id && x.name);

    if (item) {
        item.qty++;
    } else {
        cart.push({ ...p, qty: 1 });
    }

    cart = cart.filter(x => x.id && x.name && x.price != null);
    save();
    toast("Added to cart!");
    location.reload();
}
function remove(id){cart=cart.filter(x=>x.id!=id);save();location.reload()}
function change(id,d){let x=cart.find(x=>x.id==id);if(!x)return;x.qty+=d;if(x.qty<=0)remove(id);save();location.reload()}
function total(){return cart.reduce((s,x)=>s+x.price*x.qty,0)}
function toast(t){let e=document.createElement("div");e.className="toast";e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),1800)}


function nav() {
    const role = localStorage.getItem("role");

    return `<div class="nav"><div class="container nav-inner">
        <a class="logo" href="index.html">V<span>Cart</span></a>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="products.html">Products</a>
            <a href="orders.html">My Orders</a>
            ${role === "ADMIN" ? '<a href="admin.html">Admin</a>' : ''}
            <a class="cart-btn" href="cart.html">🛒 Cart <span class="badge">${count()}</span></a>
        </div>
    </div></div>`;
}

function footer(){return `<footer class="footer"><div class="container row"><div><div class="logo">VCart</div><p>Simple. Fast. Reliable shopping.</p></div><p>© 2026 VCart • Learning Project</p></div></footer>`}
function card(p){return `<div class="card"><a href="product.html?id=${p.id}"><div class="product-img">${p.icon}</div></a><div class="card-body"><div class="small muted">${p.cat}</div><h3>${p.name}</h3><div class="price">${money(p.price)} <span class="old">${money(p.old)}</span></div><button class="btn btn-primary" onclick="add(${p.id})">Add to Cart</button></div></div>`}
function layout(content){document.getElementById("app").innerHTML=nav()+content+footer()}


async function home() {
     products = await fetchProducts();

    let top = products.slice(0, 4).map(card).join("");

    layout(`
        <section class="hero">
            <div class="container hero-grid">
                <div>
                    <div class="eyebrow">Welcome to VCart</div>
                    <h1>Everything you need, in one place.</h1>
                    <p>Discover quality products at great prices with a clean and simple shopping experience.</p>
                    <a class="btn btn-light" href="products.html">Shop Now →</a>
                </div>
                <div class="hero-art">🛍️</div>
            </div>
        </section>

        <section class="section container">
            <div class="section-head">
                <div>
                    <h2>Shop by category</h2>
                    <p class="muted">Find what you need quickly.</p>
                </div>
            </div>
            <div class="categories">
                <a class="category" href="products.html">💻<h3>Laptops</h3></a>
                <a class="category" href="products.html">📱<h3>Mobiles</h3></a>
                <a class="category" href="products.html">🎧<h3>Audio</h3></a>
                <a class="category" href="products.html">⌨️<h3>Accessories</h3></a>
            </div>
        </section>

        <section class="section container">
            <div class="section-head">
                <div>
                    <h2>Popular products</h2>
                    <p class="muted">Best picks from VCart.</p>
                </div>
                <a href="products.html" class="btn btn-dark">View All</a>
            </div>
            <div class="products">${top}</div>
        </section>
    `);
}

function productPage(){
let id=new URLSearchParams(location.search).get("id")||1,p=products.find(x=>x.id==id)||products[0];
layout(`<main class="container detail"><div class="detail-img">${p.icon}</div><div><div class="muted">${p.cat}</div><h1>${p.name}</h1><div class="price">${money(p.price)} <span class="old">${money(p.old)}</span></div><p class="muted">${p.desc}</p><div class="qty"><button onclick="changeDetail(-1)">−</button><span id="q">1</span><button onclick="changeDetail(1)">+</button></div><button class="btn btn-primary" onclick="addQty(${p.id})">Add to Cart</button> <a class="btn btn-dark" href="cart.html">Go to Cart</a></div></main>`);
window.dq=1;window.dp=p.id;
}
function changeDetail(d){window.dq=Math.max(1,window.dq+d);document.getElementById("q").textContent=window.dq}
function addQty(id){for(let i=0;i<window.dq;i++)add(id);}

function productsPage(){
let qs=new URLSearchParams(location.search), cat=qs.get("cat")||"";
layout(`<main class="container"><div class="page-title"><h1>All Products</h1><p class="muted">Explore our collection.</p></div><div class="filters"><div class="search"><input id="search" class="input" placeholder="Search products..." oninput="filterProducts()"></div><select id="cat" class="select" style="max-width:220px" onchange="filterProducts()"><option value="">All categories</option>${[...new Set(products.map(p=>p.cat))].map(x=>`<option>${x}</option>`).join("")}</select></div><div id="productGrid" class="products"></div></main>`);
document.getElementById("cat").value=cat;filterProducts();
}
function filterProducts(){let q=(document.getElementById("search")?.value||"").toLowerCase(),c=document.getElementById("cat")?.value||"";let list=products.filter(p=>(p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q))&&(!c||p.cat==c));document.getElementById("productGrid").innerHTML=list.length?list.map(card).join(""):`<div class="empty" style="grid-column:1/-1">No products found.</div>`}

function cartPage(){
let items=cart.map(x=>`<div class="cart-item"><div><b>${x.icon} ${x.name}</b><div class="muted">${money(x.price)} × ${x.qty}</div></div><div class="row"><button class="btn btn-danger" onclick="remove(${x.id})">Remove</button><button class="btn btn-dark" onclick="change(${x.id},-1)">−</button><b>${x.qty}</b><button class="btn btn-dark" onclick="change(${x.id},1)">+</button></div></div>`).join("");
layout(`<main class="container"><div class="page-title"><h1>Your Cart</h1><p class="muted">${count()} item(s)</p></div>${cart.length?`<div class="cart-layout"><div>${items}</div><div class="summary"><h2>Order Summary</h2><div><span>Subtotal</span><b>${money(total())}</b></div><div><span>Delivery</span><b>Free</b></div><div class="total"><span>Total</span><span>${money(total())}</span></div><a class="btn btn-primary" style="width:100%;text-align:center" href="checkout.html">Proceed to Checkout</a></div></div>`:`<div class="empty"><div style="font-size:60px">🛒</div><h2>Your cart is empty</h2><p class="muted">Add something you like.</p><a class="btn btn-primary" href="products.html" style="margin-top:15px">Start Shopping</a></div>`}</main>`);
}
function checkout(){
if(!cart.length){location.href="cart.html";return}
layout(`<main class="container"><div class="page-title"><h1>Checkout</h1><p class="muted">Enter your delivery details.</p></div><div class="checkout-layout"><div class="form-box" style="max-width:none;margin:0"><div class="form-group"><label>Full Name</label><input id="name" class="input" placeholder="Your name"></div><div class="form-group"><label>Phone</label><input id="phone" class="input" placeholder="10-digit mobile number"></div><div class="form-group"><label>Address</label><textarea id="address" class="input" rows="4" placeholder="House, street, city, state"></textarea></div><button class="btn btn-primary" onclick="placeOrder()">Place Order</button></div><div class="summary"><h2>Summary</h2><div><span>Items</span><b>${count()}</b></div><div class="total"><span>Total</span><span>${money(total())}</span></div></div></div></main>`);
}
function placeOrder(){let name=document.getElementById("name").value.trim(),phone=document.getElementById("phone").value.trim(),address=document.getElementById("address").value.trim();if(!name||phone.length<10||!address){toast("Please fill all details");return}let orders=JSON.parse(localStorage.getItem("orders"))||[];orders.unshift({id:"VC"+Date.now().toString().slice(-6),date:new Date().toLocaleDateString("en-IN"),items:cart,total:total(),name});localStorage.setItem("orders",JSON.stringify(orders));cart=[];save();location.href="success.html"}
function success(){layout(`<main class="success container"><div class="success-icon">✅</div><h1>Order Placed!</h1><p class="muted">Thank you for shopping with VCart.</p><a class="btn btn-primary" href="orders.html" style="margin-top:22px">View My Orders</a> <a class="btn btn-dark" href="products.html" style="margin-top:22px">Continue Shopping</a></main>`)}

function auth(type) {
    let reg = type === "register";

    layout(`
        <div class="form-box">
            <h1>${reg ? "Create account" : "Welcome back"}</h1>
            <p class="muted">
                ${reg ? "Join VCart today." : "Login to continue shopping."}
            </p>

            ${reg ? `
                <div class="form-group">
                    <label>Name</label>
                    <input id="authName" class="input" placeholder="Your name">
                </div>
            ` : ""}

            <div class="form-group">
                <label>Email</label>
                <input id="authEmail" class="input"
                       type="email" placeholder="you@example.com">
            </div>

            <div class="form-group">
                <label>Password</label>
                <input id="authPassword" class="input"
                       type="password" placeholder="Password">
            </div>

            <button class="btn btn-primary" onclick="submitAuth('${type}')">
                ${reg ? "Create Account" : "Login"}
            </button>

            <p class="small muted" style="margin-top:16px">
                ${reg
                    ? 'Already have an account? <a href="login.html">Login</a>'
                    : 'New to VCart? <a href="register.html">Create account</a>'}
            </p>
        </div>
    `);
}

async function submitAuth(type) {
    const reg = type === "register";

    const name = document.getElementById("authName")?.value.trim();
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;

    if (!email || !password || (reg && !name)) {
        toast("Please fill all details");
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/auth/${reg ? "register" : "login"}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    reg ? { name, email, password }
                        : { email, password }
                )
            }
        );

        const data = await response.json();

        if (!response.ok) {
            toast(data.message || data.error || "Authentication failed");
            return;
        }

        if (!reg) {
            const token = data.token || data.jwt;

            if (!token) {
                console.error("Login response:", data);
                toast("Login response mein token nahi mila");
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("role", data.role);
            toast("Login successful!");
            location.href = "index.html";
        } else {
            toast("Account created! Please login.");
            location.href = "login.html";
        }

    } catch (error) {
        console.error(error);
        toast("Backend se connection nahi hua");
    }
}

function orders(){let os=JSON.parse(localStorage.getItem("orders"))||[];layout(`<main class="container"><div class="page-title"><h1>My Orders</h1><p class="muted">Your recent VCart purchases.</p></div>${os.length?os.map(o=>`<div class="order"><div class="row"><div><b>Order #${o.id}</b><div class="muted">${o.date} • ${o.name}</div></div><b>${money(o.total)}</b></div><hr style="border:0;border-top:1px solid var(--border);margin:15px 0"><p>${o.items.map(x=>`${x.icon} ${x.name} × ${x.qty}`).join(" &nbsp; • &nbsp; ")}</p><p style="color:var(--success);font-weight:700;margin-top:8px">● Delivered / Processing</p></div>`).join(""):`<div class="empty">No orders yet.<br><a class="btn btn-primary" href="products.html" style="margin-top:15px">Shop Now</a></div>`}</main>`)}

async function admin() {
    const data = await fetchProducts();
    products = data;

    layout(`
        <main class="container">
            <div class="page-title">
                <h1>Admin Dashboard</h1>
                <p class="muted">Manage your store products.</p>
            </div>

            <div class="admin-grid">
                <div class="stat">Products<b>${products.length}</b></div>
                <div class="stat">Orders<b>${(JSON.parse(localStorage.getItem("orders")) || []).length}</b></div>
                <div class="stat">Cart Items<b>${count()}</b></div>
            </div>

            <section class="section">
                <div class="section-head">
                    <h2>Product Management</h2>
                    <button class="btn btn-primary" onclick="showProductForm()">
                        + Add Product
                    </button>
                </div>

                <div id="productForm"></div>

                <div class="products">
                    ${products.map(p => `
                        <div class="card">
                            <div class="product-img">${p.icon || "📦"}</div>
                            <div class="card-body">
                                <h3>${p.name}</h3>
                                <div class="price">${money(p.price)}</div>

                                <button class="btn btn-primary"
                                    onclick="editProduct(${p.id})">
                                    Edit Price
                                </button>

                                <button class="btn"
                                    onclick="deleteProduct(${p.id})">
                                    Delete
                                </button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </section>
        </main>
    `);
}


async function editProduct(id) {
    const p = products.find(item => item.id == id);
    if (!p) return;

    const newPrice = prompt("Enter new price:", p.price);

    if (newPrice === null || newPrice.trim() === "") return;

    if (!Number.isFinite(Number(newPrice)) || Number(newPrice) < 0) {
        alert("Please enter a valid price");
        return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name: p.name,
            price: Number(newPrice),
            quantity: p.quantity,
            description: p.description
        })
    });

    if (response.ok) {
        alert("Price updated successfully!");
        await admin();
    } else {
        alert("Price update failed: " + response.status);
    }
}

async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.ok) {
        alert("Product deleted successfully!");
        await admin();
    } else {
        alert("Delete failed: " + response.status);
    }
}

function showProductForm() {
    document.getElementById("productForm").innerHTML = `
        <div class="form-box">
            <h2>Add Product</h2>

            <div class="form-group">
                <label>Product Name</label>
                <input id="pName" class="input" placeholder="HP Laptop">
            </div>

            <div class="form-group">
                <label>Price</label>
                <input id="pPrice" class="input" type="number" placeholder="40000">
            </div>

            <div class="form-group">
                <label>Quantity</label>
                <input id="pQuantity" class="input" type="number" placeholder="5">
            </div>

            <div class="form-group">
                <label>Description</label>
                <input id="pDescription" class="input" placeholder="Product details">
            </div>

            <button class="btn btn-primary" onclick="saveProduct()">
                Save Product
            </button>
        </div>
    `;
}

async function saveProduct() {
    const name = document.getElementById("pName").value;
    const price = document.getElementById("pPrice").value;
    const quantity = document.getElementById("pQuantity").value;
    const description = document.getElementById("pDescription").value;

    if (!name || price === "" || quantity === "") {
        toast("Please fill all required fields");
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                price: Number(price),
                quantity: Number(quantity),
                description: description
            })
        });

        if (!response.ok) {
            toast("Product save nahi hua: " + response.status);
            return;
        }

        toast("Product added successfully!");
        await admin();

    } catch (error) {
        console.error(error);
        toast("Backend connection error");
    }
}

function renderNav(){}
let page=document.getElementById("app").dataset.page||"home";
if(page==="products")productsPage();else if(page==="product")productPage();else if(page==="cart")cartPage();else if(page==="checkout")checkout();else if(page==="success")success();else if(page==="login")auth("login");else if(page==="register")auth("register");else if(page==="orders")orders();else if(page==="admin")admin();else home();
