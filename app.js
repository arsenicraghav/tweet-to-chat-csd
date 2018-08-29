const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const socket = require('./helpers/socket')

var cookieParser = require('cookie-parser');

var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');

var email = require("emailjs");

var routes = require('./routes/index');
var config = require('./config');

var app = express();

var SMTPService = email.server.connect({
    user: config.outlook.email,
    password: config.outlook.password,
    host: config.outlook.smtpServer,
    port: config.outlook.smtpPort,
    timeout: config.outlook.smtpTimeout,
    tls: config.outlook.transport
});

passwordless.init(new MongoStore(config.mongoURL));
passwordless.addDelivery(
    function (tokenToSend, uidToSend, recipient, callback) {
        console.log('Use the link to access your account:' + config.appURL + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend)
        );
        SMTPService.send({
            text: 'Use the link to access your account:' + config.appURL + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend),
            from: config.outlook.email,
            to: recipient,
            subject: 'Access for ' + config.appURL
        }, function (err, message) {
            if (err) {
                console.log(err);
            }
            callback(err);
        });
    });

app.set('port', (process.env.PORT || config.port))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({secret: 'keyboard cat', saveUninitialized: false, resave: false}));
app.use(passport.initialize());

app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({successRedirect: '/'}));

app.use('/', routes);

const server = app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'))
})

socket.init(server)

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});