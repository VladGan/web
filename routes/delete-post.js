var async = require('async');

var OpenQ = require('../models/openQ').OpenQ;
var TestQ = require('../models/testQ').TestQ;

exports.post = function(req, res, next) {
    var id = req.body.id;

    var mongoose = require("../lib/mongoose");
    //console.log(mongoose.model("Post").findByIdAndRemove(id));
    mongoose.model('Post').findById(id, function (err, doc) {
        if (err) throw err;
        doc.remove();

        async.parallel({
            open: function(callback){
                OpenQ.remove({
                    'postId': id
                }, callback);
            },
            test: function(callback){
                TestQ.remove({
                    'postId': id
                },callback);
            }
        }, function(err, results){
            if(err) return
        })
    })
}