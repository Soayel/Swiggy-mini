const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }
const foods = [
  {id:1,name:"Chicken Biryani",restaurant:"Demo Kitchen",price:189,category:"Biryani",emoji:"🍛",desc:"Aromatic rice with spicy chicken"},
  {id:2,name:"Veg Biryani",restaurant:"Spice Corner",price:149,category:"Biryani",emoji:"🥘",desc:"Fragrant rice and vegetables"},
  {id:3,name:"Margherita Pizza",restaurant:"Pizza Studio",price:199,category:"Pizza",emoji:"🍕",desc:"Classic cheese and tomato"},
  {id:4,name:"Cheese Burger",restaurant:"Burger Point",price:129,category:"Burger",emoji:"🍔",desc:"Loaded with cheese and sauce"},
  {id:5,name:"Chocolate Cake",restaurant:"Sweet Treats",price:99,category:"Dessert",emoji:"🍰",desc:"Rich and soft chocolate cake"},
  {id:6,name:"Paneer Pizza",restaurant:"Pizza Studio",price:229,category:"Pizza",emoji:"🍕",desc:"Paneer, capsicum and cheese"}
];
let cart = {};
let category = "All";
const $ = id => document.getElementById(id);
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function renderFoods(){
 const q=$("search").value.trim().toLowerCase();
 const shown=foods.filter(f=>(category==="All"||f.category===category)&&(`${f.name} ${f.restaurant} ${f.category}`).toLowerCase().includes(q));
 $("empty").classList.toggle("hidden",shown.length>0);
 $("food-list").innerHTML=shown.map(f=>`<article class="food-card"><div class="food-image">${f.emoji}</div><div class="food-info"><h3>${f.name}</h3><p>${f.restaurant} · ${f.desc}</p><div class="food-bottom"><span>₹${f.price}</span>${cart[f.id]?`<div class="qty"><button class="qty-btn" data-minus="${f.id}">−</button>${cart[f.id]}<button class="qty-btn" data-plus="${f.id}">+</button></div>`:`<button class="add-btn" data-add="${f.id}">ADD +</button>`}</div></div></article>`).join("");
}
function renderCart(){
 const ids=Object.keys(cart).filter(id=>cart[id]>0);const count=ids.reduce((n,id)=>n+cart[id],0);const total=ids.reduce((n,id)=>n+foods.find(f=>f.id==id).price*cart[id],0);
 $("cart-count").textContent=`${count} item${count===1?"":"s"}`;$("nav-count").textContent=count;$("subtotal").textContent=`₹${total}`;$("checkout").disabled=!count;
 $("cart-items").innerHTML=count?ids.map(id=>{const f=foods.find(x=>x.id==id);return `<div class="cart-row"><div>${f.emoji} ${f.name}<small>₹${f.price} × ${cart[id]}</small></div><div class="qty"><button class="qty-btn" data-minus="${id}">−</button>${cart[id]}<button class="qty-btn" data-plus="${id}">+</button></div></div>`}).join(""):`<p class="muted">Your cart is empty. Add something tasty!</p>`;
}
function update(id,delta){cart[id]=Math.max(0,(cart[id]||0)+delta);if(!cart[id])delete cart[id];renderFoods();renderCart()}
document.addEventListener("click",e=>{
 const a=e.target.closest("[data-add]"),p=e.target.closest("[data-plus]"),m=e.target.closest("[data-minus]");
 if(a){update(a.dataset.add,1);toast("Added to cart")}
 if(p)update(p.dataset.plus,1);if(m)update(m.dataset.minus,-1);
 const c=e.target.closest(".category");if(c){category=c.dataset.category;document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===c));renderFoods()}
});
$("search").addEventListener("input",renderFoods);
$("clear-cart").onclick=()=>{cart={};renderFoods();renderCart()};
$("checkout").onclick=()=>{$("checkout-panel").classList.remove("hidden");$("checkout-panel").scrollIntoView({behavior:"smooth"})};
$("back-cart").onclick=()=>$("checkout-panel").classList.add("hidden");
$("place-demo").onclick=()=>{if(!$("customer-name").value.trim()||!$("address").value.trim()){toast("Enter your name and address");return}toast("Demo order created — no real order was sent");};
$("cart-nav").onclick=()=>$("cart-panel").scrollIntoView({behavior:"smooth"});
$("home-nav").onclick=()=>window.scrollTo({top:0,behavior:"smooth"});
if(tg?.initDataUnsafe?.user){const u=tg.initDataUnsafe.user;$("location").textContent=u.first_name||"Welcome"}
renderFoods();renderCart();