// новый код ДЗ 5

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

new Vue({
    el: "#app", // селектор контейнера
    data: { // добавляем объект с переменными
        goods: [],
        filterGoods: [],
        searchLine: '', // пустая строка поиска
        isNotFiltered: true

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
            if (this.searchLine.lenght === 0) {
                this.isNotFiltered = true;
                this.filterGoods = this.goods;
            } else {
                const searchString = this.searchLine.trim();
                const reg = new RegExp(searchString, 'i');
                this.filterGoods = this.goods.filter((good) => reg.test(good.product_name));
                this.isNotFiltered = false;

            }
        }

    },
    mounted() {
        this.loadGoods(); // запуск функции загрузки Списка товаров
    }
})











// черновики





