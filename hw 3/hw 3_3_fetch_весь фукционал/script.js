// на базе классов
// с промисами
// получаем с сервера список товаров
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';
const GoodsCards = [];

// Универсальная функция отправки/получения данных с сервером
function send(onError, onSuccess, url, method = 'GET', headers = [], data = null, timeout = 30000) {

    let xhr;

    if (window.XMLHttpRequest) {
        // Chrome, Mozilla, Opera, Safari
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        // Internet Explorer
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.open(method, url, true);


    headers.forEach((header) => {
        xhr.setRequestHeader(header.key, header.value);
    });


    xhr.timeout = timeout;

    xhr.ontimeout = function () {
        // Этот код выполнится, если превышено время ожидания
        onError();
    }


    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 400) {
                onError(xhr.responseText);
            } else {
                onSuccess(xhr.responseText);
                // console.log(xhr.responseText); // для проверки
            }
        }

    }

    xhr.send(data);
    // console.log(xhr); // для проверки

}


// Блок формирования Каталога товаров
class GoodsItem { // карточка товара
    constructor(title, price, article) {
        this.title = title; // наименование товара
        this.price = price; // цена
        this.art = article; // артикль

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
        fetch(`${API_URL}catalogData.json`)
            .then((response) => {
                return response.json(); // вернул объект полученный
            })

            .then((request) => {
                // действия для обработки
                this.goods = request.map(good => ({ title: good.product_name, price: good.price, article: good.id_product })); // формируем массив из полученных данных
                //console.log(this.goods); // для проверки
                this.goods.forEach(item => { GoodsCards.push(item) });
                // GoodsCards.push(this.goods);
                // console.log(GoodsCards); // для проверки


                this.render(); // формирование карточек товаров
                this.checkSum(); // расчет стоимости товара на складе
                this.onclickForBuy(); //активация кнопки Купить
            })
            .catch((err) => {
                // действия при ошибке
                console.log(err.text);
            })



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

        // $cardsList.forEach((card) => {
        //     console.log(card); // для проверки
        //     console.log(card.querySelector('.add-cart')); // для проверки
        //     card.querySelector('.add-cart').onclick = function () {
        //         console.log(this); // для проверки
        //         this.style.color = "brown"; //если товар добавили в корзину хоть один раз, то меняет цвет

        //         let n = this.id.split('_')[1]; // добавить проверки, на наличие на складе
        //         // console.log(n); // для проверки

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
        //     }
        // });

        for (let card of $cardsList) {
            // console.log(card.querySelector('.add-cart')); // для проверки
            card.querySelector('.add-cart').onclick = function () {
                // console.log(this); // для проверки
                this.style.color = "brown"; //если товар добавили в корзину хоть один раз, то меняет цвет

                let n = this.id.split('_')[1]; // добавить проверки, на наличие на складе
                // console.log(n); // для проверки

                if (Buys[n - 1] == null) { // маасив текущих покупок
                    // запуск по кнопке Купить
                    // const cart = new CartList();
                    // console.log(cart); // для проверки
                    cart.addBuy(n - 1);
                    cart.render(n - 1);
                    cart.checkSum();
                    cart.addCart(); // отправка корзины на сервер


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
const Buys = []; // массив покупок
let j = 0; // счетчик позиций в корзине

class BuysItem { // позиция по товару в корзине
    constructor(title, price, article) {
        this.title = title;
        this.price = price;
        this.article = article;
    }

    // метод отрисовывает позицию товара в корзине
    render() {

        return `<figure id="pos_${j}" class="cart-item"><h3>${this.title}</h3> <p>1 шт. * ${this.price} руб. = ${this.price} руб.</p > <button id="btn_${j}" class="cart_delete">Удалить</button> </figure > <hr> `; // нумерация по позиции, чтобы несколько единиц по нажатию снова на карточку товара
    }
}

class CartList { // массив = список купленных товаров
    constructor() {
        this.buys = Buys;
    }

    fetchCart() { // метод, в котором получаем данные с сервера о корзине

        fetch(`${API_URL}getBasket.json`)
            .then((response) => {
                return response.json(); // вернул объект полученный
            })

            .then((request) => {
                // действия для обработки
                this.buys = request.contents.map(buy => ({ title: buy.product_name, price: buy.price, article: buy.id_product })); // формируем массив из полученных данных
                //console.log(this.buys); // для проверки
                this.buys.forEach(item => { Buys.push(item) });

                console.log(Buys); // для проверки


                this.render(); // формирование карточек товаров
                this.checkSum(); // расчет стоимости товара в корзине
                this.onclickDelete(); //активация кнопки Удалить
            })

            .catch((err) => {
                // действия при ошибке
                console.log(err.text);
            })



    }

    addBuy(indexGood) {  // добавляем покупку в массив покупок
        this.buys[indexGood] = GoodsCards[indexGood];
        // Buys = this.buys;
        console.log(this.buys[indexGood].title); // для проверки

    }

    deleteBuy(indexBuy) {  // удаляем покупку из массива покупок
        this.buys.splice(indexBuy, 1);

        console.log(this.buys[indexBuy]); // для проверки

    }

    addCart() { // метод, в котором отправляем данные на сервер о содержимом корзины

        fetch(`${API_URL}addToBasket.json`)
            .then(() => {
                console.log(this.buys)

            })
    }

    deleteCart() { // метод, в котором отправляем данные на сервер об удалении из корзины

        fetch(`${API_URL}deleteFromBasket.json`)
            .then(() => {
                console.log(this.buys)

            })
    }



    render() { // метод отображает список покупок
        let listHtml = '';
        this.buys.forEach(buy => {
            const buyItem = new BuysItem(buy.title, buy.price, buy.article);
            listHtml += buyItem.render(buy.article);
            console.log(buy.article); // для проверки
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

    onclickDelete() {
        const $buysList = document.getElementsByClassName("cart-item"); // коллекция карточек товаров
        // console.log($buysList); // для проверки
        for (let pos of $buysList) {
            // console.log(card.querySelector('.add-cart')); // для проверки
            pos.querySelector('.cart_delete').onclick = function () {
                // console.log(this); // для проверки


                let m = this.id.split('_')[1]; // добавить проверки, на наличие на складе
                // console.log(n); // для проверки

                cart.deleteBuy(m - 1);
                cart.render();
                cart.checkSum();
                cart.deleteCart(); // удаление из корзины на сервере


                // console.log(Buys); // для проверки
                // console.log(cart.buys); // для проверки
                // console.log(cart.buys[n - 1]); // для проверки



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

// запуск формирования Корзины с прошлых посещений на странице
const cart = new CartList();
cart.fetchCart();

// console.log(cart); // для проверки
// console.log(Buys); // для проверки
// console.log(cart.buys); // для проверки

//----------------------------------------





// // черновики









