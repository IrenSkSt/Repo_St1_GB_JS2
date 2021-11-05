// получаем с сервера список товаров

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

// Универсальная функция отправки/получения данных с сервером
function send(onError, onSuccess, url, method = 'GET', data = {}, headers = {}, timeout = 15000) {

    let xhr;

    if (window.XMLHttpRequest) {
        // Chrome, Mozilla, Opera, Safari
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        // Internet Explorer
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.open(method, url, true);


    Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
    });


    xhr.timeout = timeout;

    xhr.ontimeout = function () {
        // Этот код выполнится, если превышено время ожидания
        onError();
    }


    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status < 400) {
                onSuccess(xhr.responseText);
            } else if (xhr.status >= 400) {
                onError(xhr.responseText);
            }
        }

    }

    xhr.send(data);
    console.log(xhr); // для проверки
}


// готовый код ----------
class GoodsList {
    constructor() {
        // this.list = [];
        // console.log(goods); // для проверки
    }

    fetchGoods() {
        send(
            (err) => {
                console.log(err.text)
            },
            (request) => {
                this.goods = JSON.parse(request).map(good => ({ title: good.product_name, price: good.price }))
            }, // формируем массив из полученных данных
            `${API_URL}catalogData.json`
        )
        //console.log(goods); // для проверки
    }
}

//------------------

// вместо этого списка товаров подгружаем с сервера
// let goods = [ // массив товаров магазина !!! Пока без остатков на складе - как бы по одному экземпляру =уникальные
//     { title: 'Shirt', price: 150 },
//     { title: 'Socks', price: 50 },
//     { title: 'Jacket', price: 350 },
//     { title: 'Shoes', price: 250 },
// ];
// console.log(goods); // для проверки

const goods = new GoodsList();
goods.fetchGoods();
console.log(goods); // для проверки

// Формируются карточки товаров в блоке товаров
const $catalog = document.querySelector('.box_cards'); //блок товаров
let i = 1;
const renderGoodsItem = ({ title, price }) => {
    return `<figure id="card_${i}" class="card"><h3>${title}</h3><p>Цена: ${price}</p><button id="btn_${i++}" class="add-cart">Купить</button></figure>`;
}

const renderGoodsList = (list = goods) => {
    let goodsList = list.map(
        (item) => {
            return renderGoodsItem(item);
        }
    ).join('');

    $catalog.insertAdjacentHTML('beforeend', goodsList);
}

renderGoodsList();
//-----------------------------------------------------


//++++ Добавлен расчет общей стоимости товара на складе - Задание 2
const priceList = goods.map((item) => {
    // console.log(item.price); // для проверки
    return item.price;
});

let goodsSumCounter;
function SumCounter(items) {
    goodsSumCounter = items.reduce((prev, cur) => {
        return prev + cur;
    })
};
SumCounter(priceList);

console.log("Общая стоимость товара на складе = " + goodsSumCounter + " долл.США");
//-----------------------------------------------------


// Перейти в корзину или Показать корзину по нажатия кнопки "Корзина" - повторное нажатие =скрыть
let isOpenCart = false;
function showCart() { // запускается по клику на кнопку Корзина 
    // console.log(this); // для проверки
    if (!isOpenCart) {
        document.querySelector('.cart').style.display = 'block';
        isOpenCart = true;
    } else {
        document.querySelector('.cart').style.display = 'none';
        isOpenCart = false;
    }
}
const openCart = document.querySelector('.cart-button').onclick = showCart; // открывается блок Корзины


// на кнопку Купить
function showBuy() { // запускается по клику на кнопку Купить 
    // console.log(this); // для проверки
    if (!isOpenCart) {
        document.querySelector('.cart').style.display = 'block';
        isOpenCart = true;
    }
}
//-----------------------------------------------------


// Пользователь по клику на кнопку "Купить" добавляет товар в корзину

const $cart = document.querySelector('.cart'); //блок корзины
const $cardsList = document.getElementsByClassName("card"); // коллекция карточек товаров
// console.log($cardsList); // для проверки
let cart = []; // пустая корзина


//++++ Добавлен расчет общей стоимости товара в корзине  - аналогично как стоимость остатков на складе
let buySumCounter = 0;
function buySum(buys) {
    const coustList = buys.map((pos) => {
        // console.log(pos.price); // для проверки
        return pos.price;
    });
    function coustSum(pos) {
        buySumCounter = pos.reduce((prev, cur) => {
            return prev + cur;
        })
    };
    coustSum(coustList);
}

var totalBuy = document.querySelector('p');
//-----------------------------------------------------


const renderCartPosition = ({ title, price }) => { // позиция покупки в блоке корзины
    // console.log(title, price); // для проверки
    return `<figure ><h3>${title}</h3> <p>1 шт. * ${price} долл.США = ${price} долл.США</p > </figure > `; // добавить потом кнопку удаления товара из корзины <button class="cart_delete">Удалить</button> + id="pos_${indexGood}"
}

function renderCartList(indexGood) {
    cart[indexGood] = goods[indexGood];
    //console.log(cart[indexGood].title); // для проверки
    buySum(cart);
    // console.log("Общая стоимость покупки = " + buySumCounter + " долл.США"); // для проверки
    totalBuy.innerText = "Общая стоимость Ваших покупок составляет = " + buySumCounter + " "; // добавили стоимость всех покупок в корзине
    totalBuy.innerHTML += "&#36;";
    totalBuy.style.color = "blue";
    // console.log(totalBuy); // для проверки

    return renderCartPosition(cart[indexGood], cart[indexGood]);

}
//--------------------------------------------------------------




for (var item of $cardsList) {

    item.querySelector('.add-cart').onclick = function () {
        // console.log(this); // для проверки
        this.style.color = "brown"; //если товар добавили в корзину хоть один раз, то меняет цвет

        n = this.id.split('_')[1]; // добавить проверки, на наличие на складе
        //console.log(n); // для проверки

        if (cart[n - 1] == null) { // маасив покупок
            //renderCartList(n - 1); // добавляем покупку в массив покупок
            $cart.insertAdjacentHTML('beforeend', renderCartList(n - 1));
            //console.log(cartPos[n - 1]); // для проверки

        } else {
            alert("Данный товар в единственном экземпляре. Вы уже добавили этот товар в корзину!");
        }

        showBuy(); // сразу открывается корзина по клику на кнопку Купить

    };

}

// console.log(cart); // для проверки
//-----------------------------------------------------------------






// черновики









