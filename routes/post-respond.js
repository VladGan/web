var Post = require('../models/post').Post;

var OpenQ = require('../models/openQ').OpenQ;
var TestQ = require('../models/testQ').TestQ;

var HttpError = require('../error').HttpError;
var AuthError = require('../models/post').AuthError;

var User = require('../models/user').User;

var async = require('async')

var id = ''
exports.get = function(req, res, next){
    id = req.query.id;
    Post.findById(id, function(err, post){
        //res.json(post)
        async.parallel({
            open: function(callback){
                OpenQ.find({postId: id}, callback)
            },
            test: function(callback){
                TestQ.find({postId: id}, callback)
            },
            users: function(callback){
                User.find({
                    '_id': { $in: post.users}
                }, callback)
            }
        }, function(err, results){
            var users = results.users,
                test = results.test,
                open = results.open

            for(var i=0;i<users.length;i++){
                var status = 0;

                for(var j=0;j<test.length;j++) {
                    var index = getIndex(test[j].userRespondId, users[i].id);

                    if (index == undefined) continue

                    status += test[j].userCorrect[index]
                }

                for(var j=0;j<open.length;j++) {
                    var index = getIndex(open[j].userRespondId, users[i].id);

                    if (index == undefined) continue

                    status += open[j].userCorrect[index]
                }

                users[i]['status'] = status
            }

            users.sort(function(a,b){
                return a['status'] < b['status']
            }).map(function(a){
                a['postId'] = id
                return a
            })


            res.render('respond-list',{users: results.users})
        })
//        async.each(post.users,
//            function(userId,callback) {
//                User.find({"_id":userId}, function(err, user){
//                    callback(user);
//                })
//            },
//            function(result){
//                console.log(result)
//            }
//        );
    })
}

function getIndex(arr, val){
    for(var i=0; i < arr.length;i++)
        if(arr[i]==val) return i

    return undefined
}

exports.post = function(req, res, next) {
    var openObj = req.body.open,
        testObj = req.body.test;

    if(openObj)
        var openArray = openObj.map(function(val){
            return val.id
        })
    else
        var openArray = []

    if(testObj)
        var testArray = testObj.map(function(val){
            return val.id
        })
    else
        var testArray = []

    async.parallel({
        open: function(callback){
            if(!openArray.length) return callback(null, null)

            OpenQ.find({
                '_id': { $in: openArray}
            }, function(err, open){
                for(var i=0;i<open.length;i++){
                    var index = getIndex(openArray, open[i].id)

                    if(index == undefined) continue

                    open[i].userRespondId.push(req.user.id)
                    open[i].userRespondAnswer.push(openObj[index].ans)
                    open[i].userCorrect.push(openObj[index].ans==open[i].answer)

                    open[i].save(function(err) {
                        if (err) console.log(i+" Open")
                    });
                }

                callback(null, open)
            });
        },
        test: function(callback){
            if(!testArray.length) return callback(null, null)

            TestQ.find({
                '_id': { $in: testArray}
            }, function(err, test){
                for(var i=0;i<test.length;i++){
                    var index = getIndex(testArray, test[i].id)

                    if(index == undefined) continue

                    test[i].userRespondId.push(req.user.id)
                    test[i].userRespondAnswer.push(testObj[index].ans)
                    test[i].userCorrect.push(testObj[index].ans==test[i].answer)

                    test[i].save(function(err) {
                        if (err) console.log(i+" Test")
                    });
                }

                callback(null, test)
            });
        }
    }, function(err, results){
        if(err) return

        Post.respond(req, function (err, post) {
            res.send({});
        })
    })


};
