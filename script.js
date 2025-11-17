let cart = [];

// Add to Cart
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    updateCart();
    openCartDrawer();
  });
});

// Buy Now
document.querySelectorAll('.buy-now').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);

    cart = [{ name, price, quantity: 1 }];
    updateCart();
    openCartDrawer();
  });
});

// Open cart drawer
document.getElementById('cart-icon').addEventListener('click', () => {
  document.getElementById('cart-drawer').classList.toggle('open');
});

// Close cart drawer
document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('cart-drawer').classList.remove('open');
});

// Update cart UI and PayPal
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement('li');
    li.textContent = `${item.quantity} × ${item.name} - $${(item.price * item.quantity).toFixed(2)}`;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Remove';
    delBtn.onclick = () => {
      cart.splice(index, 1);
      updateCart();
    };

    li.appendChild(delBtn);
    cartItems.appendChild(li);
  });

  document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;

  renderPayPalButton(total);
}

// Show cart drawer
function openCartDrawer() {
  document.getElementById('cart-drawer').classList.add('open');
}

// Render PayPal button
function renderPayPalButton(total) {
  const container = document.getElementById('paypal-button-container');
  if (!container) return;

  container.innerHTML = '';
  if (cart.length === 0) return;

  paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'checkout'
    },
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: total.toFixed(2)
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert(`Thanks, ${details.payer.name.given_name}! Your order is confirmed.`);
        cart = [];
        updateCart();
        document.getElementById('cart-drawer').classList.remove('open');
      });
    }
  }).render('#paypal-button-container');
}