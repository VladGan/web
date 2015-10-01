var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;

var mongoose = require('../lib/mongoose');
var users = mongoose.model('User');
var async = require('async');

exports.get = function(req, res) {
    var User = require('../models/user').User;
    var is = req.user ? (req.user._id == req.query.id) : false;
    var user = User.findOne({_id:req.query.id},function(err,result){
        res.render('create-resume',{res : is,curUser : result});
    });

}


exports.post = function(req, res, next) {

        var skills_str = '';
        for (var i = 0; i < req.body.skills.length; i++)
            skills_str += req.body.skills[i] + ', ';
        skills_str = skills_str.substring(0, skills_str.length - 2);

        users.update(
            { username : req.user.username },
            {
                "$set": {
                    firstname : req.body.firstname,
                    secondname : req.body.secondname,
                    mail : req.body.mail,
                    website : req.body.website,
                    mobile : req.body.mobile,
                    personal_info : req.body.personal_info,
                    work_experience : {
                        jobTitle : req.body.work_experience.jobTitle,
                        company : req.body.work_experience.company,
                        workingTime : {
                            start : req.body.work_experience.workingTime.start,
                            end : req.body.work_experience.workingTime.end
                        },
                        description : req.body.work_experience.description
                    },
                    skills : skills_str,
                    university : req.body.university,
                    specialty : req.body.specialty,
                    university_desc : req.body.university_desc
                }
            },
            function (err){
                console.log(err);
            }
        )
};



