var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config')
var mongoose = require('mongoose');
var app = express();

mongoose.connect(config.database, function(err){
	if(err){
		console.log(err);
	}else{
		console.log("connected to database");
	}
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));


//midllewear for rendering public files // should be befor requireing the api route
app.use(express.static(__dirname + '/public'))


var api = require('./app/routes/api')(app,express);
app.use('/api', api); //setting route for the apis

app.get('*', function(req, res){     //* means anyhting other than the mentioned url which is here for now is api
	res.sendFile(__dirname + '/public/app/views/index.html');
});

app.listen(config.port, function(err){
	if(err){
		console.log(err);
	}else{
		console.log("listening on port: " + 3000);
	}
});