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

/* Wishlist Rendering */
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

    // Populates wishlist items
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

// Updates wish buttons on products
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


// product image
function goToProductDetail(index) {
    const section = document.getElementById('product-detail');
    if (typeof index === 'number') {
        changeImage(index);
    }
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// expose for inline use
window.addEventListener('load', () => {
    if(window.location.hash === '#product-detail') {
        goToProductDetail();
    }
    // Ensure static product pages get interactive option handlers as well
    if (typeof attachOptionHandlers === 'function') attachOptionHandlers();
});

// product image handler
let currentIndex = 0;
let images = [];

const productsData = {
    belt: {
        id: 'belt',
        name: 'Belt Purchase',
        price: 350,
        description: 'Quality belt for graduations.',
        images: [
            "./_images/Belt.png.jpeg",
            "./_images/Belt 2.png.jpeg",
            "./_images/Belt 3.png.jpeg",
            "./_images/Belt 4.png.jpeg"
        ],
        options: {
            Institution: ['University of Johannesburg'],
            Qualification: ['Diploma', 'Advanced Diploma', 'Degree', 'Honours Degree'],
            Faculty: ['Business & Economics', 'Humanities', 'Education', 'Engineering', 'Health Sciences', 'Art & Design', 'Others'],
            Size: ['Small', 'Medium', 'Large', 'X-Large']
        }
    },

    'certificate-roll': {
        id: 'certificate-roll',
        name: 'Certificate Roll Purchase',
        price: 300,
        description: 'Quality certificate roll for graduations.',
        images: [
            "./_images/Roll Paper.png",
            "./_images/Roll Paper 2.png",
            "./_images/Roll Paper 3.jpg"
        ],
        options: {
            Institution: ['University of Johannesburg'],
            Qualification: ['Diploma', 'Advanced Diploma', 'Degree', 'Honours Degree'],
            Faculty: ['Business & Economics', 'Humanities', 'Education', 'Engineering', 'Health Sciences', 'Art & Design', 'Others'],
            Size: ['Small', 'Medium', 'Large', 'X-Large']
        }

    },

    'full-set': {
        id: 'full-set',
        name: 'Full Set Purchase',
        price: 2100,
        description: 'Quality full set for graduations.',
        images: [],
        options: {
            Institution: ['University of Johannesburg'],
            Qualification: ['Diploma', 'Advanced Diploma', 'Degree', 'Honours Degree'],
            Faculty: ['Business & Economics', 'Humanities', 'Education', 'Engineering', 'Health Sciences', 'Art & Design', 'Others'],
            Size: ['Small', 'Medium', 'Large', 'X-Large']
        }

    },

    'belt-hire': {
        id: 'belt-hire',
        name: 'Belt Hire',
        price: 150,
        description: 'Belt available for hire.',
        images: [
            "./_images/Belt 4.png.jpeg",
            "./_images/Belt.png.jpeg",
            "./_images/Belt 2.png.jpeg",
            "./_images/Belt 3.png.jpeg"
        ],
        options: {
            Institution: ['University of Johannesburg'],
            Qualification: ['Diploma', 'Advanced Diploma', 'Degree', 'Honours Degree'],
            Faculty: ['Business & Economics', 'Humanities', 'Education', 'Engineering', 'Health Sciences', 'Art & Design', 'Others'],
            Size: ['Small', 'Medium', 'Large', 'X-Large'],
        }
    }
};

function changeImage(index) {
    if (!images || images.length === 0) return;
    currentIndex = (index + images.length) % images.length;
    const el = document.getElementById('current-image');
    if (el) el.src = images[currentIndex];
}

function nextImage() {
    if (!images || images.length === 0) return;
    currentIndex = (currentIndex + 1) % images.length;
    changeImage(currentIndex);
}

function prevImage() {
    if (!images || images.length === 0) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    changeImage(currentIndex);
}

// Helper to find first existing element from a list of selectors
function findFirst(...selectors){
    for(const s of selectors){
        const el = document.querySelector(s);
        if(el) return el;
    }
    return null;
}

// Helper to find unique elements matching any of the selectors
function findAllUnique(selectors){
    const set = new Set();
    selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => set.add(el)));
    return Array.from(set);
}

