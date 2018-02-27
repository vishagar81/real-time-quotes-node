var cluster = require('cluster')
var http = require('http')
var numOfCPUs = require('os').cpus().length;

// simulate a Db connection to return the number of Users
const numberOfUsersInDB = function() {
    this.count = this.count || 5;
    this.count = this.count * this.count;
    return this.count;
}
if( cluster.isMaster ){
    console.log(`Master with Process ID: ${process.pid} is running`);
    console.log(`Num of CPUs: ${numOfCPUs} `);
    // Fork workers
    for(var i = 0; i < numOfCPUs; ++i ){
        cluster.fork();
    }

    // call to get the numberOfDUsers from Master, so that only 1 connection is made
    // workers need not make a db conn, instead get the count from master
    const updateWorkers = () => {
        const usersCount = numberOfUsersInDB();
        Object.values(cluster.workers).forEach(worker => {
            worker.send({ usersCount });
        });
    };

    updateWorkers();
    // simulate the increase in userCount every 10s !!!
    setInterval(updateWorkers, 10000);

    // on crash of worker process, fork a new worker process -- fail detection and automatic recovery
    cluster.on('exit', (worker, code, signal) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(`Worker ${worker.id} crashed. ` +
                        'Starting a new worker...');
            cluster.fork();
        }
    });
} else {
    let usersCount;
    // Workers sharing an HTTP server
    http.createServer((req, res)=> {
        res.writeHead(200);
        res.write(`An example of clusters\n Worker process ID: ${process.pid}, processed the request`);
        res.end(`Users: ${usersCount}`);
    }).listen(3000);
    process.on('message', msg => {
        usersCount = msg.usersCount;
    });
    console.log(`Worker with Process ID: ${process.pid} started`);

    // simulate a crash of worker process, to test High Availability !
    setTimeout(() => {
        process.exit(1) // death by random timeout
    }, Math.random() * 10000);
}