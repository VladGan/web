var checkAuth = require('../middleware/checkAuth');

module.exports = function(app) {
    app.get('/', require('./frontpage').get);

    app.get('/sign-in', require('./sign-in').get);
    app.post('/sign-in', require('./sign-in').post);

    app.get('/register-company', require('./register-company').get);
    app.post('/register-company', require('./register-company').post);

    app.get('/sign-up', require('./sign-up').get);
    app.post('/sign-up', require('./sign-up').post);

    app.get('/post',  checkAuth.company,require('./post').get);
    app.post('/post',  checkAuth,require('./post').post);

    app.get('/feed',  checkAuth,require('./feed').get);
    //app.post('/feed',  checkAuth,require('./feed').post);

    app.post('/logout', require('./logout').post);

    app.get('/cabinet',  checkAuth.user,require('./cabinet').get);
    app.post('/cabinet',  checkAuth,require('./cabinet').post);
    app.post('/cabinet-password',  checkAuth,require('./cabinet').password);

    app.get('/cabinet-company',  checkAuth.company,require('./cabinet-company').get);
    app.post('/cabinet-company',  checkAuth,require('./cabinet-company').post);
    app.post('/cabinet-company-password',  checkAuth.company,require('./cabinet-company').password);

    app.get('/search-user',  checkAuth,require('./search').user);
    app.get('/search-post',  checkAuth,require('./search').post);

    app.get('/post-edit', checkAuth.company,require('./post-edit').get);
    app.post('/post-edit', checkAuth,require('./post-edit').post);

    app.post('/post-respond', checkAuth,require('./post-respond').post);
    app.get('/post-respond', checkAuth.company,require('./post-respond').get);

    app.post('/delete-post', checkAuth,require('./delete-post').post);

    app.get('/user-page', checkAuth,require('./page').user);
    app.get('/company-page', checkAuth,require('./page').company);

    app.get('/search-page', checkAuth,require('./search').render);

    app.get('/user-page',  checkAuth,require('./page').user);
    app.get('/company-page',  checkAuth,require('./page').company);
    app.get('/post-details',  checkAuth,require('./page').post);


    app.get('/subscribe', checkAuth.user, require('./subscribe').get);
    app.post('/subscribe', checkAuth.user, require('./subscribe').post);

    app.get('/create-resume', checkAuth, require('./create-resume').get);
    app.post('/create-resume', checkAuth, require('./create-resume').post);


    app.get('/respond-page', checkAuth.company, require('./respond-page').get);
};