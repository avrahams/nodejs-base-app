var homeRouter = require('express').Router();
var app = require('app.js');
var appEnv = require("cfenv").getAppEnv();
app.use('/', homeRouter);
module.exports = homeRouter;


homeRouter.get('/', function(req, res) {
	 res.render('index', { appName: appEnv.name });
});