// Option handler factory so we can (re)attach to dynamically created buttons
function attachOptionHandlers(){
    // Find option groups (support new and legacy markup)
    const groups = findAllUnique(['.option-group', '.option-row']);

    // Find Add To Cart button (support variants)
    const addToCartBtn = document.querySelector('.add-to-cart-btn, .addToCart, .add-cart, button[onclick="addProductDetailToCart()"]');

    function checkSelections(){
        // Determine which groups exist
        const presentGroups = groups.map(g => g.dataset.group || (g.querySelector('label') ? g.querySelector('label').textContent.trim().toLowerCase() : null)).filter(Boolean);
        const selectedGroups = groups.filter(g => g.querySelector('button.selected')).map(g => g.dataset.group || (g.querySelector('label') ? g.querySelector('label').textContent.trim().toLowerCase() : null)).filter(Boolean);

        // Only require groups that are present on the page
        const required = ['institution','qualification','faculty','size'].filter(r => presentGroups.includes(r));
        const ok = required.every(r => selectedGroups.includes(r));
        if(addToCartBtn) addToCartBtn.disabled = !ok;
    }

    // Attach handlers cleanly by replacing buttons with clones to remove existing listeners
    groups.forEach(group => {
        const buttons = Array.from(group.querySelectorAll('button'));
        buttons.forEach(btn => {
            const clone = btn.cloneNode(true);
            // preserve any existing aria-pressed attribute
            if(btn.hasAttribute('aria-pressed')) clone.setAttribute('aria-pressed', btn.getAttribute('aria-pressed'));
            btn.parentNode.replaceChild(clone, btn);
        });

        // Re-query clones and attach listeners
        const clonedButtons = Array.from(group.querySelectorAll('button'));
        clonedButtons.forEach(btn => {
            // set sensible default for ARIA
            btn.setAttribute('aria-pressed', 'false');
            btn.addEventListener('click', () => {
                clonedButtons.forEach(b => { b.classList.remove('selected'); b.setAttribute('aria-pressed', 'false'); });
                btn.classList.add('selected');
                btn.setAttribute('aria-pressed', 'true');
                checkSelections();
            });
        });

        // If group only has a single option, auto-select it
        if(clonedButtons.length === 1){
            clonedButtons[0].classList.add('selected');
            clonedButtons[0].setAttribute('aria-pressed', 'true');
        }
    });

    // Initial validation
    checkSelections();
} 

// build product page from productsData
function getQueryParam(name){
    return new URLSearchParams(window.location.search).get(name);
}

function buildProductPage(productId){
    const product = productsData[productId];
    if(!product) return false;

    images = product.images.slice();
    currentIndex = 0;

    // thumbnails (support legacy `.thumbnails` and newer `.thumbnails-column`)
    const thumbnails = document.querySelector('.thumbnails, .thumbnails-column');
    if(thumbnails){
        thumbnails.innerHTML = '';
        images.forEach((src, i) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = product.name + ' ' + (i+1);
            img.onclick = () => changeImage(i);
            thumbnails.appendChild(img);
        });
    }

    // main image
    const mainImage = document.getElementById('current-image');
    if(mainImage) mainImage.src = images[0];

    // product info
    const info = document.querySelector('.product-info');
    if(info){
        info.dataset.name = product.name;
        info.dataset.price = product.price;
        const title = document.getElementById('product-title'); if(title) title.textContent = product.name;
        const price = document.getElementById('product-price'); if(price) price.textContent = 'R' + Number(product.price).toFixed(2);
        const desc = info.querySelector('.desc'); if(desc) desc.textContent = product.description;

        // clear existing option groups (supports both new `.option-group` and legacy `.option-row`)
        info.querySelectorAll('.option-group, .option-row').forEach(el => el.remove());

        // insert options before Add To Cart button (support `.addToCart` and `.add-to-cart-btn`)
        const addBtn = info.querySelector('.addToCart, .add-to-cart-btn, button[onclick="addProductDetailToCart()"]');
        for(const [label, opts] of Object.entries(product.options)){
            const og = document.createElement('div'); og.className = 'option-group'; og.dataset.group = label.toLowerCase();
            const lab = document.createElement('label'); lab.textContent = label; og.appendChild(lab);
            const div = document.createElement('div'); div.className = 'Options';
            opts.forEach(o => { const b = document.createElement('button'); b.type='button'; b.textContent = o; div.appendChild(b); });
            og.appendChild(div);
            info.insertBefore(og, addBtn);
        }

        // attach handlers to new option buttons
        attachOptionHandlers();
    }

    return true;
}

function productInit(){
    const id = getQueryParam('id');
    if(!id) return;
    const ok = buildProductPage(id);
    if(!ok) console.warn('Product not found', id);
}

window.productInit = productInit;
window.attachOptionHandlers = attachOptionHandlers;

// add from product detail
function addProductDetailToCart() {
    const groups = document.querySelectorAll('.option-group, .option-row');
    const selections = [];
    groups.forEach(group => {
        // look for any selected button variant in the group
        const btn = group.querySelector('button.selected') ||
                    group.querySelector('.Options button.selected') ||
                    group.querySelector('.Option-values button.selected') ||
                    group.querySelector('.Options-values button.selected') ||
                    group.querySelector('.options button.selected');
        if (btn) selections.push(btn.textContent.trim());
    });
    if (selections.length !== groups.length) {
        alert('Please select all options before adding to cart.');
        return;
    }
    const info = document.querySelector('.product-info');
    const name = (info && info.dataset && info.dataset.name) ? info.dataset.name : 'Product';
    const price = (info && info.dataset && info.dataset.price) ? Number(info.dataset.price) : 0;
    const fullName = name + ' (' + selections.join(', ') + ')';
    addToCart(fullName, price);
    renderCart();
    alert('Item added to cart!');
}

window.addProductDetailToCart = addProductDetailToCart;