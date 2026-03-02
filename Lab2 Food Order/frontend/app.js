// === MOCK DATA & STATE ===
const API_URL = 'http://localhost:3000/api';
let cart = [];
let orders = [];

const menuItems = [
    {
        id: 'm1',
        name: 'Gourmet Truffle Burger',
        description: 'Dry-aged beef patty with truffle mayo, melted gruyere, and caramelized onions on a brioche bun.',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'm2',
        name: 'Artisan Margherita Pizza',
        description: 'Wood-fired crust topped with San Marzano tomato sauce, fresh buffalo mozzarella, and basil.',
        price: 16.50,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'm3',
        name: 'Classic Caesar Salad',
        description: 'Crisp romaine lettuce, house-made croutons, shaved parmesan, and our signature Caesar dressing.',
        price: 12.00,
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=600&auto=format&fit=crop'
    }
];

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCartUI();
    fetchOrders(); // Initial GET /orders
});

// === REST: [GET] /menu-items ===
function renderMenu() {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    menuItems.forEach(item => {
        const col = document.createElement('div');
        // Bootstrap 12-column grid system (responsive)
        col.className = 'col-12 col-md-6 col-lg-4 d-flex align-items-stretch';
        
        col.innerHTML = `
            <div class="card glass-card w-100">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body d-flex flex-column text-white">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title text-truncate m-0" title="${item.name}">${item.name}</h5>
                        <span class="price-tag">$${item.price.toFixed(2)}</span>
                    </div>
                    <p class="card-text text-muted flex-grow-1" style="font-size: 0.9rem;">
                        ${item.description}
                    </p>
                    <button class="btn btn-outline-light mt-auto rounded-pill" onclick="addToCart('${item.id}')">
                        <i class="bi bi-plus-lg"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// === CART LOGIC (Local State before POST) ===
function addToCart(itemId) {
    const item = menuItems.find(m => m.id === itemId);
    const existing = cart.find(c => c.id === itemId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    showToast(`Added ${item.name} to cart!`, 'success');
    updateCartUI();
}

function removeFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Update Offcanvas Content
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted mt-5">Your cart is empty.</p>';
        cartTotal.innerText = '$0.00';
        checkoutBtn.disabled = true;
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const el = document.createElement('div');
        el.className = 'd-flex justify-content-between align-items-center mb-3 text-white';
        el.innerHTML = `
            <div>
                <h6 class="mb-0 text-truncate" style="max-width: 150px;">${item.name}</h6>
                <small class="text-muted">${item.quantity} x $${item.price.toFixed(2)}</small>
            </div>
            <div class="d-flex align-items-center">
                <span class="me-3 fw-bold">$${itemTotal.toFixed(2)}</span>
                <button class="btn btn-sm btn-danger rounded-circle p-1" style="width: 25px; height: 25px; line-height: 0;" onclick="removeFromCart('${item.id}')">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(el);
    });

    cartTotal.innerText = `$${total.toFixed(2)}`;
    checkoutBtn.disabled = false;
    
    // Attach REST POST handler
    checkoutBtn.onclick = () => submitOrder(total);
}

// === REST: [POST] /orders ===
async function submitOrder(totalAmount) {
    // Formatting the payload according to backend specification
    const payload = {
        restaurantId: 'rest_001', // Static for this prototype
        items: cart.map(c => ({
            menuItemId: c.id,
            quantity: c.quantity,
            price: c.price
        })),
        totalAmount: totalAmount
    };

    try {
        /*
        // REAL API CALL (if backend was running):
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer placeholder' },
            body: JSON.stringify(payload)
        });
        const savedOrder = await res.json();
        */

        // MOCK API CALL for UI prototyping
        showToast('Processing order... POST /orders', 'info');
        
        setTimeout(() => {
            const newOrder = {
                _id: 'ord_' + Math.random().toString(36).substr(2, 9),
                totalAmount: payload.totalAmount,
                status: 'pending',
                items: cart, // storing full item data for UI display mock
                createdAt: new Date().toISOString()
            };
            
            orders.unshift(newOrder); // Add to local orders array
            cart = []; // Empty cart
            updateCartUI();
            renderOrders(); // Refresh GET /orders view
            
            // Close offcanvas
            const offcanvasEl = document.getElementById('cartOffcanvas');
            const offcanvasInfo = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (offcanvasInfo) offcanvasInfo.hide();
            
            showToast('Order created successfully! (201 Created)', 'success');
        }, 800);

    } catch (error) {
        showToast('Error placing order.', 'danger');
    }
}

