var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cluster = require('cluster')
var numOfCPUs = require('os').cpus().length;

if( cluster.isMaster ){
    console.log(`Master with Process ID: ${process.pid} is running`);
    console.log(`Num of CPUs: ${numOfCPUs} `);

    // Fork workers
    for(var i = 0; i < numOfCPUs; ++i ){
        cluster.fork();
    }

    // on crash of worker process, fork a new worker process -- fail detection and automatic recovery
    cluster.on('exit', (worker, code, signal) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(`Worker ${worker.id} crashed. ` +
                        'Starting a new worker...');
            cluster.fork();
        }
    });
} else {
    server.listen(3000);
    console.log(`Worker with Process ID: ${process.pid} started`);
    console.log("Server listening on port: 3000");

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
}