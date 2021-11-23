// новый код ДЗ 5

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

new Vue({
    el: "#app", // селектор контейнера
    data: { // добавляем объект с переменными
        goods: [],
        filterGoods: [],
        cart: [],
        buys: [],
        searchLine: '', // пустая строка поиска
        isNotFiltered: true, // покупатель не фильтрует поиском список товаров
        isOpenCart: false, // корзина не открыта для просмотра
        isAddToCart: true,
        cartEmpty: 'В корзине пока нет покупок. Выберете товар в каталоге', // корзина пуста
        cardsSum: 0,
        buysSumCounter: 0
    },
    methods: {
        loadGoods() { // загрузка списка товаров с сервера
            fetch(`${API_URL}catalogData.json`)
                .then((request) => request.json())
                .then((data) => {
                    this.goods = data;
                    this.filterGoods = this.goods;
                })
        },

        filter() { // фильтер товаров по запросу в поисковой строке
            if (this.searchLine.length === 0) {
                this.isNotFiltered = true;
                this.filterGoods = this.goods;
            } else {
                const searchString = this.searchLine.trim();
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
            this.buys.splice(buy, 1);
            this.cart.splice(buy, 1);
            // console.log(this.buys); // для проверки
            // console.log(this.cart); // для проверки
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
                this.buys.push(buy);
                this.cart.push(buy);
                this.buysSumCounter += buy.price;

                this.showBuy();
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
        // console.log(this.cart); // Для проверки
    }
})











// черновики





