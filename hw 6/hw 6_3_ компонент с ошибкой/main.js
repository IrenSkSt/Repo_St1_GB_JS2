const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

// новый код ДЗ 6

// поиск
Vue.component('search', {
    template: `<form class="search">
    <input type="text" class="goods-search" v-model="searchLine">
    <button class="search-button" type="button" v-on:click="onClickSearch">Искать</button>
    </form>`,
    data() {
        return {
            searchLine: '' //  пустая строка поиска
        }
    },
    methods: {
        onClickSearch() {
            // console.log("onClick"); // Для проверки
            this.$emit('searching', this.searchLine)
        }
    }

})

//карточка товара
Vue.component('card-good', {
    template: `<figure class="good-card">
    <h3>{{title}}</h3>
    <p>{{price}} руб.</p>
    <button class="add-cart" v-on:click="onClickBuy(good)">Купить</button>
    </figure>`,

    props: {
        title: String,
        price: Number,
        good: Object
    },
    methods: {
        onClickBuy() {
            console.log("onClick"); // Для проверки
            this.$emit('addToCart', this.good)
        }
    }
})

// каталог (список товаров)
Vue.component('catalog', {
    template: `<div class="box_cards">
    <card-good v-for="good of list" v-bind:key="good.id_product" v-bind:title="good.product_name" v-bind:price="good.price" v-bind:good="good"></card-good>
    </div>`,
    props: {
        list: Array
    }
})

// ошибка - не подгрузился каталог - переделать под универсальные ошибки
Vue.component('error-server', {
    template: `<div class="box_cards">
    <p><b>Каталог товаров не загрузился. Сервер не отвечает. Обновите сайт позже. Приносим свои извинения</b></p>
    </div>`,

})


// экземпляр Vue
new Vue({
    el: "#app", // селектор контейнера
    data: { // добавляем объект с переменными
        goods: [],
        filterGoods: [],
        cart: [],
        // buys: [],
        // searchLine: '', // пустая строка поиска
        isNotFiltered: true, // покупатель не фильтрует поиском список товаров
        isOpenCart: false, // корзина не открыта для просмотра
        isAddToCart: true,
        isError: false, // для ошибок
        cartEmpty: 'В корзине пока нет покупок. Выберете товар в каталоге', // корзина пуста
        cardsSum: 0,
        buysSumCounter: 0
    },
    methods: {
        loadGoods() { // загрузка списка товаров с сервера
            fetch(`${API_URL}atalogData.json`)
                .then((request) => request.json())
                .then((data) => {
                    this.goods = data;
                    this.filterGoods = this.goods;
                })
                .catch((err) => {
                    // действия при ошибке
                    console.log(err.text);
                    this.isError = true;
                    console.log("Данные с сервера не подгрузились. Для проверки удалила 1ю букву с в адресе в строке с fetch в loadGoods"); // для проверки
                })
        },

        loadCart() { // загрузка корзины с сервера
            fetch(`${API_URL}getBasket.json`)
                .then((request) => request.json())
                .then((data) => {
                    data.contents.forEach(item => { this.cart.push(item) });

                    // this.buys = this.cart;
                    // console.log(this.cart); // Для проверки
                    this.buysSumCounter = data.amount;
                })
        },
        addToCart(buy) { //отправка на сервер новой покупки
            fetch(`${API_URL}addToBasket.json`)
                .then(() => {
                    console.log(buy)

                })
        },
        deleteCart(buy) { //отправка на сервер удаленной покупки
            fetch(`${API_URL}deleteFromBasket.json`)
                .then(() => {
                    console.log(buy)

                })
        },


        filter(searchLine) { // фильтер товаров по запросу в поисковой строке
            if (searchLine.length == 0) {
                this.isNotFiltered = true;
                this.filterGoods = this.goods;
                console.log(this.filterGoods); // для проверки
            } else {
                const searchString = searchLine.trim();
                const reg = new RegExp(searchString, 'i');
                this.filterGoods = this.goods.filter((good) => reg.test(good.product_name));
                this.isNotFiltered = false;


            }

        },

        showCart() { // показать Корзину по нажатию кнопки "Корзина" или при добавлении туда товара
            this.isOpenCart = !this.isOpenCart;
        },
        showBuy() {
            if (!this.isOpenCart) {

                this.isOpenCart = true;
            }
        },

        deleteBuy(buy) {
            console.log(buy); // для проверки

            const index = this.cart.findIndex((item) => item.id_product == buy.id_product);
            this.cart.splice(index, 1);
            // this.cart = this.buys;
            console.log(index); // для проверки
            // console.log(this.buys); // для проверки
            console.log(this.cart); // для проверки
            this.buysSumCounter -= buy.price;
            this.deleteCart(buy);
        },

        addBuy(buy) { // добавить покупку в Корзину

            // console.log(buy); // Для проверки

            // console.log(buy.id_product); // Для проверки
            // console.log(this.cart); // Для проверки

            if (this.cart.length > 0) {

                this.cart.forEach((item) => {
                    if (item.id_product == buy.id_product) {
                        this.isAddToCart = false;
                        return alert('Данный товар уже добавлен в Вашу корзину');
                    }
                });
            }

            if (this.isAddToCart) {
                // console.log(buy.id_product); // Для проверки
                // this.buys.push(buy);
                this.cart.push(buy);
                this.buysSumCounter += buy.price;
                this.showBuy();
                this.addToCart(buy);
            }



        }

    },

    computed: {
        sumBuys() {
            if (this.cart.length == 0) {
                // console.log(this.cart); // Для проверки
                return this.cartEmpty;
            } else {
                return `Общая стоимость Ваших покупок составляет = ${this.buysSumCounter} руб.`;
            }

        },

        sumCards() {
            if ((this.cardsSum = this.filterGoods.length) > 0) {
                return 'Товары, найденные по Вашему запросу';
            } else {
                return 'Товары по Вашему запросу не найдены. Необходимо очистить строку поиска для работы с каталогом'
            };

        }
    },

    mounted() {
        this.loadGoods(); // запуск функции загрузки Списка товаров

        this.loadCart(); // запуск загрузки Корзины


    }
})











// черновики





