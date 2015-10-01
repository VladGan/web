var User = require('../models/user').User;
var Company = require('../models/company').Company;

var Post = require('../models/post').Post;

var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;

var async = require('async');


exports.render = function(req, res) {
    res.render('search-page');
};

exports.post = function(req, res){
    var query = req.query.query.toUpperCase();
    var queryArray = query.split(" ")

    async.waterfall([
        function(callback){
            Post.find({},function(err, result){
                var posts = result.filter(function(post) {
                    post._doc.sortValue = 0;

                    for(var i = 0;i<queryArray.length;i++) {
                        if(!queryArray[i].trim().length) continue

                        var propertyArray = ["place","tags","title","companyName"]

                        for(var j = 0; j<propertyArray.length;j++){
                            if(!post[propertyArray[j]]) continue;

                            if(post[propertyArray[j]].toUpperCase().indexOf(queryArray[i])>=0){
                                post._doc.sortValue++;

                                break
                            }
                        }
                    }

                    return post._doc.sortValue > 0
                });

                callback(null,posts);
            });
        },
    ], function (err, result) {
        res.json(result.sort(function(a,b){
            return a._doc.sortValue < b._doc.sortValue
        }));
    });
}

exports.user = function(req, res) {
    var query = req.query.query.toUpperCase();
    var queryArray = query.split(" ")

   // console.log(query, queryArray);

    async.parallel({
        user: function(callback){
            User.find({},function(err, result){
                var users = result.filter(function(user) {
                    user._doc.sortValue = 0;

                    for(var i = 0;i<queryArray.length;i++) {
                        if(!queryArray[i].trim().length) continue

                        /*var cur = user.username.toUpperCase().indexOf(queryArray[i]) >= 0
                            || user.firstname.toUpperCase().indexOf(queryArray[i]) >= 0
                            || user.secondname.toUpperCase().indexOf(queryArray[i]) >= 0
                            || user.city.toUpperCase().indexOf(queryArray[i]) >= 0
                            || user.specialty.toUpperCase().indexOf(queryArray[i]) >= 0
                            || user.university.toUpperCase().indexOf(queryArray[i]) >= 0
                            || user.skills.toUpperCase().indexOf(queryArray[i]) >= 0*/

                        var propertyArray = ["username","firstname","secondname","city","specialty","university","skills"]

                        for(var j = 0; j<propertyArray.length;j++){
                            if(!user[propertyArray[j]]) continue;

                            if(user[propertyArray[j]].toUpperCase().indexOf(queryArray[i])>=0){
                                user._doc.sortValue++;

                                break
                            }
                        }

                        //if(cur) return true
                    }

                    return user._doc.sortValue > 0
                });

                //var users = recursionUser(result, queryArray, 0);

                callback(null,users);
            });
        },
        company: function(callback){
            Company.find({},function(err, result){
                var companies = result.filter(function(company) {
                    company._doc.sortValue = 0;

                    for(var i = 0;i<queryArray.length;i++) {
                        if(!queryArray[i].trim().length) continue

                        /*var cur = company.about.toUpperCase().indexOf(queryArray[i]) >= 0
                            || company.companyName.toUpperCase().indexOf(queryArray[i]) >= 0
                            || company.city.toUpperCase().indexOf(queryArray[i]) >= 0*/

                        //if(cur) return true

                        var propertyArray = ["companyName","city","about"]

                        for(var j = 0; j<propertyArray.length;j++){
                            if(!company[propertyArray[j]]) continue;

                            if(company[propertyArray[j]].toUpperCase().indexOf(queryArray[i])>=0){
                                company._doc.sortValue++;

                                break
                            }
                        }
                    }

                    return company._doc.sortValue > 0
                });

                callback(null,companies);
            });
        }
    }, function(err, results){

        var resultArray = results.user.concat(results.company);

        res.json(resultArray.sort(function(a,b){
            return a._doc.sortValue < b._doc.sortValue
        }));
    });

    /*function recursionUser(arrayOfUsers, queryArray, i){
     if(i!=queryArray.length) {
     var curArray = arrayOfUsers.filter(function (user) {
     return user.username.indexOf(queryArray[i]) >= 0
     || user.firstname.indexOf(queryArray[i]) >= 0
     || user.secondname.indexOf(queryArray[i]) >= 0
     || user.city.indexOf(queryArray[i]) >= 0
     || user.specialty.indexOf(queryArray[i]) >= 0
     || user.university.indexOf(queryArray[i]) >= 0
     });

     return recursionUser(curArray, queryArray, i++)
     }
     else{
     return arrayOfUsers
     }
     }*/

    /*var query = User.find({},function(err, result){
     var users = result.filter(function(user) {
     return user.username.indexOf(q) >= 0
     || user.firstname.indexOf(q) >= 0
     || user.secondname.indexOf(q) >= 0
     || user.city.indexOf(q) >= 0
     || user.specialty.indexOf(q) >= 0
     || user.university.indexOf(q) >= 0
     });

     res.json(users);
     });*/


    /*query.where('username').equals(name).exec( function(err, result){
        res.json(result);
    });*/

    /*query.$where(function () {
        return this.username.indexOf(name) >= 0
    }).exec( function(err, result){
        res.json(result);
    })*/

};
