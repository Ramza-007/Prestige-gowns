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

    fetch("place_order.php", {
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
sideNav.setAttribute('role', 'dialog');
sideNav.setAttribute('aria-hidden', 'true');
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
// ensure the side nav is above other content
sideNav.style.zIndex = 1000;
document.body.appendChild(sideNav);

// overlay to capture outside clicks
const sideOverlay = document.createElement('div');
sideOverlay.className = 'side-overlay';
sideOverlay.setAttribute('aria-hidden', 'true');
// inline minimal styles so it works without CSS changes
sideOverlay.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.35); z-index:999;';
document.body.appendChild(sideOverlay);

const menuBtn = document.querySelector('.menu');
// aria init
if(menuBtn) menuBtn.setAttribute('aria-expanded', 'false');

function openSideNav(){
    sideNav.classList.add('active');
    sideOverlay.style.display = 'block';
    sideNav.setAttribute('aria-hidden', 'false');
    sideOverlay.setAttribute('aria-hidden', 'false');
    if(menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
}

function closeSideNav(){
    sideNav.classList.remove('active');
    sideOverlay.style.display = 'none';
    sideNav.setAttribute('aria-hidden', 'true');
    sideOverlay.setAttribute('aria-hidden', 'true');
    if(menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
}

if (menuBtn) {
    menuBtn.onclick = (e) => { e.stopPropagation(); if(sideNav.classList.contains('active')) closeSideNav(); else openSideNav(); };
}

// close when clicking overlay
sideOverlay.addEventListener('click', () => closeSideNav());

// close when clicking outside the side nav
document.addEventListener('click', (e) => {
    if (!sideNav.contains(e.target) && !(menuBtn && menuBtn.contains(e.target)) && sideNav.classList.contains('active')) {
        closeSideNav();
    }
});

// close with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideNav.classList.contains('active')) closeSideNav();
});

// close when navigating using the side nav links
sideNav.addEventListener('click', (e) => {
    if (e.target && e.target.tagName === 'A') {
        closeSideNav();
    }
});

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

    'bib': {
        id: 'bib',
        name: 'Bib Purchase',
        price: 500,
        description: 'Quality UJ bib for graduations.',
        images: [
            "./_images/Bib 1.png",
            "./_images/Bib 2.png"
        ],
        options: {
            Institution: ['University of Johannesburg'],
            Qualification: ['Diploma', 'Advanced Diploma', 'Degree', 'Honours Degree'],
            Faculty: ['Business & Economics', 'Humanities', 'Education', 'Engineering', 'Health Sciences', 'Art & Design', 'Others'],
            Size: ['Small', 'Medium', 'Large', 'X-Large']
        }
    },

    'hat': {
        id: 'hat',
        name: 'Hat Purchase',
        price: 350,
        description: 'Quality hat for graduations.',
        images:[
            "./_images/Hat.JPG"
        ],
        options: {
            Institution: ['University of Johannesburg'],
            Qualification: ['Diploma', 'Advanced Diploma', 'Degree', 'Honours Degree'],
            Faculty: ['Business & Economics', 'Humanities', 'Education', 'Engineering', 'Health Sciences', 'Art & Design', 'Others'],
            Size: ['Small', 'Medium', 'Large', 'X-Large']
        }
    },

    'gown': {
        id: 'gown',
        name: 'Gown Purchase',
        price: 900,
        description: 'Quality gown for graduations.',
        images: [
            "./_images/Gown.JPG",
            "./_images/Gown 2.jpeg"
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
            "./_images/Roll Paper 3.jpg",
            "./_images/Roll Paper 4.jpg"
        ],
        options: {
            Institution: ['University of Johannesburg'],
            Qualification: ['Diploma', 'Advanced Diploma', 'Degree', 'Honours Degree'],
            Faculty: ['Business & Economics', 'Humanities', 'Education', 'Engineering', 'Health Sciences', 'Art & Design', 'Others'],
            Size: ['Small', 'Medium', 'Large', 'X-Large']
        }
    },

    'full-set-hire': {
        id: 'full-set-hire',
        name: 'Full Set Hire',
        price: 350,
        description: 'Quality full set available for hire.',
        images: [
            "./_images/Full Set.JPG",
            "./_images/Belt 5.JPG",
            "./_images/Gown.JPG",
            "./_images/Hat.JPG",
            "./_images/Bib 1.png"
        ],
        options: {
            Institution: ['University of Johannesburg'],
            Qualification: ['Diploma', 'Advanced Diploma', 'Degree', 'Honours Degree'],
            Faculty: ['Business & Economics', 'Humanities', 'Education', 'Engineering', 'Health Sciences', 'Art & Design', 'Others'],
            Size: ['Small', 'Medium', 'Large', 'X-Large']
        }
    },


    'certificate-roll-hire': {
        id: 'certificate-roll-hire',
        name: 'Certificate Roll Hire',
        price: 150,
        description: 'Certificate roll available for hire.',
        images: [
            "./_images/Roll Paper.png",
            "./_images/Roll Paper 2.png",
            "./_images/Roll Paper 3.jpg",
            "./_images/Roll Paper 4.jpg"
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
        images: [
            "./_images/Full Set.JPG",
            "./_images/Belt 5.JPG",
            "./_images/Gown.JPG",
            "./_images/Hat.JPG",
            "./_images/Bib 1.png"
        ],
        options: {
            Institution: ['University of Johannesburg'],
            Qualification: ['Diploma', 'Advanced Diploma', 'Degree', 'Honours Degree'],
            Faculty: ['Business & Economics', 'Humanities', 'Education', 'Engineering', 'Health Sciences', 'Art & Design', 'Others'],
            Size: ['Small', 'Medium', 'Large', 'X-Large']
        }

    },

    'bib-hire': {
        id: 'bib-hire',
        name: 'Bib Hire',
        price: 250,
        description: 'Bib available for hire.',
        images: [
            "./_images/Bib 1.png",
            "./_images/Bib 2.png",
            "./_images/Bib 3.JPG"
        ],
        options: {
            Institution: ['University of Johannesburg'],
            Qualification: ['Diploma', 'Advanced Diploma', 'Degree', 'Honours Degree'],
            Faculty: ['Business & Economics', 'Humanities', 'Education', 'Engineering', 'Health Sciences', 'Art & Design', 'Others'],
            Size: ['Small', 'Medium', 'Large', 'X-Large'],
        }
    },

    'hat-hire': {
        id: 'hat-hire',
        name: 'Hat Hire',
        price: 150,
        description: 'Hat available for hire.',
        images: [
            "./_images/Hat.JPG"
        ],
        options: {
            Institution: ['University of Johannesburg'],
            Qualification: ['Diploma', 'Advanced Diploma', 'Degree', 'Honours Degree'],
            Faculty: ['Business & Economics', 'Humanities', 'Education', 'Engineering', 'Health Sciences', 'Art & Design', 'Others'],
            Size: ['Small', 'Medium', 'Large', 'X-Large'],
        }
    },

    'gown-hire': {
        id: 'gown-hire',
        name: 'Gown Hire',
        price: 200,
        description: 'Gown available for hire.',
        images: [
            "./_images/Gown.JPG",
            "./_images/Gown 2.jpeg"
        ],
        options: {
            Institution: ['University of Johannesburg'],
            Qualification: ['Diploma', 'Advanced Diploma', 'Degree', 'Honours Degree'],
            Faculty: ['Business & Economics', 'Humanities', 'Education', 'Engineering', 'Health Sciences', 'Art & Design', 'Others'],
            Size: ['Small', 'Medium', 'Large', 'X-Large'],
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
// Accepts an optional root element (defaults to document) so we can scope to modals
function attachOptionHandlers(root = document){
    // Find all option groups within the root (support new and legacy markup)
    const allGroups = Array.from(root.querySelectorAll('.option-group, .option-row'));
    if (allGroups.length === 0) return;

    // Build a set of containers that own option groups (product-info, product, or option-container)
    const containers = new Set();
    allGroups.forEach(g => {
        // If root is document, skip modal groups to avoid attaching modal handlers globally
        if (root === document && g.closest('#product-modal')) return;
        const c = g.closest('.product-info') || g.closest('.product') || g.closest('.option-container') || document.body;
        if (c) containers.add(c);
    });

    // For each container, scope the handlers and validation to that container
    containers.forEach(container => {
        const groups = Array.from(container.querySelectorAll('.option-group, .option-row'));
        if (groups.length === 0) return;

        // Find Add To Cart button within this container (support variants)
        const addToCartBtn = container.querySelector('.add-to-cart-btn, .addToCart, .add-cart, button[onclick="addProductDetailToCart()"]');

        function checkSelections(){
            // Normalize group names (dataset.group may be capitalized in static HTML)
            const presentGroups = groups.map(g => (g.dataset.group ? g.dataset.group.trim().toLowerCase() : (g.querySelector('label') ? g.querySelector('label').textContent.trim().toLowerCase() : null))).filter(Boolean);
            const selectedGroups = groups.filter(g => g.querySelector('button.selected')).map(g => (g.dataset.group ? g.dataset.group.trim().toLowerCase() : (g.querySelector('label') ? g.querySelector('label').textContent.trim().toLowerCase() : null))).filter(Boolean);
            const required = ['institution','qualification','faculty','size'].filter(r => presentGroups.includes(r));
            const ok = required.every(r => selectedGroups.includes(r));
            if (addToCartBtn){
                addToCartBtn.disabled = !ok;
                // keep ARIA state in sync for assistive tech
                addToCartBtn.setAttribute('aria-disabled', String(addToCartBtn.disabled));
            }
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

        // Initial validation for this container
        checkSelections();
    });
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
    // if there are option groups present require selection for all groups
    if (groups.length > 0 && selections.length !== groups.length) {
        showToast('Please select all options before adding to cart.', 'error');
        return;
    }
    const info = document.querySelector('.product-info');
    const name = (info && info.dataset && info.dataset.name) ? info.dataset.name : 'Product';
    const price = (info && info.dataset && info.dataset.price) ? Number(info.dataset.price) : 0;
    const fullName = name + (selections.length ? ' (' + selections.join(', ') + ')' : '');
    addToCart(fullName, price);
    renderCart();
    // close modal if open
    closeProductModal();
    showToast('Item added to cart!', 'success');
}

window.addProductDetailToCart = addProductDetailToCart;


// Product options modal (used on product pages and listing pages)
function closeProductModal(){
    const overlay = document.getElementById('product-modal-overlay');
    if(overlay){
        document.removeEventListener('keydown', window._productModalEscHandler);
        overlay.remove();
    }
}

function openProductOptions(productId, triggerEl){
    const product = productsData[productId];
    if(!product){
        // fallback: directly add plain item
        addToCart(productId, 0);
        renderCart();
        showToast('Item added to cart!', 'success');
        return;
    }

    // prevent multiple modals
    if(document.getElementById('product-modal-overlay')) return;

    // overlay
    const overlay = document.createElement('div');
    overlay.id = 'product-modal-overlay';
    overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:2000;';

    // modal
    const modal = document.createElement('div');
    modal.id = 'product-modal';
    modal.className = 'product-modal';
    modal.style.cssText = 'background:#fff; padding:20px; max-width:560px; width:90%; max-height:90vh; overflow:auto; border-radius:8px; box-shadow:0 10px 40px rgba(0,0,0,0.3);';

    modal.innerHTML = `
      <button class="modal-close" aria-label="Close" style="float:right; background:none; border:none; font-size:20px; cursor:pointer;">×</button>
      <h2>${product.name}</h2>
      <p class="desc">${product.description || ''}</p>
      <div class="product-info" data-name="${product.name}" data-price="${product.price}">
        <h3 id="product-price-modal">R${Number(product.price).toFixed(2)}</h3>
        <div class="option-container"></div>
        <div style="margin-top:12px;">
          <button class="addToCart">Add To Cart</button>
          <button class="modal-cancel" style="margin-left:8px;">Cancel</button>
        </div>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // populate option groups
    const container = modal.querySelector('.option-container');
    Object.entries(product.options || {}).forEach(([label, opts])=>{
        const og = document.createElement('div'); og.className = 'option-group'; og.dataset.group = label.toLowerCase();
        const lab = document.createElement('label'); lab.textContent = label; og.appendChild(lab);
        const div = document.createElement('div'); div.className = 'Options';
        opts.forEach(o => { const b = document.createElement('button'); b.type='button'; b.textContent = o; div.appendChild(b); });
        og.appendChild(div);
        container.appendChild(og);
    });

    // wire up option handlers and validation scoped to the modal
    const modalAddBtn = modal.querySelector('.addToCart');
    const modalGroups = modal.querySelectorAll('.option-group, .option-row');

    // attach handlers scoped to the modal so selection toggles work
    attachOptionHandlers(modal);

    // initialize disabled state if there are option groups (attachOptionHandlers will run initial validation too)
    if (modalAddBtn && modalGroups.length > 0) {
        modalAddBtn.disabled = true;
        modalAddBtn.setAttribute('aria-disabled', 'true');
    }

    // Modal Add To Cart: collect selections within modal, validate, add to cart, then close
    if (modalAddBtn) {
        modalAddBtn.addEventListener('click', () => {
            const groups = modal.querySelectorAll('.option-group, .option-row');
            const selections = [];
            groups.forEach(group => {
                const btn = group.querySelector('button.selected');
                if (btn) selections.push(btn.textContent.trim());
            });

            if (groups.length > 0 && selections.length !== groups.length) {
                showToast('Please select all options before adding to cart.', 'error');
                return;
            }

            const info = modal.querySelector('.product-info');
            const name = (info && info.dataset && info.dataset.name) ? info.dataset.name : product.name;
            const price = (info && info.dataset && info.dataset.price) ? Number(info.dataset.price) : Number(product.price) || 0;
            const fullName = name + (selections.length ? ' (' + selections.join(', ') + ')' : '');

            addToCart(fullName, price);
            renderCart();
            closeProductModal();
            showToast('Item added to cart!', 'success');
        });
    }
    // listeners
    modal.querySelector('.modal-close').addEventListener('click', closeProductModal);
    modal.querySelector('.modal-cancel').addEventListener('click', closeProductModal);
    overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeProductModal(); });

    // ESC handling
    window._productModalEscHandler = function(e){ if(e.key === 'Escape') closeProductModal(); };
    document.addEventListener('keydown', window._productModalEscHandler);

    // focus first option if present
    const firstBtn = modal.querySelector('.option-group button');
    if(firstBtn) firstBtn.focus();
}

function changeImage(index) {
    const img = document.getElementById("current-image");
    if (!img || !images || images.length === 0) return;

    img.classList.add("fade-out");

    setTimeout(() => {
        img.src = images[index];
        img.classList.remove("fade-out");
        img.classList.add("fade-in");
        // remove the fade-in state after the animation so classes don't accumulate
        setTimeout(() => img.classList.remove("fade-in"), 400);
    }, 180);
} 

document.querySelectorAll('.addToCart, .add-to-cart-btn, .add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.add('added');
        setTimeout(() => btn.classList.remove('added'), 600);
    });
});


// expose for inline use
window.openProductOptions = openProductOptions;