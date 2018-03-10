var http = require('http');
var app = require('express')();
var server = http.createServer(app);
var io = require('socket.io')(server);  ///////////////
var express = require('express');
var bodyParser = require('body-parser');

var routes_stock = require('./routes/stock_page.js')();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', routes_stock.stock);

io.on('connection', (socket)=>require('./routes/sockets.js')(io,socket));


server.listen(process.env.PORT);