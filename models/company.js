var crypto = require('crypto');
var async = require('async');
var util = require('util');
var fs = require('fs');
var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var User = require('./user').User;

var schema = new Schema({
    companyName: {
        type: String,
        unique: true,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    contacts:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    about:{
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(companyName, password, callback) {
    var Company = this;

    async.waterfall([
        function(callback) {
            Company.findOne({companyName: companyName}, callback);
        },
        function(company, callback) {
            if (company) {
                if (company.checkPassword(password)) {
                    callback(null, company);
                } else {
                    callback(new AuthError("Wrong Password"));
                }
            } else {
                callback(new AuthError("Wrong name"));
            }
        }
    ], callback);
};

schema.statics.registration = function(req, callback) {
    var companyName = req.body.companyName;
    var password = req.body.password;
    var about = req.body.about;
    var city = req.body.city;
    var contacts = req.body.contacts;
    var img = req.body.img;

    var Company = this;

    async.waterfall([
        function(callback) {//проверяем на наличее такого юзера
            var User = require('./user').User;

            User.check(companyName, function(err, bool){
                if (bool) {
                    callback(new AuthError("Name is already by User"));
                } else {
                    Company.findOne({companyName: companyName}, callback);
                }
            });
        },
        function(company, callback) {
            if (company) {
                callback(new AuthError("Name is already used"));
            } else {

                var company = new Company({
                    companyName: companyName,
                    password: password,
                    about: about,
                    city:city,
                    contacts:contacts,
                    img:img
                });

                company.save(function(err) {
                    if (err) return callback(err);
                    callback(null, company);
                });
            }
        }
    ], callback);
};

schema.statics.password = function(companyName, password, callback) {
    var Company = this;

    //console.log(username, password)

    async.waterfall([
        function(callback) {
           Company.findOne({companyName: companyName}, callback);
        },
        function(company, callback) {
            if (company) {
                //console.log(user);
                company.hashedPassword = company.encryptPassword(password);
                //console.log(user);

                company.save(function(err) {
                    if (err) return callback(err);
                    callback(null, company);
                });
            } else {
                callback(new AuthError("Wrong Company Name"));
            }
        }
    ], callback);
};

schema.statics.edit =  function(req, callback) {
    var username = req.body.lastname;

    var companyName = req.body.companyName;
    var password = req.body.password;
    var about = req.body.about;
    var city = req.body.city;
    var contacts = req.body.contacts;
    var img = req.body.img;

    var Company = this;

    async.waterfall([
        function(callback) {
            Company.check(companyName, function(err, bool, company) {//проверяем едм новое имя у компании или у юзера
                if (bool) {
                    if (company.companyName == username)
                        Company.findOne({companyName: username}, callback);
                    else
                        callback(new AuthError("Name is already by Company"));
                } else {
                    var User = require('./user').User;

                    User.check(companyName, function(err, bool){
                        if (bool) {
                            callback(new AuthError("Name is already by User"));
                        } else {
                            Company.findOne({companyName: username}, callback);
                        }
                    });
                }
            });
        },
        function(company, callback) {
            if (company) {
                console.log(company);

                company.companyName = companyName;
                company.contacts = contacts;
                company.about = about;
                company.city = city;
                company.img = img;

                company.save(function(err) {
                    if (err) return callback(err);
                    callback(null, company);
                });
            } else {
                callback(new AuthError("Wrong Data"));
            }
        }
    ], callback);
};

//проверяем если есть такая компания
//возвращаем да если есть
//нет если нет
schema.statics.check = function(name, callback) {
    var Company = this;

    async.waterfall([
        function(callback) {
            Company.findOne({companyName: name}, callback);
        },
        function(company, callback) {
            if (company) {
                callback(null,true,company);
            } else {
                callback(null,false,null);
            }
        }
    ], callback);
};

exports.Company = mongoose.model('Company', schema);


function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;