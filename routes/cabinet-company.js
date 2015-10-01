var Company = require('../models/company').Company;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/company').AuthError;

exports.get = function(req, res) {
    res.render('cabinet-company');
};

exports.post = function(req, res, next) {
    //console.log(req.body);

    Company.edit(req, function (err, company) {
        if (err) {
            if(err instanceof AuthError){
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        }

        req.session.company = company._id;
        res.send({});
    })
}

exports.password =  function(req, res, next){
    console.log(req.body);

    var companyName = req.body.companyName,
        password = req.body.password;

    Company.password(companyName, password, function (err, company) {
        if (err) {
            if(err instanceof AuthError){
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        }

        req.session.company = company._id;
        res.send({});
    })
}
