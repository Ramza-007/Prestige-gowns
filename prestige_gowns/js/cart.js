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
`;
document.body.appendChild(sideNav);

const menuBtn = document.querySelector('.menu');
if (menuBtn) {
    menuBtn.onclick = () => sideNav.classList.toggle('active');
}

// Wishlist
function toggleWishlist(el) {
    el.classList.toggle('active');
}

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
wa.innerHTML = '💬';
document.body.appendChild(wa);

