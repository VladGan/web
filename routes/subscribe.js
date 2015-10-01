var User = require('../models/user').User;
var Company = require('../models/company').Company;
var Post = require('../models/post').Post;

exports.get = function(req, res) {
    var array = req.user.subscribe

    Post.find({
        postAuthor: { $in: array}
    }, function(err, post){
        console.log(post);

        res.render('subscribe', {post: post});
    });

};

exports.post= function(req, res) {
    var companyId = req.body.companyId
    var username = req.user.username

    User.subscribe(companyId, username, function(err, user){

        req.session.user = user._id;
        res.send({});
    })
};