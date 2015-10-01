var HttpError = require('../error').HttpError;

module.exports = function(req, res, next) {
    if (!req.session.user && !req.session.company) {
        return res.render('home', { title: 'Express' })

        //return next(new HttpError(401, "Вы не авторизованы"));
    }

    next();
};

module.exports.user = function(req, res, next) {
    if (!req.session.user) {
        return res.render('home', { title: 'Express' })

        //return next(new HttpError(401, "Вы не авторизованы"));
    }

    next();
};

module.exports.company = function(req, res, next) {
    if (!req.session.company) {
        return res.render('home', { title: 'Express' })

        //return next(new HttpError(401, "Вы не авторизованы"));
    }

    next();
};

function render(req, res){
    res.render('home', { title: 'Express' })
}

module.exports.curuser = function(req, res, next) {
    if(req.user)
        if (req.user.id != req.query.id) {
            return render(req, res)
        }

    if(req.company)
        return render(req, res)

    next();
};