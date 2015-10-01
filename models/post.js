var crypto = require('crypto');
var async = require('async');
var util = require('util');
var mongoose = require('../lib/mongoose'),
    Schema = mongoose.  Schema;

var company = require('./company');

var schema = new Schema({
    postAuthor: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    place:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    tags:{
        type: String,
        required: true
    },
    users:{
        type: Array,
        required: true
    },
    companyName:{
        type: String,
        required: true
    }
    });

schema.statics.create = function(req,cb) {
    var Post = this;
    var post = new Post({
        title : req.body.title,
        text : req.body.text,
        place : req.body.place,
        date : new Date(),
        postAuthor : req.body.id,
        companyName : req.body.companyName,
        tags : req.body.tags,
        users : [null]
    });
    post.save(function(err) {
        if (err) return cb(err);
        cb(null,post)
    });
};

schema.statics.respond = function(req, callback){
    var postId = req.body.id,
        user = req.user.id

    var Post = this;

    async.waterfall([
        function(callback) {
            Post.findById(postId, callback)
        },
        function(post, callback){
            if(post) {
                post.users.push(user);

                post.save(function(err) {
                    if (err) return callback(err);
                    callback(null, post);
                });
            }
        }] , callback)
};

schema.statics.edit =  function(req, callback) {

    var title = req.body.title;
    var text = req.body.text;
    var place = req.body.place;
    var tags = req.body.tags;

    var id = req.body.id;


    var Post = this;

    async.waterfall([
        function(callback) {
            Post.findById(id, callback);
        },
        function(post, callback) {
            if (post) {
                post.title = title;
                post.text = text;
                post.place = place;
                post.tags = tags;

                post.save(function(err) {
                    if (err) return callback(err);
                    callback(null, post);
                });
            } else {
                callback(new AuthError("Wrong Data"));
            }
        }
    ], callback);
};


exports.Post = mongoose.model('Post', schema);


function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;