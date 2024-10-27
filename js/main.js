// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwMiCfdg9yeaSUSsTvqaTrNBWhK71eXSU",
  authDomain: "clothes-brand-e3f32.firebaseapp.com",
  projectId: "clothes-brand-e3f32",
  storageBucket: "clothes-brand-e3f32.appspot.com",
  messagingSenderId: "510550881692",
  appId: "1:510550881692:web:f5c073b95a4293602dc459",
  measurementId: "G-YP0WXW5W3G"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const productsContainer = document.getElementById("products-container");
async function fetchProducts() {
  try {
    const productsSnapshot = await db.collection("products").get();
    let displayedProducts = 0;

    productsSnapshot.forEach(doc => {
      if (displayedProducts < 6) {
        const product = doc.data();
        const productId = doc.id;

        productsContainer.innerHTML += `
        <div class="col-md-6 col-lg-3 item text-center m-3">
                   <a href="pages/singleProduct.html?id=${doc.id}" class="item-link text-decoration-none">
                     <div class="item">
                       <img
                         src="${product.img}"
                         alt=""
                         class="img-fluid item-img "
                       />
                       <h3
                         class="text-capitalize text-center text-black fs-5 mt-3 fw-bold p-3 item-text mb-0 mt-0 p-0"
                       >
                         ${product.title}
                       </h3>
                       <p
                         class="text-center text-black-50 fs-5 fw-bold lh-lg item-text mb-0 mt-0 p-0"
                       >
                         $${product.price}
                       </p>
                     </div>
                   </a>
                 </div>
             `;
        displayedProducts++;
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}


fetchProducts();




const mainProductsContainer = document.getElementById("main-products-container");

async function fetchMainProducts() {
  try {
    const productsSnapshot = await db.collection("products").get();
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function renderProducts(products) {
  console.log(products);
  mainProductsContainer.innerHTML = products.map(product => `
    <div class="col-md-6 col-lg-3 item text-center m-3">
       <a href="singleProduct.html?id=${product.id}" class="item-link text-decoration-none">
         <div class="item">
           <img
             src="${product.img}"
             alt="${product.title}"
             class="img-fluid item-img"
           />
           <h3
             class="text-capitalize text-center text-black fs-5 mt-3 fw-bold p-3 item-text mb-0 mt-0 p-0"
           >
             ${product.title}
           </h3>
           <p
             class="text-center text-black-50 fs-5 fw-bold lh-lg item-text mb-0 mt-0 p-0"
           >
             $${product.price}
           </p>
         </div>
       </a>
     </div>
  `).join('');
}

// Call the function to fetch and display products
fetchMainProducts();

// Back to top button functionality
let mybutton = document.getElementById("btn-back-to-top");

window.onscroll = function () {
    scrollFunction();
}

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

mybutton.addEventListener('click', backToTop);

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}








  // Initialize the cart array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Update cart in localStorage and UI
  function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
  }
  
  // Add item to cart
  function addToCart(productId, title, price, img) {
    const item = cart.find(item => item.id === productId);
  
    if (item) {
      item.quantity++;
    } else {
      cart.push({ id: productId, title, price, img, quantity: 1 });
    }
  
    updateCart();
    toggleCart(); // Open cart after adding an item
  }
  
  // Render cart items
  function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    cartItemsContainer.innerHTML = '';
  
    cart.forEach(item => {
      cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-details">
            <h5>${item.title}</h5>
            <p>Price: $${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
          </div>
          <button onclick="removeFromCart('${item.id}')" class="remove-btn">Remove</button>
        </div>
      `;
    });
  
    // Update total price
    document.getElementById('totalPrice').innerText = `Total: $${calculateTotal()}`;
  }
  
  // Remove item from cart
  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
  }
  
  // Calculate total price
  function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }
  
  // Clear the cart
  function clearCart() {
    cart = [];
    updateCart();
  }
  
  // Toggle the side cart
  function toggleCart() {
    document.getElementById('sideCart').classList.toggle('active');
    document.getElementById('cartOverlay').classList.toggle('active');
  }
  
  // Render cart items on page load
  window.addEventListener('load', renderCartItems);
  
  // Checkout action (replace with actual checkout process)
  function checkout() {
    alert("Proceeding to checkout!");
    clearCart();
  }
  

  // Optional: Prevent body from scrolling when cart is open
const cartContainer = document.querySelector('.cart-container');

cartContainer.addEventListener('mouseenter', () => {
  document.body.style.overflow = 'hidden';
});

cartContainer.addEventListener('mouseleave', () => {
  document.body.style.overflow = 'auto';
});




// Get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Function to fetch and render product by ID
async function fetchProductById(productId) {
  try {
    const productRef = db.collection("products").doc(productId);
    const doc = await productRef.get();

    if (doc.exists) {
      const product = doc.data();
      // Render product details on the page
      document.getElementById("product-title").innerText = product.title;
      document.getElementById("product-img").src = product.img;
      document.getElementById("product-price").innerText = `$${product.price}`;
      document.getElementById("product-desc").innerText = product.desc;

      // Add "Add to Cart" button with click event
      const addToCartBtn = document.createElement("button");
      addToCartBtn.id = "addToCartBtn";
      addToCartBtn.classList.add("btn", "btn-primary");
      addToCartBtn.innerText = "Add to Cart";
      addToCartBtn.onclick = function () {
        addToCart(product);
      };
      document.getElementById("single-product-container").appendChild(addToCartBtn);

    } else {
      console.log("No such product!");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}

// Function to add a product to the cart
function addToCart(product) {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  
  const existingProductIndex = cartItems.findIndex(item => item.id === productId);
  if (existingProductIndex !== -1) {
    cartItems[existingProductIndex].quantity += 1;
  } else {
    const cartItem = { id: productId, title: product.title, price: product.price, img: product.img, quantity: 1 };
    cartItems.push(cartItem);
  }

  // Save updated cart to local storage and update display
  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateCartDisplay();

  // Open cart after adding an item
  toggleCart();
}

// Function to update the cart display
function updateCartDisplay() {
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  cartItemsContainer.innerHTML = ""; // Clear previous items

  // Populate cart items
  cartItems.forEach(item => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.title}" class="cart-item-img">
      <div>
        <h5>${item.title}</h5>
        <p>Price: $${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  // Update the total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  document.getElementById("totalPrice").innerText = `Total: $${totalPrice.toFixed(2)}`;
}

// Fetch the product when the page loads
fetchProductById(productId);

// Suggested Products
async function fetchSuggestedProducts() {
  try {
    const productsSnapshot = await db.collection("products").get();
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const suggestedProducts = products.filter(product => product.id !== productId);
    const suggestedProductIds = suggestedProducts.map(product => product.id);
    renderSuggestedProducts(suggestedProductIds);
  } catch (error) {
    console.error("Error fetching suggested products:", error);
  }
}

fetchSuggestedProducts();

function renderSuggestedProducts(suggestedProductIds) {
  const suggestedProductsContainer = document.getElementById("suggested-products-container");
  const maxProducts = 3;
  const productsToRender = suggestedProductIds.slice(0, maxProducts);

  productsToRender.forEach(productId => {
    const productRef = db.collection("products").doc(productId);
    productRef.get().then(doc => {
      if (doc.exists) {
        const product = doc.data();
        const productElement = document.createElement("div");
        productElement.classList.add("item");

        productElement.innerHTML = `
          <a href="singleProduct.html?id=${doc.id}" class="item-link text-decoration-none">
            <div class="item">
              <img src="${product.img}" alt="${product.title}" class="img-fluid item-img" />
              <h3 class="text-capitalize text-center text-black fs-5 mt-3 fw-bold p-3 item-text mb-0 mt-0 p-0">${product.title}</h3>
              <p class="text-center text-black-50 fs-5 fw-bold lh-lg item-text mb-0 mt-0 p-0">$${product.price}</p>
            </div>
          </a>
        `;
        suggestedProductsContainer.appendChild(productElement);
      } else {
        console.error(`No such document for ID: ${productId}`);
      }
    }).catch(error => {
      console.error("Error fetching product: ", error);
    });
  });
}

// Scroll and back-to-top functionality
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

mybutton.addEventListener('click', backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}


    // Display Cart Items
    function displayCartItems() {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      const cartItemsList = document.getElementById("cartItemsList");
      const cartTotal = document.getElementById("cartTotal");
    
      let total = 0;
      cartItemsList.innerHTML = "";
      
      cartItems.forEach((item, index) => {
        cartItemsList.innerHTML += `
          <div class="checkout-item row">
            <img src="${item.img}" alt="${item.title}" class="checkout-item-img" style="width: 100px; height: 100px;">
            <div class="checkout-item-details">
              <p>${item.title} - $${item.price}</p>
              <div class="quantity-control">
                <button onclick="updateQuantity(${index}, 1)">+</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${index}, -1)">-</button>
              </div>
              <button onclick="removeItem(${index})" class="remove-button">Remove</button>
            </div>
          </div>
        `;
        total += item.price * item.quantity;
      });
    
      cartTotal.innerText = `Total: $${total}`;
    }
    
    // تحديث الكمية
    function updateQuantity(index, change) {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      if (change === 1) {
        cartItems[index].quantity += 1; // زيادة الكمية
      } else if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1; // تقليل الكمية
      }
      localStorage.setItem("cart", JSON.stringify(cartItems));
      displayCartItems(); // تحديث العرض
    }
    
    // حذف العنصر
    function removeItem(index) {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      cartItems.splice(index, 1); // إزالة العنصر
      localStorage.setItem("cart", JSON.stringify(cartItems));
      displayCartItems(); // تحديث العرض
    }
    
    displayCartItems();

    // Submit Order to Firebase
    function submitOrder() {
      const name = document.getElementById("name").value;
      const address = document.getElementById("address").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

      if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const orderData = {
        name: name,
        address: address,
        email: email,
        phone: phone,
        items: cartItems,
        timestamp: new Date(),
        done: false
      };

      db.collection("orders").add(orderData)
        .then(() => {
          alert("Order submitted successfully!");
          document.getElementById("orderForm").reset();
          localStorage.removeItem("cart"); // Clear cart after order
          displayCartItems(); // Refresh cart display
        })
        .catch((error) => {
          console.error("Error submitting order: ", error);
        });
    }
