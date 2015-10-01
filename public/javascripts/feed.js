var socket = io.connect('', {
    reconnect: false
});

socket
    .on('post', function(username,post) {
        console.log(username,post);
        location.reload();
    })
    .on('leave', function(username) {
        console.log(username + " вышел из чата");
    })
    .on('join', function(username) {
        console.log(username + " вошёл в чат");
    })
    .on('connect', function() {
        console.log("соединение установлено");
    })
    .on('disconnect', function() {
        console.log("соединение потеряно");
    })
    .on('logout', function() {
        location.href = "/";
    })
    .on('error', function(reason) {
        if (reason == "handshake unauthorized") {
            console.log("вы вышли из сайта");
        } else {
            setTimeout(function() {
                socket.socket.connect();
            }, 500);
        }
    });