var Post = require('../models/post').Post;
var OpenQ = require('../models/openQ').OpenQ;
var TestQ = require('../models/testQ').TestQ;
var async = require('async');

var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;

exports.get = function(req, res) {
    var id = req.query.id;

    Post.findById(id,function(err, post) {
        TestQ.find({postId: id}, function(err, test){
            OpenQ.find({postId: id}, function(err, open) {
                res.render('post-edit', {post: post, test: test, open: open});
            });
        });
    });
};

exports.post = function(req, res, next) {
    var tests    = req.body.test,
        opens    = req.body.open,
        delOpens = req.body.delOpen,
        delTests = req.body.delTest;

    Post.edit(req, function (err, post) {
        if (err) {
            if (err instanceof AuthError) {
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        }

        PostID = post.id;

        async.parallel({
            testDel: function(callback){
                if (!delTests) return callback(null, null);
                async.each(delTests, function(testId, callback) {
                    TestQ.remove({_id: testId}, function (err) {
                        callback(null);
                    })
                }, callback);
            },
            openDel: function(callback){
                if (!delOpens) return callback(null, null);
                async.each(delOpens, function(openId, callback) {
                    OpenQ.remove({_id: openId}, function (err) {
                        callback(null);
                    })
                }, callback);
            },
            testQ: function(callback){
                if(!tests) return callback(null, null);
                async.each(tests, function(test, callback) {
                    TestQ.edit(test, PostID, function (err) {
                        callback(null)
                    })
                }, callback);
            },
            openQ: function(callback) {
                if(!opens) return callback(null, null);

                async.each(opens, function (open, callback) {
                    OpenQ.edit(open, PostID, function (err) {
                        callback(null)
                    })
                }, callback);
            }
        }, function(err, results) {
            //return
            //res.send();
        });

        res.send();
    })
}



