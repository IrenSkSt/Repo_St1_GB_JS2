// на базе классов
// с промисами
// получаем с сервера список товаров
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';
const GoodsCards = [];
// Универсальная функция отправки/получения данных с сервером
function send(onError, onSuccess, url, method = 'GET', headers = {}, data = null, timeout = 15000) {
    return new Promise((res, rej) => {

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
            rej();
        }


        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status < 400) {
                    onSuccess(xhr.responseText);
                    // console.log(xhr.responseText); // для проверки
                } else if (xhr.status >= 400) {
                    onError(xhr.responseText);
                }
            }

        }

        xhr.send();
        // console.log(xhr); // для проверки
    })
}


// Блок формирования Каталога товаров
class GoodsItem { // карточка товара
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }

    // метод отрисовывает карточку
    render(i) {

        return `<figure id="card_${i}" class="card"><h3>${this.title}</h3><p>Цена: ${this.price} руб.</p><button id="btn_${i++}" class="add-cart">Купить</button></figure>`;
    }
}

class GoodsList { // массив = каталог из карточек товаров
    constructor() {
        this.goods = [];
    }

    fetchGoods() { // метод, в котором будем получать данные с сервера о товарах на складе
        new Promise((resolve, reject) => {
            send(reject, resolve, `${API_URL}catalogData.json`);
        })
            .then((request) => {

                // действия для обработки
                this.goods = JSON.parse(request).map(good => ({ title: good.product_name, price: good.price })); // формируем массив из полученных данных
                //console.log(this.goods); // для проверки
                this.goods.forEach(item => { GoodsCards.push(item) });
                // GoodsCards.push(this.goods);
                // console.log(GoodsCards); // для проверки


                this.render(); // формирование карточек товаров
                this.checkSum(); // расчет стоимости товара на складе
                this.onclickForBuy();
            })

            .catch((err) => {
                // действия при ошибке
                console.log(err.text);
            })

        // send(
        //     (err) => {
        //         console.log(err.text)
        //     },
        //     (request) => {
        //         this.goods = JSON.parse(request).map(good => ({ title: good.product_name, price: good.price })); // формируем массив из полученных данных
        //         //console.log(this.goods); // для проверки
        //         this.goods.forEach(item => { GoodsCards.push(item) });
        //         // GoodsCards.push(this.goods);
        //         // console.log(GoodsCards); // для проверки


        //         this.render(); // формирование карточек товаров
        //         this.checkSum(); // расчет стоимости товара на складе
        //         this.onclickForBuy();

        //     },
        //     `${API_URL}catalogData.json`
        // )


        // this.goods = [ //  текущий каталог товаров на складе - заглушка вместо, полученной инфы с сервера
        //     { title: 'Shirt', price: 150 },
        //     { title: 'Socks', price: 50 },
        //     { title: 'Jacket', price: 350 },
        //     { title: 'Shoes', price: 250 },
        // ]

    }


    render() { // метод отображает список товаров = католог карточек товаров

        let listHtml = '';
        let i = 1;
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price);
            listHtml += goodItem.render(i++);

        });
        document.querySelector('.box_cards').innerHTML = listHtml;

    }

    checkSum() { // рассчет общей стоимости товара на складе
        let goodsSumCounter = 0;
        this.goods.forEach(good => {
            goodsSumCounter += good.price;
        });
        console.log(`Общая стоимость товара на складе = ${goodsSumCounter} руб.`);
    }

    onclickForBuy() {
        const $cardsList = document.getElementsByClassName("card"); // коллекция карточек товаров
        // console.log($cardsList); // для проверки

        for (var card of $cardsList) {
            // console.log(card.querySelector('.add-cart')); // для проверки
            card.querySelector('.add-cart').onclick = function () {
                // console.log(this); // для проверки
                this.style.color = "brown"; //если товар добавили в корзину хоть один раз, то меняет цвет

                let n = this.id.split('_')[1]; // добавить проверки, на наличие на складе
                // console.log(n); // для проверки

                if (Buys[n - 1] == null) { // маасив текущих покупок
                    // запуск по кнопке Купить
                    const cart = new CartList();
                    cart.addBuy(n - 1);
                    cart.render();
                    cart.checkSum();


                    // console.log(Buys); // для проверки
                    // console.log(cart.buys); // для проверки
                    // console.log(cart.buys[n - 1]); // для проверки

                } else {
                    alert("Данный товар в единственном экземпляре. Вы уже добавили этот товар в корзину!");
                }

                showBuy(); // сразу открывается корзина по клику на кнопку Купить

            };

        }
    }
}

