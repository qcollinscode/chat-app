var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    request = require("request"),
    bodyParser = require("body-parser");

users = [];
connections = [];

/** Static Directory **/
 app.use(bodyParser.urlencoded({extended: true}), express.static("public"));

/** View Engine **/
 app.set("view engine", "ejs");

// app.use(express.static(__dirname + '/public'));

server.listen(process.env.PORT || 3000, process.env.IP, function() {
    console.log("Server is running....");
});

app.get('/', function(req, res) {
    res.render('home');
});


io.sockets.on("connection", function(socket) {
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);


    // Disconnect
    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    // Send Message

    socket.on('send message', function(data) {
        io.sockets.emit("new message", {msg: data, user: socket.username});
    });

    // New User

    socket.on('new user', function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get users', {users: users});
    }
});
