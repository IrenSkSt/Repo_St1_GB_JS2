// 

var goods = [ // массив товаров магазина
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];
//console.log(goods); // для проверки

// формируем карточки товаров в блоке товаров
// упрощенный вариант кода в сравнении с вариантом из курса по Основам

const $goodlist = document.querySelector('.box_cards');

const renderGoodsItem = ({ title, price }) => {
    return `<figure class="card"><h3>${title}</h3><p>Цена: ${price}</p><button class="add-cart">Купить</button></figure>`;
}

const renderGoodsList = (list = goods) => {
    let goodsList = list.map(
        (item) => {
            return renderGoodsItem(item)
        }
    ).join(''); // - ответ на Задание 3 в скобках разделитель , заменили на пустоту

    $goodlist.insertAdjacentHTML('beforeend', goodsList);
}

renderGoodsList();

// Вариант в курсе Основ JS
// var box = document.querySelector('.box_cards');

// function showGood() { // потом добавить проверку наличия по кол-ву
//     for (var i = 0; i < goods.length; i++) {
//         var card = document.createElement('figure'); // добавили карточку товара
//         card.id = "card_" + (i + 1) + "";
//         card.setAttribute("class", "card");

//         var name = document.createElement('h3'); // добавили в карточке наименование товара
//         name.innerText = "" + goods[i].title + "";
//         card.append(name);

//         var price = document.createElement('p'); // добавили в карточке цену товара
//         price.innerText = "Цена: " + goods[i].price + " ";
//         price.innerHTML += "&#36;";
//         card.append(price);

//         var button = document.createElement('button'); // добавили в карточке кнопку купить
//         button.innerText = "Купить";
//         button.id = "btn_" + (i + 1) + "";
//         card.append(button);

//         box.append(card); // добавляем карточку в коробку для карточек товара
//     }
// }

// showGood(); // запускаем заполнение карточек товаров в каталоге
// console.log(box); // для проверки











