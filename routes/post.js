var Post = require('../models/post').Post;
var OpenQ = require('../models/openQ').OpenQ;
var TestQ = require('../models/testQ').TestQ;

var HttpError = require('../error').HttpError;
var AuthError = require('../models/post').AuthError;

var async = require('async');

exports.get = function(req, res) {
    res.render('post');
};

//Test = function (test){
//    async.waterfall([
//        function (callback){
//            TestQ.create(test, function (err, test) {
//                callback(test)
//            })
//        }
//    ], function(test){
//        return test
//    });
//}
//
//Open = function (open){
//    async.waterfall([
//        function (callback){
//            OpenQ.create(open, function (err, open) {
//                callback(open)
//            })
//        }
//    ], function(open){
//        return open
//    });
//}

var PostID = ""

exports.post = function(req, res, next) {
    var tests = req.body.test,
        opens = req.body.open;

//    async.parallel({
//            testQ: function(callback){
//                async.each(tests,
//                    function(test,callback) {
//                        TestQ.create(test, function (err, test) {
//                            callback(test)
//                        })
//                    },
//                    function(result){
//                        callback(result)
//                    }
//                );
//
//                if(!tests) callback(null)
//
//                async.map(tests, Test, function (res){
//                    callback(res);
//                });
//            },
//            openQ: function(callback){
//                async.each(opens,
//                    function(open,callback) {
//                        OpenQ.create(open, function (err, open) {
//                            callback(open)
//                        })
//                    },
//                    function(result){
//                       callback(result)
//                    }
//                );
//
//                if(!opens) callback(null)
//
//                async.map(opens, Open, function (res){
//                    callback(res);
//                });
//            }
//        },function(err, results) {
//
//        console.log(results);
//        return;
//
//        Post.create(req, function (err, post) {
//            if (err) console.log(err);
//            res.send();
//        })
//     });

    Post.create(req, function (err, post) {
        if (err) console.log(err);
        PostID = post.id;

        async.parallel({
            testQ: function(callback){
                if(!tests) return callback(null, null);

                async.each(tests, function(test, callback) {
                    TestQ.create(test, PostID, function (err) {
                        callback(null)
                    })
                }, callback);
            },
            openQ: function(callback) {
                if(!opens) return callback(null, null);

                async.each(opens, function (open, callback) {
                    OpenQ.create(open, PostID, function (err) {
                        callback(null)
                    })
                }, callback);
            }
        }, function(err, results) {
            //return
            res.send();
        })

    })

//    async.waterfall([
//        function(callback){
//        },
//        function(post, callback){
//            PostID = post.id;
//
//            if(!tests) return callback(null, null);
//
//            async.each(tests, function(test, callback) {
//                TestQ.create(test, PostID, function (err) {
//                    callback(null)
//                })
//            }, callback);
//        },
//        function(test, callback){
//            if(!opens) return callback(null, null);
//
//            async.each(opens, function(open, callback) {
//                OpenQ.create(open, PostID, function (err) {
//                    callback(null)
//                })
//            }, callback);
//        }
//    ],function(err, results){
//        return
//        res.send();
//    })


};