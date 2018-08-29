var config = {};

config.port = 5000;

config.host = '0.0.0.0';

if(process.env.PORT ){
    config.appURL = 'https://csd-twitter.herokuapp.com/';
    config.callbackURL = config.appURL +'callbacks/addsub';
    console.log(config.callbackURL );
}else{
    config.appURL = 'http://127.0.0.1:'+config.port+ '/';
    config.callbackURL = config.appURL + 'callbacks/addsub';
    console.log(config.callbackURL );
}

config.mongoURL = "";

config.outlook = {

    'email': '',

    'password': '',

    'smtpServer': 'smtp.office365.com',

    'smtpPort': 587,

    'smtpTimeout': 100000,

    'transport': {ciphers: 'SSLv3'}
};

var module = module || {};
module.exports = config;