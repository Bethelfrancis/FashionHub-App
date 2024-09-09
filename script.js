const productContainer = document.getElementById('product-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const hamburger = document.querySelector('.hambuger');
const mobileNav = document.querySelector('.mobile-nav-links');
const body = document.getElementById('body');
const aboutSection = document.querySelector('.about-sec');
const navbar = document.querySelector('.nav-bar');

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

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  body.classList.toggle('body')
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
        <button id="pro-shop-now">Shop Now</button>
        <h3>${title}</h3>
        <div class="categorys-price">
            <h4><span id="category-price">Price:</span>$${price}</h4>
        </div>
    </div>
  `;
  });
};

loadMoreBtn.addEventListener('click', fetchMoreProducts);