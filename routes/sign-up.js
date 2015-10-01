var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;

exports.get = function(req, res) {
    res.render('sign-up');
};

exports.post = function(req, res, next) {
    //req.body.skils = req.body.skills.split(",")

    //console.log(req.body);

    var password = req.body.password;
    var confirm = req.body.confirm;

    //return

    if(confirm!=password){
        var message = "Not correct confirm of password";
        return next(new HttpError(403, message));
    }


    User.registration(req, function (err, user) {
        if (err) {
            if(err instanceof AuthError){
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        }

        req.session.user = user._id;
        res.send({});
    })
}