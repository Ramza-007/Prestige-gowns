let cart = JSON.parse(localStorage.getItem('cart')) || [];

//Function to add an item to the cart
function addToCart(name, price) {
    cart.push({ name, price });
    saveCart();
    renderCart();
}

// Remove a single item by index
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }
}

// Clear the entire cart
function clearCart() {
    if (cart.length === 0) return;
    if (!confirm('Clear all items from the cart?')) return;
    cart = [];
    saveCart();
    renderCart();
}

// Function saveCart()
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to render the cart and checkout summary
function renderCart() {
    const list = document.getElementById('cart-items');
    const total = document.getElementById('cart-total');
    const count = document.getElementById('cart-count');

    const checkoutList = document.getElementById('checkout-items');
    const summaryTotal = document.getElementById('summary-total');

    if (list) list.innerHTML = '';
    if (checkoutList) checkoutList.innerHTML = '';

    let sum = 0;

    cart.forEach((item, index) => {
        const priceNum = Number(item.price) || 0;
        sum += priceNum;

        // Sidebar cart list (if present)
        if (list) {
            const li = document.createElement('li');
            li.textContent = item.name + ' - R' + priceNum.toFixed(2);

            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.className = 'delete-item';
            delBtn.onclick = function () { removeFromCart(index); };

            li.appendChild(document.createTextNode(' '));
            li.appendChild(delBtn);
            list.appendChild(li);
        }

        // Checkout page list (if present)
        if (checkoutList) {
            const cli = document.createElement('li');
            cli.textContent = item.name + ' - R' + priceNum.toFixed(2);
            const delBtn2 = document.createElement('button');
            delBtn2.textContent = 'Remove';
            delBtn2.className = 'delete-item';
            delBtn2.onclick = function () { removeFromCart(index); };
            cli.appendChild(document.createTextNode(' '));
            cli.appendChild(delBtn2);
            checkoutList.appendChild(cli);
        }
    });

    if (total) total.textContent = 'Total: R' + sum.toFixed(2);
    if (summaryTotal) summaryTotal.textContent = 'Total: R' + sum.toFixed(2);
    if (count) count.textContent = cart.length;

    // Show or hide checkout button in sidebar cart
    const checkoutBtn = document.getElementById('goto-checkout');
    if (checkoutBtn) {
        if (cart.length > 0) {
            checkoutBtn.style.display = 'inline-block';
        } else {
            checkoutBtn.style.display = 'none';
        }
    }
}

renderCart();



// Place order handler for checkout
function placeOrder(e) {
    e.preventDefault();

    const form = e.target;
    const data = {
        name: form[0].value,
        email: form[1].value,
        institution: form[2].value,
        delivery_address: form[3].value,
        items: cart,
        total: cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
    };

    fetch("backend/place_order.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(() => {
            localStorage.removeItem('cart');
            cart = [];
            document.querySelector(".checkout").style.display = 'none';
            document.getElementById('confirmation').classList.add('show');
        });
}

// Note: do NOT auto-show confirmation or clear the cart on page load.
// The cart should only be cleared and the confirmation shown after a successful order
// (this is already handled inside placeOrder()).

// expose for inline use
window.placeOrder = placeOrder;

// Side Navigation
const sideNav = document.createElement('div');
sideNav.className = 'side-nav';
sideNav.innerHTML = `
    <h3>Prestige Gowns</h3>
    <a href="homepage.html">Home</a>
    <a href="services.html">Services</a>
    <a href="aboutus.html">About Us</a>
    <a href="contactus.html">Contact Us</a>
    <div class="nav-wa" aria-hidden="false">
      <hr class="wa-line">
      <a href="https://wa.me/27648668752" class="whatsapp side-whatsapp" aria-label="Chat on WhatsApp" title="Chat on WhatsApp" target="_blank" rel="noopener noreferrer">
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="false" focusable="false">
          <circle fill="#25D366" cx="12" cy="12" r="12"/>
          <path fill="#ffffff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.149-.198.297-.768.966-.941 1.164-.173.198-.347.223-.644.074-1.758-.867-2.905-1.543-4.07-3.276-.309-.385.309-.358.884-1.188.099-.198.05-.372-.025-.521-.074-.149-.672-1.612-.922-2.207-.242-.579-.487-.5-.672-.51l-.573-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.148.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.122-.272-.198-.57-.347z"/>
        </svg>
      </a>
      <hr class="wa-line">
    </div>
`;
document.body.appendChild(sideNav);

const menuBtn = document.querySelector('.menu');
if (menuBtn) {
    menuBtn.onclick = () => sideNav.classList.toggle('active');
}

