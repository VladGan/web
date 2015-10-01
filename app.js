var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var log = require('./lib/log')(module);
var bodyParser = require('body-parser');
var config = require('./config');

var http = require('http');
var HttpError = require('./error').HttpError;

//var app = express();
var app = module.exports.app = exports.app = express();
app.use(require('connect-livereload')());

app.set('port', config.get('port'));

var server = http.createServer(app);
server.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});
console.log('Express server listening on port ' + app.get('port'))

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

if(app.get('env') == 'development'){
    app.use(logger('dev'));
} else {
    app.use(logger('default'));
}

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cookieParser());

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./middleware/sendHttpError'));

app.use(cookieParser());

var store = require('./lib/sessionStore')

var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require("mongoose");

app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    store: store
}));


app.use(require('./middleware/loadUser'));
app.use(require('./middleware/loadCompany'));

var routes = require('./routes')(app);

// view engine setup
var exphbs  = require('express-handlebars');
var hbs = exphbs.create({//хелперы для хендлбара (добавляет или и не равно и т.д.)
    helpers: {
        ifCond: function (v1, operator, v2, options) {

            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        },
        list: function(items, cur, options) {
            var out = '';
            for (var i = items.length-1; i>=0; i--) {
                out += options.fn({a:items[i],b:cur});
            }
            return out;
            //{items[i],cur:cur};
        },
        date: function(date, options) {
            var resDate = new Date(date);
            return resDate.toLocaleDateString()
        },
        isUser: function(post,id, open, test, options) {
            var filter = post.users.filter(function(val, index){
                return val == id
            }, id)

            if(filter.length)
                return '<h4>You have already Respond.</h4>'
            else
                return '<div class="col-lg-4">'+test+open+'<button type="submit" class="btn btn-default" id="send-user">Respond to the open position</button></div>'
        },
        isSubscribe: function(company,user, options) {
            if(!user.subscribe) return false

            var filter = user.subscribe.filter(function(val, index){
                return val == company['_id']
            }, company['_id']);

            if(filter.length)
                return '<h6>You have already Subscribe.</h6>'
            else
                return '<button type="submit" class="btn btn-default" id="subscribe">Subscribe</button>'
        },
        openOut: function(open, index, options) {
            var label = '<label for="input-text" class="col-lg-2 control-label open-l">Open Question '+ (index + 1) +'<br><a style="cursor: pointer" class="delete">Delete</a></label>'
            var question = '<div class="col-lg-5"><input name="text" type="textarea" value="' + open.question + '" class="form-control" id="open-q" placeholder="Add Question"><br>'
            var answer = '<input name="text" type="textarea" value="' + open.answer + '" class="form-control" id="open-a" placeholder="Add Answer"></div>'
            var div = '<div class="form-group open-form" data-open-id="'+ open._id +'">'+label+question+answer+'</div>'

            return div;
        },
        testOut: function(test, index, options) {
            var label = '<label for="input-text" class="col-lg-2 control-label test-l">Test Question '+(index + 1)+'<br><a style="cursor: pointer" class="delete">Delete</a></label>'
            var question = '<div class="col-lg-4"><input name="text" type="textarea" value="'+ test.question +'" class="form-control" id="test-q" placeholder="Add Question"><br>'
            var answer = '<input name="text" type="textarea" value="'+ test.answer +'" class="form-control" id="test-a" placeholder="Add Answer"><br>'
            var add = '<div class="test-add '+ index +'"><a style="cursor: pointer">Add answer</a></div></div>';

            var typeDiv = ''
            for(var i = 0; i < test.variant.length; i++)
                typeDiv = typeDiv + '<input name="text" type="textarea" value="'+ test.variant[i] +'" class="form-control test-v" placeholder="Add Variant"><br>'
            typeDiv = '<div class="col-lg-4 test-type">'+typeDiv+'</div>';

            var div = '<div class="form-group test-form" data-test-id="'+ test._id +'">'+label+question+answer+add+typeDiv+'</div>'

            return div;
        },
        skillsList: function(user) {//выводит список скилов юзера
            var out = '';
            var arr = user.skills.split(",");
            for (var i = 0; i<arr.length; i++) {
                out += "<li class = 'editable' >" + arr[i] + "</li>";
            }
            return out; 
        }
    }
});
hbs.defaultLayout = 'main';

app.engine('handlebars', hbs.engine );
app.set('view engine', 'handlebars');

var io = require('./socket')(server);
app.set('io', io);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
