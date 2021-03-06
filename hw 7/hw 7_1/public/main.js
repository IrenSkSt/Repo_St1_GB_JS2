const API_URL = 'http://127.0.0.1:3000/';

// новый код ДЗ 7

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
    <button class="add-cart" v-on:click="onClickBuy">Купить</button>
    </figure>`,

    props: {
        title: String,
        price: Number,
        good: Object
    },
    methods: {
        onClickBuy(e) {
            // console.log("onClick"); // Для проверки
            // console.log(e.target); // Для проверки
            const id_good = e.target.parentElement.id;
            // console.log(e.target.parentElement.id); // Для проверки
            // console.log(id_buy); // Для проверки
            this.$emit('add-to-cart', id_good);
            this.$root.addBuy(id_good);
        }
    }
})

// каталог (список товаров)
Vue.component('catalog', {
    template: `<div class="box_cards">
    <card-good v-for="good of list" v-bind:key="good.id_product" v-bind:title="good.product_name" v-bind:price="good.price" v-bind:good="good" :id="good.id_product"></card-good>
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

// позиция по покупке в корзине
Vue.component('cart-item', {
    template: `<figure class="cart-item" >
    <h3 style="color: darkblue;">{{name}}</h3>
    <p>1 шт. х {{price}} руб. = {{price}} руб.</p>
    <button class="cart-delete"  v-on:click="onClickDelete">Удалить</button>
    </figure>`,

    props: {
        name: String,
        price: Number
    },
    methods: {
        onClickDelete(e) {
            // console.log("onClick"); // Для проверки
            // console.log(e.target); // Для проверки
            const id_buy = e.target.parentElement.id;
            // console.log(e.target.parentElement.id); // Для проверки
            // console.log(id_buy); // Для проверки
            this.$emit('delete-buy', id_buy);
            this.$root.deleteBuy(id_buy);
        }
    }
})

// Корзина (список покупок)
Vue.component('cart', {
    template: `<div class="cart" v-on:delete-buy v-on:onClickBuy>
    <button class="btn-close" v-on:click="closeCart">x</button>
    <h2>Ваша корзина</h2>
    <p style="color: blue;">{{message}}</p>
    <hr>
    <div class="cart-list"><cart-item v-for="item of list_buys" v-bind:key="item.id_product" v-bind:name="item.product_name" v-bind:price="item.price" :id="item.id_product"></cart-item>    
    </div>
</div>`,

    props: {
        list_buys: Array,
        // amount: Number,
        message: String
    },
    methods: {

        closeCart() {
            console.log("onClick"); // Для проверки
            this.$emit('click-сlose-сart')
        }
    }
})

// экземпляр Vue
new Vue({
    el: "#app", // селектор контейнера
    data: { // добавляем объект с переменными
        goods: [],
        filterGoods: [],
        cart: [],
        buys: [],
        // searchLine: '', // пустая строка поиска
        isNotFiltered: true, // покупатель не фильтрует поиском список товаров
        isOpenCart: false, // корзина не открыта для просмотра
        isAddToCart: true,
        isError: false, // для ошибок
        cartTotal: 'В корзине пока нет покупок. Выберете товар в каталоге', // корзина пуста
        cardsSum: 0,
        buysSumCounter: 0
    },
    methods: {
        loadGoods() { // загрузка списка товаров с сервера
            fetch(`${API_URL}catalogData`)
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
            fetch(`${API_URL}cartData`)
                .then((request) => request.json())
                .then((data) => {
                    data.contents.forEach(item => { this.cart.push(item) });
                    this.buys = this.cart;
                    // console.log(this.cart); // Для проверки
                    this.buysSumCounter = data.amount;
                    // console.log(this.buysSumCounter); // Для проверки
                    this.sumBuys();
                })
        },
        addToCart(buy) { //отправка на сервер новой покупки
            fetch(`${API_URL}addToCart`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/JSON'
                },
                body: JSON.stringify(buy)
            })
                .then(() => {
                    console.log(buy)

                })
        },
        deleteCart(buy) { //отправка на сервер удаленной покупки
            fetch(`${API_URL}deleteFromCart`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/JSON'
                },
                body: JSON.stringify(buy)
            })
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
        sumBuys() {
            if (this.cart.length == 0 || this.buysSumCounter == 0) {
                // console.log(this.cart); // Для проверки
                this.cartTotal = 'В корзине пока нет покупок. Выберете товар в каталоге';
            } else {
                this.cartTotal = `Общая стоимость Ваших покупок составляет = ${this.buysSumCounter} руб.`;
            }

        },

        deleteBuy(id_buy) {
            // console.log(id_buy); // для проверки

            const index = this.buys.findIndex((item) => item.id_product == id_buy);
            // console.log(index); // для проверки
            const deletePositionCart = this.buys[index];

            // console.log(deletePositionCart.id); // для проверки
            this.buysSumCounter -= deletePositionCart.price;
            // this.deleteCart(buy);
            // this.buys.splice(index, 1);
            this.buys.splice(index, 1);
            this.cart = this.buys;

            // console.log(deletePositionCart.price); // для проверки
            // console.log(this.buys); // для проверки
            // console.log(this.cart); // для проверки
            this.deleteCart(deletePositionCart);
            this.sumBuys();
            this.isAddToCart = true;
        },

        addBuy(id_good) { // добавить покупку в Корзину

            // console.log(id_good); // Для проверки
            // console.log(this.cart); // Для проверки

            if (this.cart.length > 0) {

                this.cart.forEach((item) => {
                    if (item.id_product == id_good) {
                        this.isAddToCart = false;
                        this.showBuy();
                        return alert('Данный товар уже добавлен в Вашу корзину');
                    }
                });
            }

            if (this.isAddToCart) {
                const index = this.filterGoods.findIndex((item) => item.id_product == id_good);
                // console.log(index); // для проверки
                const addNewBuy = this.filterGoods[index];
                // console.log(addNewBuy); // Для проверки
                this.buys.push(addNewBuy);
                this.cart = this.buys;
                this.buysSumCounter += addNewBuy.price;
                this.sumBuys();
                this.addToCart(addNewBuy);

                this.showBuy();
            }
            // console.log(this.buys); // Для проверки

        }

    },

    computed: {

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





