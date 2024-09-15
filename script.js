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
  cartContainer.style.top = '0'
})

// document.addEventListener('click', (e) => {
//   if (!cartContainer.contains(e.target) && !cartIcon.contains(e.target)) {
//     cartContainer.style.top = '-100rem'
//   }
// });

closeCartBtn.addEventListener('click', () => {
  cartContainer.style.top = '-100rem'
})

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

mobileBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
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
        <h3>${title.length > 20 ? title.slice(0, 20) + '...' : title}</h3>
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
    })
  })
};

loadMoreBtn.addEventListener('click', fetchMoreProducts);

class ShoppingCart {
  constructor() {
    this.items = [];
    this.tax = 5;
    this.total = 0
  }

  addItems(id, products) {
    const product = products.find(item => item.id === id);
    const { image, title, price } = product;
    this.items.push(product);

    pushContainer.innerHTML += `
      <div class="product-display" id="${id}">
          <img src="${image}" alt="${title}-image">
          <h3>${title}</h3>
          <h4>${price}</h4>
      </div>
    `;
  }
}

const cart = new ShoppingCart;