var crypto = require('crypto');
var async = require('async');
var util = require('util');
var fs = require('fs');
var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var Company = require('./company').Company;

var schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstname:{
        type: String,
        required: true
    },
    secondname:{
        type: String,
        required: true
    },
    mail:{
        type: String,
        required: true
    },
    dob:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    university:{
        type: String,
        required: true
    },
    direction:{
        type: String,
        required: true
    },
    specialty:{
        type: String,
        required: true
    },
    course:{
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    subscribe: {
        type: Array,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    work_experience:{
        jobTitle:{type: String, default: 'no job'},
        company:{type: String, default: 'no company'},
        workingTime:{start:{type:Date},end:{type:Date}},
        description:{type: String, default: 'no description'}
    },
    personal_info: {
        type:String
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

schema.statics.authorize = function(username, password, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({username: username}, callback);
        },
        function(user, callback) {
            if (user) {
                if (user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    callback(new AuthError("Wrong Password"));
                }
            } else {
                callback(new AuthError("Wrong Username"));
            }
        }
    ], callback);
};

schema.statics.password = function(username, password, callback) {
    var User = this;

    //console.log(username, password)

    async.waterfall([
        function(callback) {
            User.findOne({username: username}, callback);
        },
        function(user, callback) {
            if (user) {
                //console.log(user);
                user.hashedPassword = user.encryptPassword(password);
                //console.log(user);

                user.save(function(err) {
                    if (err) return callback(err);
                    callback(null, user);
                });
            } else {
                callback(new AuthError("Wrong Username"));
            }
        }
    ], callback);
};

schema.statics.edit =  function(req, callback) {
    var username = req.body.lastname;

    var newusername = req.body.username;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var secondname = req.body.secondname;
    var mail = req.body.mail;
    var dob = req.body.dob;
    var city = req.body.city;
    var university = req.body.university;
    var direction = req.body.direction;
    var specialty = req.body.specialty ;
    var course = req.body.course;
    var img = req.body.img;
    var skills = req.body.skills;

    var User = this;

    async.waterfall([
        function(callback) {
            User.check(newusername, function(err, bool, user){//проверяем едм новое имя у компании или у юзера
                if (bool) {
                    if(user.username == username)
                        User.findOne({username: username}, callback);
                    else
                        callback(new AuthError("Name is already by User"));
                } else {
                    Company.check(newusername, function(err, bool){
                        if (bool) {
                            callback(new AuthError("Name is already by Company"));
                        } else {
                            User.findOne({username: username}, callback);
                        }
                    });
                }
            });
        },
        function(user, callback) {
            if (user) {
                //console.log(user);

                user.username = newusername;
                user.firstname = firstname;
                user.secondname = secondname;
                user.mail = mail;
                user.dob = dob;
                user.university = university;
                user.direction = direction;
                user.specialty = specialty;
                user.course =  course;
                user.city = city;
                user.img = img;
                user.skills = skills;

                user.save(function(err) {
                    if (err) return callback(err);
                    callback(null, user);
                });
            } else {
                callback(new AuthError("Wrong Data"));
            }
        }
    ], callback);
};

schema.statics.registration = function(req, callback) {
    var username = req.body.username;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var secondname = req.body.secondname;
    var mail = req.body.mail;
    var dob = req.body.dob;
    var city = req.body.city;
    var university = req.body.university;
    var direction = req.body.direction;
    var specialty = req.body.specialty ;
    var course = req.body.course;
    var img = req.body.img;
    var skills = req.body.skills;

    var jobTitle = req.body.position;
    var company = req.body.company;
    var workingTime = {
        start: new Date(req.body.start),
        end: new Date()
    };
    var description = req.body.description;

    var User = this;

    async.waterfall([
        function(callback) {
            Company.check(username, function(err, bool){
                if (bool) {
                    callback(new AuthError("Name is already by Company"));
                } else {
                    User.findOne({username: username}, callback);
                }
            });
        },
        function(user, callback) {
            if (user) {
                callback(new AuthError("Name is already used"));
            } else {
                //console.log("data");

                var user = new User({
                    username: username,
                    password: password,
                    firstname: firstname,
                    secondname: secondname,
                    mail: mail,
                    dob: dob,
                    university: university,
                    direction: direction,
                    specialty: specialty,
                    course: course,
                    city: city,
                    img: img,
                    skills: skills,
                    subscribe: [null]
                });

                if(jobTitle) user.work_experience.jobTitle = jobTitle;
                if(company) user.work_experience.company = company;
                if(req.body.start) user.work_experience.workingTime = workingTime;
                if(description) user.work_experience.description = description;

                user.save(function(err) {
                    if (err) return callback(err);
                    callback(null, user);
                });
            }
        }
    ], callback);
};

//подписка
schema.statics.subscribe = function(companyId, username, callback){
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({username: username}, callback)
        },
        function(user, callback) {
            user.subscribe.push(companyId)

            user.save(function(err) {
                if (err) return callback(err);
                callback(null, user);
            });
        }
    ], callback);
};

//проверяем если есть юзер
//возвращаем да если есть
//нет если нет
schema.statics.check = function(name, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({username: name}, callback);
        },
        function(user, callback) {
            if (user) {
                callback(null,true,user);
            } else {
                callback(null,false,null);
            }
        }
    ], callback);
};

exports.User = mongoose.model('User', schema);


function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;