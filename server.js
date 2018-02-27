var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var buffer = Buffer.from('Vishal');

server.listen(3000);

console.log("Server listening on port: 3000");
console.log(buffer);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/admin', function(req, res){
    res.sendFile(__dirname + '/admin.html');
});

io.on('connection', function(socket){
    socket.emit('welcome', { data: 'welcome '});

    socket.on('new', function(data){
        console.log('About to upload Quote');
        io.sockets.emit('next', { data: data });
    });
});