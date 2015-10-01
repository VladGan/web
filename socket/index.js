var log = require('../lib/log')(module);
var config = require('../config');
var connect = require('connect');
var async = require('async');
var cookie = require('cookie');
var sessionStore = require('../lib/sessionStore');
var HttpError = require('../error').HttpError;

var User = require('../models/user').User;
var Company = require('../models/company').Company;

var log = require('../lib/log')(module);

function loadSession(sid, callback) {
    sessionStore.load(sid, function(err, session) {
        if (arguments.length == 0) {
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });

}

function loadUser(session, callback) {

    if (!session.user) {
        log.debug("Session %s is anonymous", session.id);
        return callback(null, null, session);
    }

    log.debug("retrieving user ", session.user);

    User.findById(session.user, function(err, user) {
        if (err) return callback(err);

        if (!user) {
            return callback(null, null, session);
        }
        log.debug("user findbyId result: " + user);
        callback(null, user, session);
    });

}

function loadCompany(session, callback) {

    if (!session.company) {
        log.debug("Session %s is anonymous", session.id);
        return callback(null, null);
    }

    log.debug("retrieving company ", session.company);

    Company.findById(session.company, function(err, company) {
        if (err) return callback(err);

        if (!company) {
            return callback(null, null);
        }
        log.debug("company findbyId result: " + company);
        callback(null, company);
    });

}

module.exports = function(server) {
    var io = require('socket.io')(server);

    var User = {}

//    io.set('origins', 'localhost:*');
    io.set('logger', log);

    io.set('authorization', function(handshake, callback) {
        async.waterfall([
            function(callback) {

                handshake.cookies = cookie.parse(handshake.headers.cookie || '');
                var sidCookie = handshake.cookies[config.get('session:key')];
                var sid = connect.utils.parseSignedCookie(sidCookie, config.get('session:secret'));

                loadSession(sid, callback);
            },
            function(session, callback) {

                if (!session) {
                    callback(new HttpError(401, "No session"));
                }

                handshake.session = session;
                loadUser(session, callback);
            },
            function(user, session, callback) {

                if (!user) {
                    loadCompany(session, callback);
                } else {
                    callback(null, user);
                }

            },
            function(user, callback){

                if (!user) {
                    callback(new HttpError(403, "Anonymous session may not connect"));
                }

                //handshake.user = user;
                User = user;

                callback(null);
            }

        ], function(err) {
            if (!err) {
                return callback(null, true);
            }

            if (err instanceof HttpError) {
                return callback(null, false);
            }

           callback(err);
        });
    });

    io.sockets.on('session:reload', function(sid) {
        var clients = io.sockets.clients();

        clients.forEach(function(client) {
            if (client.handshake.session.id != sid) return;

            loadSession(sid, function(err, session) {
                if (err) {
                    client.emit("error", "server error");
                    client.disconnect();
                    return;
                }

                if (!session) {
                    client.emit("logout");
                    client.disconnect();
                    return;
                }

                client.handshake.session = session;
            });

        });

    });

    io.sockets.on('connection', function(socket) {
        //console.log(socket.handshake);

       //var username = socket.handshake.user.get('username');
        if(!User) return

        if( User.get('username'))
            var username = User.get('username');
        else
            var username = User.get('companyName');


        //console.log(username);

        socket.broadcast.emit('join', username);

        socket.on('post', function(text, cb) {
            socket.broadcast.emit('post', username, text);
            cb && cb();
        });

        socket.on('disconnect', function() {
            socket.broadcast.emit('leave', username);
        });

    });

    return io;
};