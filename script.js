/* Chequeamos si estamos en la página de contacto */

if (document.getElementById("contact-page")) {
  console.log("Página de contacto detectada.");

  const form = document.getElementById("contact-form");
  if (form) {
    console.log("Formulario encontrado.");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("Evento submit detectado.");

      let name = document.getElementById("name").value;
      let email = document.getElementById("email").value;

      if (name && email) {
        console.log("Formulario completado con éxito.");
        this.submit();
      } else {
        console.log("Faltan campos por llenar, por favor complétalos.");
      }
    });
  } else {
    console.log("Formulario no encontrado.");
  }
} else {
  console.log("No estás en la página de contacto.");
}



let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

/** Función para obtener productos de la API*/ 
const fetchProductsFromAPI = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const apiProducts = await response.json();
    products = apiProducts.filter(product =>
      product.category === "men's clothing" || product.category === "women's clothing"
    );

    /**Mostramos solo el title de cada producto y de paso los mostramos fuera del array */
    products.forEach(product => {
      console.log(product.title); 
    });

    renderProducts(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
};

/** Renderizado de productos */ 
const renderProducts = (products) => {
  const apiContainer = document.querySelector(".api-products-container");
  apiContainer.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" >
      <h2>${product.title}</h2>
      <p class="price">$${product.price}</p>
      <button class="view-description" data-id="${product.id}">Ver descripción</button>
      <button class="shop-button" data-id="${product.id}">Agregar al carrito</button>
    `;
    apiContainer.appendChild(card);
  });

  document.querySelectorAll(".view-description").forEach(button => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.id;
      showProductDescription(productId);
    });
  });

  document.querySelectorAll(".shop-button").forEach(button => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.id;
      addToCart(productId);
    });
  });
};

/** Mostramos descripción ampliada del producto */ 
const showProductDescription = (productId) => {
  const product = products.find(p => p.id == productId);
  if (product) {
    Swal.fire({
      title: product.title,
      text: product.description,
    });
  }
};



/**Agregammos producto al carrito */ 
const addToCart = (productId) => {
  const product = products.find(p => p.id == productId);
  const existingProduct = cart.find(p => p.id == productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();

  /**SweetAlert para confirmar producto agregado */ 
  Swal.fire({
    icon: 'success',
    title: 'Producto agregado',
    text: `${product.title} se agregó al carrito`,
    showConfirmButton: false,
    timer: 1500,
  });
};

/**Guardamos carrito en localStorage */ 
const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

/** Renderizamos carrito en cart*/ 
const renderCart = () => {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const row = document.createElement("tr");
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    row.innerHTML = `
      <td><div class="product-cart"> <img src="${item.image}" class="d-block w-100" alt="${item.title}"/>
      <h2>${item.title}</h2>
      </div></td>
      <td>$${item.price}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="form-control text-center">
      </td>
      <td>$${itemTotal.toFixed(2)}</td>
       <td> <button class="btn btn-danger remove-button" data-id="${item.id}"><i class="fas fa-trash"></i></button></td>
    `;

    cartItems.appendChild(row);
  });

  cartTotal.textContent = total.toFixed(2);
  checkoutButton.disabled = cart.length === 0;

  /**Eventos para actualizar cantidad y eliminar */ 
  document.querySelectorAll(".form-control").forEach(input => {
    input.addEventListener("change", (e) => {
      const productId = e.target.dataset.id;
      const newQuantity = parseInt(e.target.value);
      updateCartQuantity(productId, newQuantity);
    });
  });

  document.querySelectorAll(".remove-button").forEach(button => {
    button.addEventListener("click", (e) => {
      const productId = e.currentTarget.dataset.id;
      removeFromCart(productId);
    });
  });
};

/**Actualizamos cantidad en el carrito */ 
const updateCartQuantity = (productId, quantity) => {
  const product = cart.find(p => p.id == productId);
  if (quantity <= 0) {
    removeFromCart(productId);
  } else {
    product.quantity = quantity;
    saveCart();
    renderCart();
  }
};

/**Elimina un producto del carrito */ 
const removeFromCart = (productId) => {
  cart = cart.filter(p => p.id != productId);
  saveCart();
  renderCart();
};

/**Vaciamos carrito al comprar */ 
document.getElementById("checkout-button")?.addEventListener("click", () => {
  if (cart.length > 0) {
    cart = [];
    saveCart();

    /** SweetAlert para confirmar compra*/ 
    Swal.fire({
      icon: 'success',
      title: 'Compra realizada',
      text: 'Gracias por tu compra',
    });

    renderCart();
  }
});


/**Inicializa productos y carrito según la página */ 
if (document.querySelector(".api-products-container")) {
  fetchProductsFromAPI();
}
if (document.getElementById("cart-items")) {
  renderCart();
}
