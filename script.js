const productContainer = document.getElementById('product-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const hamburger = document.querySelector('.hambuger');
const mobileNav = document.querySelector('.nav-links');
const aboutSection = document.querySelector('.about-sec');
const navbar = document.querySelector('.nav-bar');
const mobileBtn = document.querySelectorAll('.nav-link-btn');
const cartIcon = document.getElementById('cart-icon');
const cartContainer = document.getElementById('cart-container');
const closeCartBtn = document.querySelector('.cart-close');
const pushContainer = document.getElementById('push-container');
const totalCartProduct = document.getElementById('total-items');
const cartCount = document.getElementById('count');
const cartSubTotal = document.getElementById('subtotal');
const taxes = document.getElementById('taxes');
const cartTotal = document.getElementById('total');
const clearCartBtn = document.getElementById('clear-cart-btn');

let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollTop > lastScrollTop) {
    navbar.style.top = '-70px';
  } else {
    navbar.style.top = '0';
  }

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});

const checkVisibility = () => {
  const rect = aboutSection.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    aboutSection.classList.add('visible');
  }
}

window.addEventListener('scroll', checkVisibility);
checkVisibility();

cartIcon.addEventListener('click', () => {
  cartContainer.classList.remove('close-cart')
  cartContainer.classList.toggle('open-cart')
})

closeCartBtn.addEventListener('click', () => {
  cartContainer.classList.remove('open-cart')
  cartContainer.classList.toggle('close-cart')
})

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');

  if (mobileNav.classList.contains('open')) {
    document.body.classList.add('no-scroll')
  } else {
    document.body.classList.remove('no-scroll')
  }
});

mobileBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.classList.remove('no-scroll');
  });
});

let startingIndex = 0;
let endingIndex = 4;
let productDataArr = [];

fetch('https://fakestoreapi.com/products')
  .then((res) => res.json())
  .then((data) => {
    productDataArr = data;
    displayProducts(productDataArr.slice(startingIndex, endingIndex));  
  })
  .catch((err) => {
   productContainer.innerHTML = '<p class="error-msg">There was an error loading the products</p>';
});

const fetchMoreProducts = () => {
  startingIndex += 4;
  endingIndex += 4;

  displayProducts(productDataArr.slice(startingIndex, endingIndex));
  if (productDataArr.length <= endingIndex) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.style.cursor = 'not-allowed';
    loadMoreBtn.textContent = 'No More Product';
  }
};

const displayProducts = (product) => {
  product.forEach(({ title, image, id, price }) => {
    productContainer.innerHTML += `
    
    <div id="${id}" class="category-product">
        <img 
            src="${image}" 
            alt="${title} img"
            id="category-img"
        />
        <button class="pro-shop-now">Shop Now</button>
        <h3>${title.length > 40 ? title.slice(0, 20) + '...' : title}</h3>
        <div class="categorys-price">
            <h4><span id="category-price">Price:</span>$${price}</h4>
        </div>
    </div>
  `;
  });

  const shopNowBtn = document.querySelectorAll('.pro-shop-now');

  shopNowBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = Number(e.target.closest('.category-product').id);
      cart.addItems(productId, productDataArr);
      totalCartProduct.textContent = cart.getCount();
      cartCount.textContent = cart.getCount();
      cart.calculateAmount();
    })
  })
};

loadMoreBtn.addEventListener('click', fetchMoreProducts);

class ShoppingCart {
  constructor() {
    this.items = [];
    this.tax = 3;
    this.total = 0
  }

  addItems(id, products) {
    const product = products.find(item => item.id === id);
    const { image, title, price } = product;
    this.items.push(product);

    const countPerProduct = {}
    this.items.forEach(product => {
      countPerProduct[product.id] = (countPerProduct[product.id] || 0) + 1;
    })

    const currentProduct = countPerProduct[product.id];
    const currentSpanProduct = document.getElementById(`per-product-${id}`);

    if (currentProduct > 1) {
      currentSpanProduct.textContent = `${currentProduct}x`;
    } else {
      pushContainer.innerHTML += `
          <div class="product-display" id="${id}">
              <img src="${image}" alt="${title}-image">
              <h3>
                <span id="per-product-${id}" style="color: #03dac6"></span> 
                ${title.length > 40 ? title.slice(0, 40) + '...' : title}
              </h3>
              <h4>$${price}</h4>
          </div>
        `
    }
  }

  getCount() {
    return this.items.length;
  }

  clearCart() {
    if (!this.items.length) {
      alert('Cart is already empty');
      return;
    }

    const confirmClear = confirm('Are you sure you want to clear the cart!');

    if (confirmClear) {
      this.items = [];
      this.total = 0;
      pushContainer.innerHTML = ''
      cartSubTotal.textContent = 0;
      taxes.textContent = 0;
      cartTotal.textContent = 0;
      totalCartProduct.textContent = 0;
      cartCount.textContent = 0;
    } 
  }

  calculateTax(amount) {
    return parseFloat(((this.tax / 100) * amount).toFixed(2));
  }

  calculateAmount() {
    const subTotal = this.items.reduce((total, item) => total + item.price, 0);
    const tax = this.calculateTax(subTotal)
    this.total = subTotal + tax;
    cartSubTotal.textContent = `$${subTotal.toFixed(2)}`;
    taxes.textContent = `$${tax.toFixed(2)}`
    cartTotal.textContent = `$${this.total.toFixed(2)}`;
    return this.total;
  }
}

clearCartBtn.addEventListener('click', () => {
  cart.clearCart()
})

const cart = new ShoppingCart;