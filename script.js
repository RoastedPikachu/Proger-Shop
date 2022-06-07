const btn = document.querySelector(".header-shop-cart");
const cart = document.querySelector(".shop-cart-block");
const main = document.querySelector("main");
const countItems = document.querySelector(".count-items");
const countItems2 = document.querySelector(".count-items-2");
const buy = document.querySelector(".buy b");
const input = document.querySelector(".count input");

btn.addEventListener('click', function(){
  cart.classList.toggle("active1");
  main.classList.toggle("active2");
});

items.forEach((item) => {
  main.innerHTML+=`
<div class="item">
  <div class="price">${item.price} руб.</div>
  <div class="img">
    <img src="img/${item.img}" alt="">
  </div>
  <h4>${item.name}</h4>
  <p>${item.description}</p>
  <div class="add-to-cart" onclick="addToCart(${item.id})"><i class="fa-solid fa-cart-plus"></i></div>
</div>`;
});

let shopCart = [];

if (localStorage.getItem("shopCart") != undefined){
  shopCart = JSON.parse(localStorage.getItem("shopCart")); 
  updateShopCart();
}

function addToCart(id){
  let itemId = shopCart.find((item) => item.id == id);
  if (itemId){
    if (itemId.count < itemId.leftItems){
      itemId.count++;
    }
  } else {
    let item = items.find((item) => item.id == id);
    shopCart.push({
      ...item,
      "count": 1
    });
  }
  localStorage.setItem("shopCart", JSON.stringify(shopCart));
  updateShopCart();
}

function updateShopCart(){
  const shopCartItems = document.querySelector("#shop-cart");
  shopCartItems.innerHTML = "";
  let elementCount = 0;
  let totalPrice = 0;
  let rub = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  });
  shopCart.forEach((el) => {
    shopCartItems.innerHTML += `
    <div class="shop-item">
        <div class="info">
          <img src="img/${el.img}" alt="${el.description}">
          <span class="title">${el.name}</span>
        </div>
        <div class="price">${el.price} руб.</div>
        <div class="count">
          <button class="minus" onclick="changeCountEl('-', ${el.id})">-</button>
          <input value="${el.count}" onchange="change(${el.id}, this.value)"></input>
          <button class="plus" onclick="changeCountEl('+', ${el.id})">+</button>
          <button class="delete" onclick="deleteEl(${el.id})"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    </div>`;
    elementCount += el.count;
    totalPrice += el.price * el.count;   
  });
  countItems.textContent = `(${elementCount})`;
  countItems2.textContent = `(${elementCount})`;
  buy.textContent = rub.format(totalPrice.toFixed(2));
}

function changeCountEl(action, id){
  let element = shopCart.find((el) => el.id == id);
  if(action == "-" && element.count > 1){
    element.count--;
  } else if(action == "-" && element.count == 1){
    shopCart = shopCart.filter((el) => el.id != id);
  } else if(action == "+" && element.count < element.leftItems) {
      element.count++;
  }
  updateShopCart();
} 

function deleteEl(id){
  shopCart = shopCart.filter((el) => el.id != id);
  updateShopCart();
}

function deleteAll(){
  shopCart = [];
  updateShopCart();
}

function change(id, value){
  let elem = shopCart.find((el) => el.id == id);  
  if(+value > 0  && +value <= elem.leftItems && !value.includes(".")) {
    elem.count = +value;
  } else {
    alert(`Указано неверное значение. Должно быть от 1 до ${elem.leftItems}`);
  }
  updateShopCart();
}
