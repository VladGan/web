var User = require('../models/user').User;
var Company = require('../models/company').Company;
var Post = require('../models/post').Post;

var OpenQ = require('../models/openQ').OpenQ;
var TestQ = require('../models/testQ').TestQ;

var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;


var async = require('async')

exports.user = function(req, res) {
    var id = req.query.id;

    User.findById(id,function(err, user) {
        res.render('user-page',{curuser: user});
    });
};

exports.post = function(req, res) {
    var id = req.query.id;

    Post.findById(id,function(err, post) {
        curPost = post

        async.parallel({
            testQ: function(callback){
                TestQ.find({postId: id}, function(err, test){
                    if(!test.length) return  callback(null,null,"")

                    var str = "<h5>Test Questtions</h5>"

                    for(var i=0;i<test.length;i++) {
                        var p = '<p>'+test[i].question+'</p>',
                            input = ""

                        for(var j=0;j<test[i].variant.length;j++){
                            input = input + '<input type="radio" name="test" value="'+(j+1)+'"> ' + test[i].variant[j] + '<br>'
                        }

                        str = str + '<div class="form-group test-form" data-anachronism="'+test[i].id+'">' + p + '<form>'+ input + '</form></div>'
                    }

                    callback(null, test, str)
                })
            },
            openQ: function(callback){
                OpenQ.find({postId: id}, function(err, open){
                    if(!open.length) return  callback(null,null,"")
                    var str = "<h5>Open Questtions</h5>"

                    for(var i=0;i<open.length;i++) {
                        p = '<p>'+open[i].question+'<p>',
                        input = '<input name="text" type="textarea" value="" class="form-control" id="open-a" placeholder="Add Answer">'

                        str = str + '<div class="form-group open-form" data-anachronism="'+open[i].id+'">' + p + input + '</div>'
                    }

                    callback(null, open, str)
                })
            }
        }, function(err, results){
            res.render('post-details',{post: post, user: req.user, open: results.openQ[1], test: results.testQ[1]});
        })
    });
};

exports.company = function(req, res) {
    var id = req.query.id;


    async.parallel({
            post: function(callback){
                Post.find({postAuthor: id}, callback)
            },
            company: function(callback){
                Company.findById(id,callback)
            }
        }, function(err, result){
            res.render('company-page',{curcompany: result.company, post: result.post, user: req.user});
    });
};
