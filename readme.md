## Synopsis

This project explains the different functionalities provided by Node and my understanding of it.
git clone <repo url>
npm install

This repo has 2 examples for understanding node
1) server.js (real-time quotes)
This node file when run from command prompt with 'node server' within the project directory launches a web server that demonstrates communication by means of socket.io
More details can be found here, https://www.nodejsera.com/nodejs-tutorial-day14-introduction-to-socket-io.html
Steps:
1) Start the node server using command, "node server"
2) launch 2 browser tabs, one with url, "http://localhost:3000/index" and other with url, "http://localhost:3000/admin".
3) Any quote typed in the 'admin' should reflect directly in the 'index' tab without any refreshing of 'index' tab

2) cluster.js
This node file demonstrates how can we implement a simple, crude load balancer using 'cluster' module of Node
More details can be found here, https://medium.freecodecamp.org/scaling-node-js-applications-8492bd8afadc
The example basically creates as many web-server instances as there are cores on the machine. Hence, the full benifit of this code could only be realised in a multi-core machine (vertical scaling). Horizontal scaling can only be achieved by adding more machines of similar config to the setup.
Features demonstrated:
2.1) Launching worker processes from 1 master process
2.2) Sending messages from master to all worker processes
2.3) Simulating a crash of one of the worker processes, detection of the same by master and forking a new process as a result
2.4) It also shows the best way of making a DB connection in such a setup (viz making 1 connection from master and sending the relevant info to all the workers for optimised performance)

If there is a requirement to have sticky session wherein the same request is served by the same server then that can be achieved by having some kind of shared state saved in a Redis node or a shared database. Simply because, each node process has its own memory that cannot be accessed by any other node process.
One other way it can be achieved is by having some kind of a lookup in the master process, so that when a user is served by a server then an entry is made in the lookup against that worker process id so subsequently those requests can be diverted to the relavant woker process id. Please note that this is not a recommended solution but just a 'life-saver'.

Steps:
1) Start the node server using command, "node cluster"

Note: Please compare the performance of multiple node worker processes running on multiple cores as opposed to 1 node process running on multiple cores usng "ab" tool from apache, here, https://www.apachelounge.com/download/
Unzip the contents, the tool is located in the bin folder.