// запуск формирования каталога на странице
const catalog = new GoodsList();
catalog.fetchGoods();
// catalog.render();
// catalog.checkSum();

// console.log(catalog); // для проверки
// console.log(catalog.goods); // для проверки
// console.log(GoodsCards); // для проверки
//----------------------------------------

// переделать в Контроллер
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


//Блок формирования КОрзины по кнопке Купить
let Buys = []; // массив покупок
class BuysItem { // позиция по товару в корзине
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }

    // метод отрисовывает позицию товара в корзине
    render() {

        return `<figure ><h3>${this.title}</h3> <p>1 шт. * ${this.price} руб. = ${this.price} руб.</p > </figure > `; // добавить потом кнопку удаления товара из корзины <button class="cart_delete">Удалить</button> + id="pos_${indexGood}"
    }
}

class CartList { // массив = список купленных товаров
    constructor() {
        this.buys = Buys;
    }

    // fetchCart() { // метод, в котором будем получать данные с сервера о корзине
    //     this.buys = 

    // }

    addBuy(indexGood) {  // добавляем покупку в массив покупок
        this.buys[indexGood] = GoodsCards[indexGood];
        // Buys = this.buys;
        console.log(this.buys[indexGood].title); // для проверки

    }

    render() { // метод отображает список покупок
        let listHtml = '';
        this.buys.forEach(buy => {
            const buyItem = new BuysItem(buy.title, buy.price);
            listHtml += buyItem.render();
        });
        // document.querySelector('.cart').insertAdjacentHTML('beforeend', listHtml);
        document.querySelector('.cart-list').innerHTML = listHtml;
    }

    checkSum() { // рассчет общей стоимости покупок в корзине и отражение ее в корзине
        let buysSumCounter = 0;
        this.buys.forEach(buy => {
            buysSumCounter += buy.price;
        });
        // console.log("Общая стоимость покупок в корзине = " + buysSumCounter + " долл.США"); // для проверки
        let totalBuy = document.querySelector('p');
        totalBuy.innerText = `Общая стоимость Ваших покупок составляет = ${buysSumCounter} `; // добавили стоимость всех покупок в корзине
        totalBuy.innerHTML += "&#8381;";
        totalBuy.style.color = "blue";
        // console.log(totalBuy); // для проверки
    }

}

// переделать в Контроллер
// функция Клика на кнопку Кпить в карточке товара
// const $cardsList = document.getElementsByClassName("card"); // коллекция карточек товаров
// console.log($cardsList); // для проверки

// for (var card of $cardsList) {
//     console.log(this.querySelector('.add-cart')); // для проверки
//     this.querySelector('.add-cart').onclick = function () {
//         console.log(this); // для проверки
//         this.style.color = "brown"; //если товар добавили в корзину хоть один раз, то меняет цвет

//         n = this.id.split('_')[1]; // добавить проверки, на наличие на складе
//         console.log(n); // для проверки

//         if (Buys[n - 1] == null) { // маасив текущих покупок
//             // запуск по кнопке Купить
//             const cart = new CartList();
//             cart.addBuy(n - 1);
//             cart.render();
//             cart.checkSum();


//             // console.log(Buys); // для проверки
//             // console.log(cart.buys); // для проверки
//             // console.log(cart.buys[n - 1]); // для проверки

//         } else {
//             alert("Данный товар в единственном экземпляре. Вы уже добавили этот товар в корзину!");
//         }

//         showBuy(); // сразу открывается корзина по клику на кнопку Купить

//     };

// }
//---------------------------------------------------












// // черновики









