console.log("this is api");


var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');
var secretKey = config.secretkey;
var jwt = require('jsonwebtoken');

function createToken(user){

	var myTokenDecode = jwt.sign({
		id: user._id,
		name: user.name,
		username: user.username,
	}, secretKey, {
		expiresIn: 14400
	});

	return myTokenDecode;
}


module.exports = function(app, express){

	var api = express.Router();

	//**SIGN UP
    api.post('/signup', function(req,res){
    	console.log(req.body);
    	var user = new User({
    		name: req.body.name,
    		username: req.body.username,
    		password: req.body.password
    	});

    	var token = createToken(user);
    	
    	user.save(function(err){
    		if(err){
    			res.send(err);
    			return;
    		}
    		res.json({
    			success: true,
    			message: 'User hasbeen created!',
    			token: token
    		});
    	});
    });	

    
    //**GET ALL THE USERS
    api.get('/users', function(req,res){
        
    	User.find({}, function(err, users){  //users is th equery result
    		if(err){
    			res.send(err);
    			return;
    		}

    		res.json(users);
    	});
    });

    
    //**LOG IN
    api.post('/login', function(req,res){  //req and then res

    	 console.log(req.body);
 
    	User.findOne({username: req.body.username})
    	.select('name username password').exec(function(err, user){  //this select has something to do with showing the username
    		if(err){throw err};

    		if(!user){
    			res.send({message: "user does not exists"});
    		}else if(user){
    			var validPassword = user.comparePassword(req.body.password);    //using that custom function that we have created

    			if(!validPassword){
    				res.send({message: "Invalid Password"});
    			}else{
    				var token = createToken(user);
    				res.json({          
    					success: true,
    					message: "successful login!",
    					token: token
    				})
    			}
    		}
    	});      
    });

  	
//** everything above this middlewear is our DESTINATION A
  	api.use(function(req,res,next){
		console.log("We got a visitor in oure app!!");
		var token = req.body.token||req.param('token')||req.headers['x-access-token'];  // fetching the token from the body or the headers
  		
  		// check if token exists
  		if(token){
  			jwt.verify(token, secretKey, function(err, decoded){
  				if(err){
  					res.status(403).send({ success: false, message: "failed to authenticate user"});
  				}else{
  					req.decoded = decoded;
  					next();  //takes it to the next rout at line-111
  				}
  			});
  		}else{
  			res.status(403).send({success: false, message: "No Token provided"});
  		}
  	});

    
//** everything below ^this middlewear is our DESTINATION B, we want to go to destination b after authentication //provide a legitimate token
    // api.get('/', function(req,res){
    // 	res.json("<h1>hello world</h2>")
    // }); 

    api.route('/')  //we will be chaining the routes
    .post(function(req, res){
    	var story = new Story({
    		creator: req.decoded.id,       //current user who has logged in
    		content: req.body.content,
    	});

    	story.save(function(err){
    		if(err){
    			res.send(err);
    			return;
    		}
    		res.json({message: "New Story Created"});
    	});

    })
    .get(function(req, res){
    	Story.find({creator: req.decoded.id}, function(err, stories){
    		if(err){
    			res.send(err);
    			return;
    		}
    		res.json(stories);
    	})
    })

    
    api.get('/me', function(req, res){  //we need this api to call on the front end to get decoded user info
    	res.json(req.decoded);
    });
  
    return api;

};

 