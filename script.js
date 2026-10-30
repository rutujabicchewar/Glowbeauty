// Sample product data. Edit this list to change the website's products.
const products = [
  {id:1,name:"Matte Lipstick",category:"Lips",type:"Lip Makeup",price:250,images: "images/lipstick2.png",description:"A rich, velvety finish for everyday confidence."},
  {id:2,name:"Liquid Foundation",category:"Face",type:"Face Makeup",price:300,images: "images/foundation.png",description:"Lightweight coverage with a smooth finish."},
  {id:3,name:"Eyeshadow Palette",category:"Eyes",type:"Eye Makeup",price:156,images: "images/eyeshadow.png",description:"Versatile shades for day and evening looks."},
  {id:4,name:"Mascara",category:"Eyes",type:"Eye Makeup",price:220,images: "images/maskara.png",description:"Define and lift your lashes with every swipe."},
  {id:5,name:"Compact Powder",category:"Face",type:"Face Makeup",price:380,images: "images/compact.png",description:"A soft matte finish for quick touch-ups."},
  {id:6,name:"Rosy Blush",category:"Face",type:"Cheek Makeup",price:260,images: "images/blash.png",description:"A fresh pop of color for a natural flush."},
  {id:7,name:"Precision Eyeliner",category:"Eyes",type:"Eye Makeup",price:220,images: "images/eyeliner.png",description:"Create a fine line or a dramatic wing."},
  {id:8,name:"Makeup Brush Set",category:"Tools",type:"Beauty Tools",price:190,images: "images/brush.png",description:"Soft brushes for blending and easy application."},
  {id:9,name:"Makeup Fixer",category:"Fixer",type:"Makeup Fixer",price:350,images: "images/makeupfixer.png",description:"The ultimate final touch for a look that lasts."},
  {id:10,name:"Moisturizer",category:"Face",type:"Face Makeup",price:150,images: "images/moisturizer.png",description:"Prepare skin for good makeup"},
  {id:11,name:"Primer",category:"Face",type:"Face Makeup",price:184,images: "images/primer.png",description:"smooth bridge between your skincare and foundation"},
  {id:12,name:"Highlighter",category:"Face",type:"Face Makeup",price:240,images: "images/highlighter.png",description:"reflecting light off the high points of your face to add brightness,and radiant glow"}
]






const starterReviews = [
  {id:"sample-1",name:"Priya",product:"Matte Lipstick",rating:5,text:"The lipstick feels comfortable and the shade is beautiful!",date:"2026-08-12"},
  {id:"sample-2",name:"Anjali",product:"Liquid Foundation",rating:5,text:"Lightweight and smooth for everyday makeup.",date:"2026-08-05"},
  {id:"sample-3",name:"Neha",product:"Eyeshadow Palette",rating:5,text:"Lovely colors that blend easily.",date:"2026-07-28"}
];
const REVIEW_KEY = "glowbeauty-reviews-v1";
let cart = [];
let activeFilter = "All";
const $ = (selector) => document.querySelector(selector);
const money = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

function readReviews() {
  try {
    const saved = localStorage.getItem(REVIEW_KEY);
    return saved ? JSON.parse(saved) : starterReviews;
  } catch {
    return starterReviews;
  }
}
let reviews = readReviews();