// === REST: [GET] /orders ===
function fetchOrders() {
    /*
    // REAL API CALL
    const res = await fetch(`${API_URL}/orders`, { headers: { 'Authorization': 'Bearer ...' }});
    orders = await res.json();
    */
    renderOrders();
}

function renderOrders() {
    const container = document.getElementById('active-orders-container');
    const msg = document.getElementById('no-orders-msg');
    
    // Clear old items
    Array.from(container.children).forEach(child => {
        if (child.id !== 'no-orders-msg') child.remove();
    });

    if (orders.length === 0) {
        msg.style.display = 'block';
        return;
    }
    
    msg.style.display = 'none';

    orders.forEach(order => {
        const itemNames = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
        
        const el = document.createElement('div');
        el.className = 'order-item text-white';
        el.innerHTML = `
            <div class="d-flex flex-column">
                <span class="fw-bold mb-1">Order #${order._id.substring(4, 9).toUpperCase()}</span>
                <span class="text-muted small mb-2"><i class="bi bi-clock"></i> ${new Date(order.createdAt).toLocaleTimeString()}</span>
                <span class="small" style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${itemNames}</span>
            </div>
            <div class="d-flex flex-column align-items-end">
                <span class="fs-5 fw-bold text-primary mb-2">$${order.totalAmount.toFixed(2)}</span>
                <div class="d-flex gap-2">
                    ${order.status === 'pending' 
                        ? `<button class="btn btn-sm btn-outline-warning" onclick="updateOrderStatus('${order._id}', 'cancelled')">Cancel (PUT)</button>` 
                        : `<span class="badge bg-secondary">${order.status}</span>`}
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteOrder('${order._id}')"><i class="bi bi-trash"></i> (DEL)</button>
                </div>
            </div>
        `;
        container.appendChild(el);
    });
}

// === REST: [PUT] /orders/:id ===
async function updateOrderStatus(orderId, newStatus) {
    showToast(`Sending PUT /orders/${orderId} ...`, 'info');
    
    setTimeout(() => {
        const orderIndex = orders.findIndex(o => o._id === orderId);
        if (orderIndex > -1) {
            orders[orderIndex].status = newStatus;
            renderOrders();
            showToast('Order status updated (200 OK)', 'success');
        }
    }, 500);
}

// === REST: [DELETE] /orders/:id ===
async function deleteOrder(orderId) {
    if(!confirm('Are you sure you want to delete this order history?')) return;
    
    showToast(`Sending DELETE /orders/${orderId} ...`, 'info');
    
    setTimeout(() => {
        orders = orders.filter(o => o._id !== orderId);
        renderOrders();
        showToast('Order deleted successfully (204 No Content)', 'success');
    }, 500);
}

// === UTILS ===
function showToast(message, type = 'info') {
    const toastEl = document.getElementById('liveToast');
    const titleEl = document.getElementById('toast-title');
    const bodyEl = document.getElementById('toast-body');
    const timeEl = document.getElementById('toast-time');
    
    const now = new Date();
    timeEl.innerText = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    titleEl.innerText = type === 'success' ? 'Success' : type === 'danger' ? 'Error' : 'Notification';
    titleEl.className = `me-auto fw-bold text-${type}`;
    bodyEl.innerText = message;
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}
