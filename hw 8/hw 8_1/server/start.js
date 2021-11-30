// сервер на фреймворке express

const express = require('express')
const fs = require('fs')

const port = 3000
const static_dir = '../public'

const app = express()

app.use(express.json())

app.use(express.static(static_dir))

app.get('/catalogData', (req, res) => { // запрос каталога с сервера
    fs.readFile('data/catalog.json', 'utf8', (err, data) => {
        res.send(data);
    })
});

app.get('/cartData', (req, res) => { // запрос корзины с сервера
    fs.readFile('data/cart.json', 'utf8', (err, data) => {
        res.send(data);
    })
});

app.post('/addToCart', (req, res) => { // добавление новой покупки в корзину
    fs.readFile('data/cart.json', 'utf8', (err, data) => {
        const cart = JSON.parse(data);

        const item = req.body;

        cart.contents.push(item);
        cart.amount += item.price;

        fs.writeFile('data/cart.json', JSON.stringify(cart), (err, res) => {
            console.log('done');
            res.end();
        });
    });
});

app.post('/deleteFromCart', (req, res) => { // удаление товара из корзины
    fs.readFile('data/cart.json', 'utf8', (err, data) => {
        const cart = JSON.parse(data);
        // console.log(cart.amount); // для проверки

        const deleteBuy = req.body;
        cart.amount -= deleteBuy.price;
        // console.log(deleteBuy.price); // для проверки
        const index = cart.contents.findIndex((item) => item.id_product == deleteBuy.id_product);

        cart.contents.splice(index, 1);


        fs.writeFile('data/cart.json', JSON.stringify(cart), (err, res) => {
            console.log('done');
            res.end();
        });
    });
});

app.listen(port, function () {
    console.log('server is running on port ' + port + '!')
})