function saveReviews() {
  try {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews));
    return true;
  } catch {
    return false;
  }
}
function showPage(id) {
  document.querySelectorAll(".page").forEach(section => section.classList.toggle("active", section.id === id));
  document.querySelectorAll(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.page === id));
  window.scrollTo({top:0,behavior:"smooth"});
}
function toast(message) {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 2200);
}
function renderProducts() {
  const query = $("#search").value.trim().toLowerCase();
  const filtered = products.filter(p => (activeFilter === "All" || p.category === activeFilter) &&
    (p.name + " " + p.type).toLowerCase().includes(query));
  $("#productGrid").innerHTML = filtered.length ? filtered.map(p => `
    <article class="product-card"><div class="product-art"> <img src="${p.images}" alt="${p.name}" class="product-image"
         onerror="this.style.display='none'"></div><h3>${p.name}</h3>
    <div class="category">${p.type}</div><p class="description">${p.description}</p>
    <div class="product-bottom"><strong>${money(p.price)}</strong><button class="small-button" data-add="${p.id}">Add to cart</button></div></article>`).join("") :
    '<p>No products found. Try another search.</p>';
}
function renderPrices() {
  $("#priceRows").innerHTML = products.map(p => `<tr><td>${p.emoji} ${p.name}</td><td>${p.type}</td><td><strong>${money(p.price)}</strong></td><td><button class="small-button" data-add="${p.id}">Add</button></td></tr>`).join("");
}
function renderReviewProductOptions() {
  $("#reviewProduct").innerHTML = products.map(p => `<option>${p.name}</option>`).join("");
}
function renderReviews() {
  const total = reviews.length;
  const average = total ? reviews.reduce((sum,r) => sum + Number(r.rating), 0) / total : 0;
  $("#averageRating").textContent = average.toFixed(1);
  $("#averageStars").textContent = "★".repeat(Math.round(average)) + "☆".repeat(5-Math.round(average));
  $("#reviewCount").textContent = `${total} ${total === 1 ? "review" : "reviews"}`;
  $("#reviewList").innerHTML = total ? [...reviews].reverse().map(r => `
    <article class="review-card"><div class="review-card-head"><div><h4>${escapeHTML(r.name)}</h4>
    <span class="stars">${"★".repeat(Number(r.rating))}${"☆".repeat(5-Number(r.rating))}</span></div><time>${escapeHTML(r.date)}</time></div>
    <p>${escapeHTML(r.text)}</p><div class="review-product">Product: ${escapeHTML(r.product)}</div></article>`).join("") :
    "<p>No reviews yet. Be the first to write one!</p>";
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
document.querySelectorAll(".nav-link").forEach(button => button.addEventListener("click", () => showPage(button.dataset.page)));
$("#shopNow").addEventListener("click", () => $("#productGrid").scrollIntoView({behavior:"smooth"}));
$("#search").addEventListener("input", renderProducts);
$("#categoryFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".pill").forEach(pill => pill.classList.toggle("active", pill === button));
  renderProducts();
});
document.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const product = products.find(p => p.id === Number(button.dataset.add));
  cart.push(product); $("#cartCount").textContent = cart.length;
  toast(`${product.name} added to your cart.`);
});
$("#cartButton").addEventListener("click", () => {
  if (!cart.length) return toast("Your cart is empty.");
  const total = cart.reduce((sum,p) => sum + p.price, 0);
  if (confirm(`Cart: ${cart.map(p=>p.name).join(", ")}\nTotal: ${money(total)}\n\nClear demo cart?`)) {
    cart = []; $("#cartCount").textContent = "0"; toast("Cart cleared.");
  }
});
$("#reviewForm").addEventListener("submit", event => {
  event.preventDefault();
  const review = {
    id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    name: $("#reviewName").value.trim(),
    product: $("#reviewProduct").value,
    rating: Number($("#reviewRating").value),
    text: $("#reviewText").value.trim(),
    date: new Date().toISOString().slice(0,10)
  };
  if (!review.name || !review.text) return;
  reviews.push(review);
  const saved = saveReviews();
  renderReviews();
  event.target.reset();
  $("#reviewStatus").textContent = saved ? "Thank you! Your review has been saved in this browser." :
    "Review added for this session, but browser storage is unavailable.";
});

const SERVICE_ID = 'service_cesqzjk';
const TEMPLATE_ID = 'template_pvnjesl';
const PUBLIC_KEY =  '0fvyQIss2Ileg8imM';

$("#contactForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const status = $("#contactStatus");
  const button = form.querySelector('button[type="submit"]');

  button.disabled = true;
  button.textContent = "Sending...";
  status.textContent = "";

  try {
    await emailjs.sendForm(
      SERVICE_ID,
      TEMPLATE_ID,
      form,
      { publicKey: PUBLIC_KEY }
    );

    status.textContent = "Message sent successfully!";
    form.reset();
  } catch (error) {
    console.error("EmailJS error:", error);
    status.textContent =
      "Message could not be sent. Please try again.";
  } finally {
    button.disabled = false;
    button.textContent = "Send us a message";
  }
});

renderProducts(); renderPrices(); renderReviewProductOptions(); renderReviews();
