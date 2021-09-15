function saveItems() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartItems);
}

function cartTotal() {
  const cartList = document.querySelectorAll('.cart__item');
  let total = 0;
  cartList.forEach((element) => {
    total += parseFloat(element.innerHTML.split('$')[1]);
    document.querySelector('.total-price').innerHTML = Math.round(total * 100) / 100;
  });
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const parentElement = event.target.parentElement;
  parentElement.removeChild(event.target);
  saveItems();
  cartTotal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  //  li.addEventListener('click', cartItemClickListener);
  return li;
}

function generateItemList() {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(api)
    .then(response => response.json())
    .then((data) => {
      document.querySelector('.loading').remove();
      data.results.forEach((element) => {
        const object = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(object));
      });
    });
}

function addItemToCart() {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parentElement = event.target.parentElement;
      const sku = getSkuFromProductItem(parentElement);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(response => response.json())
        .then((data) => {
          const object = {
            sku,
            name: data.title,
            salePrice: data.price,
          };
          document.querySelector('.cart__items').appendChild(createCartItemElement(object));
          saveItems();
          cartTotal();
        });
    }
  });
}

function loadItems() {
  const loadedCart = localStorage.getItem('cart');
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = loadedCart;
  cartList.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  });
  cartTotal();
}

function clearCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    saveItems();
    cartTotal();
  });
}

window.onload = function onload() {
  loadItems();
  generateItemList();
  addItemToCart();
  clearCart();
};
