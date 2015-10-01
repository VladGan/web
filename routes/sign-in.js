var User = require('../models/user').User;
var Company = require('../models/company').Company;

var async = require('async')

var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;

exports.get = function(req, res) {
    res.render('sign-in');
};

exports.post = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    //console.log(req.body);

    async.parallel({
            user: function(callback){
                User.check(username, callback)
            },
            company: function(callback){
                Company.check(username, callback)
            }
        },
        function(err, results) {
            var isUser = results.user[0],
                isCompany = results.company[0]

            if(isUser){
                User.authorize(username, password, function (err, user) {
                    if (err) {
                        if (err instanceof AuthError) {
                            return next(new HttpError(403, err.message));
                        } else {
                            return next(err);
                        }
                    }

                    req.session.user = user._id;
                    res.send({});
                })
            } else if(isCompany){
                Company.authorize(username, password, function (err, company) {
                    if (err) {
                        if (err instanceof AuthError) {
                            return next(new HttpError(403, err.message));
                        } else {
                            return next(err);
                        }
                    }

                    req.session.company = company._id;
                    res.send({});
                })
            }  else {
                next(new HttpError(403, "Wrong login"));
            }
        });
}