// Wishlist
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function saveWishlist(){
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

function updateWishlistCount(){
    const el = document.getElementById('wishlist-count');
    if(el) el.textContent = wishlist.length;
}

function isInWishlist(name){
    return wishlist.some(i => i.name === name);
}

function toggleWish(name, price, btn){
    const idx = wishlist.findIndex(i => i.name === name);
    if(idx === -1){
        wishlist.push({name, price});
        if(btn) btn.classList.add('active');
    } else {
        wishlist.splice(idx,1);
        if(btn) btn.classList.remove('active');
    }
    saveWishlist();
    renderWishlist();
    updateWishButtons();
}

function toggleWishBtn(button){
    const product = button.closest('.product');
    const name = product.querySelector('h5').textContent.trim();
    const priceText = product.querySelector('span').textContent.replace(/[^0-9.]/g,'');
    const price = Number(priceText) || 0;
    toggleWish(name, price, button);
}

function removeFromWishlist(index){
    if(index >=0 && index < wishlist.length){
        wishlist.splice(index,1);
        saveWishlist();
        renderWishlist();
        updateWishButtons();
    }
}

function clearWishlist(){
    if(wishlist.length === 0) return;
    if(!confirm('Clear all items from wishlist?')) return;
    wishlist = [];
    saveWishlist();
    renderWishlist();
    updateWishButtons();
}

function addToCartFromWishlist(index){
    if(index >=0 && index < wishlist.length){
        const item = wishlist[index];
        addToCart(item.name, item.price);
        // optional: remove from wishlist after adding
        removeFromWishlist(index);
    }
}

function renderWishlist(){
    const list = document.getElementById('wishlist-items');
    if(!list) return;
    list.innerHTML = '';
    if(wishlist.length === 0){
        const li = document.createElement('li');
        li.textContent = 'Your wishlist is empty.';
        list.appendChild(li);
        updateWishlistCount();
        return;
    }
    wishlist.forEach((item, idx) => {
        const li = document.createElement('li');
        li.textContent = item.name + ' - R' + Number(item.price).toFixed(2);

        const btnWrap = document.createElement('span');

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add';
        addBtn.className = 'wishlist-add';
        addBtn.onclick = function(){ addToCartFromWishlist(idx); };

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Remove';
        delBtn.className = 'wishlist-remove';
        delBtn.onclick = function(){ removeFromWishlist(idx); };

        btnWrap.appendChild(addBtn);
        btnWrap.appendChild(document.createTextNode(' '));
        btnWrap.appendChild(delBtn);

        li.appendChild(btnWrap);
        list.appendChild(li);
    });
    updateWishlistCount();
}

function updateWishButtons(){
    const btns = document.querySelectorAll('.product .wish-btn');
    btns.forEach(btn =>{
        const product = btn.closest('.product');
        const name = product.querySelector('h5').textContent.trim();
        if(isInWishlist(name)) btn.classList.add('active'); else btn.classList.remove('active');
    });
}

// init wishlist UI
renderWishlist();
updateWishButtons();
updateWishlistCount();

// expose some functions globally for inline handlers
window.toggleWish = toggleWish;
window.toggleWishBtn = toggleWishBtn;
window.clearWishlist = clearWishlist;

// PAGINATION (Static Demo)
const pagination = document.createElement('div');
pagination.className = 'pagination';
// static demo pages
pagination.innerHTML = `<span class="active">1</span><span>2</span><span>3</span>`;
const products = document.querySelector('.products');
if (products) products.after(pagination);

// Whatsapp Button
const wa = document.createElement('a');
wa.href = 'https://wa.me/27648668752';
wa.className = 'whatsapp';
wa.setAttribute('aria-label', 'Chat on WhatsApp');
wa.setAttribute('title', 'Chat on WhatsApp');
wa.setAttribute('target', '_blank');
wa.setAttribute('rel', 'noopener noreferrer');
// WhatsApp SVG Icon
wa.innerHTML = `
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="false" focusable="false">
    <circle fill="#25D366" cx="12" cy="12" r="12"/>
    <path fill="#ffffff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.149-.198.297-.768.966-.941 1.164-.173.198-.347.223-.644.074-1.758-.867-2.905-1.543-4.07-3.276-.309-.385.309-.358.884-1.188.099-.198.05-.372-.025-.521-.074-.149-.672-1.612-.922-2.207-.242-.579-.487-.5-.672-.51l-.573-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.148.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.122-.272-.198-.57-.347z"/>
  </svg>
`;
document.body.appendChild(wa);

