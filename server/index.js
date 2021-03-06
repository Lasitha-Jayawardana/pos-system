var express = require('express'),
    app = require('express')(),
    server = app.listen(process.env.PORT || 8080),
    io = require('socket.io')(server),
    path = require('path'),
    bodyParser = require('body-parser'),
    publicPath = '/../public/',
    liveCart;

console.log('Hunts Point POS');
console.log('Server started');

app.use(express.static(path.resolve(__dirname + publicPath)));
app.use(express.static(path.resolve(__dirname + '/../bower_components')));

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, publicPath, 'index.html'));
});


app.get("/download/index", function(req, res) {
    console.log('start download')
    const file = "./server/databases/index.db";
    res.download(file);
    console.log('end  download')
});
app.get("/download/inventory", function(req, res) {
    console.log('start download')
    const file = "./server/databases/inventory.db";
    res.download(file);
    console.log('end  download')
});
app.get("/download/transactions", function(req, res) {
    console.log('start download')
    const file = "./server/databases/transactions.db";
    res.download(file);
    console.log('end  download')
});


app.use('/api', require('./api'));

// Websocket logic for Live Cart
io.on('connection', function(socket) {

    socket.on('cart-transaction-complete', function() {
        socket.broadcast.emit('update-live-cart-display', {});
    });

    // upon page load, give user current cart
    socket.on('live-cart-page-loaded', function() {
        socket.emit('update-live-cart-display', liveCart);
    });

    // upon connecting, make client update live cart
    socket.emit('update-live-cart-display', liveCart);

    // when the cart data is updated by the POS
    socket.on('update-live-cart', function(cartData) {

        // keep track of it
        liveCart = cartData;

        // broadcast updated live cart to all websocket clients
        socket.broadcast.emit('update-live-cart-display', liveCart);
    });
    // test comment insert pranavi
});
module.exports = app;