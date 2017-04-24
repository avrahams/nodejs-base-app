require('app-module-path').addPath(__dirname);
if(!process.env.HOME || !process.env.USERPROFILE ) {
	process.env.HOME = process.env.USERPROFILE = process.env.TEMP;
}

var express = require('express');
var http = require('http');
var logger = require('morgan')
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var helmet = require('helmet');
var appEnv = require("cfenv").getAppEnv();	
var Promise = require("bluebird");

Promise.config({
	// Enable warnings
	warnings: true,
	// Enable long stack traces
	longStackTraces: true,
	// Enable cancellation
	cancellation: true,
	// Enable monitoring
	monitoring: true
});


//There are many useful environment variables available in process.env.
//VCAP_APPLICATION contains useful information about a deployed application.
VCAP_APPLICATION = JSON.parse(process.env.VCAP_APPLICATION || '{}');
//VCAP_SERVICES contains all the credentials of services bound to
//this application. For details of its content, please refer to
//the document or sample of each service.
VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES || '{}');

var app = express();
//set the app object to export so it can be required 
module.exports = app;

//Get port from environment and store in Express.
var port = process.env.VCAP_APP_PORT || appEnv.port;
app.set('port', port);
//Create HTTP server.
app.server = http.createServer(app);
//trust bluemix proxy
app.enable('trust proxy');
//use ejs as views engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//TODO uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//request parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//logging http requests
app.use(logger('dev'));
//security
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.disable('x-powered-by');
//allow cross domain ajax requests
app.use(cors());



//load workbench library modules
require('lib');

//static serve 'public' folder
app.use(express.static(path.join(__dirname, 'public'), {extensions: ['html', 'htm']}));

//load http routes
require('routes');


//catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		console.error(err);
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res, next) {
	console.error(err);
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

/**
 * Listen on provided port, on all network interfaces.
 */
var onError,onListening;
app.server.on('error', onError);
app.server.on('listening', onListening);
app.server.listen(port);
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string' ?
			'Pipe ' + port
			: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
	case 'EACCES':
		console.error(bind + ' requires elevated privileges');
		process.exit(1);
		break;
	case 'EADDRINUSE':
		console.error(bind + ' is already in use');
		process.exit(1);
		break;
	default:
		throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	var addr = app.server.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	console.log('Server listening on ' + bind);
}


