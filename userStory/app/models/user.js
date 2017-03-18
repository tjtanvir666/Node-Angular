//this is the model for user schema

console.log("this is user model");

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var UserSchema = new Schema({
	name: String, //donot have any condition
	username: {type: String, required: true, index: {unique:true}},  //have condition
	password: {type: String, required: true, select: false}  //select is when we will be doing query later on it will not do query on password

});

UserSchema.pre('save', function(next){  //hashing the password
	var user = this;  //refers to UserSchema object
	
	if(!user.isModified('password')) return next();  //validation to see if user password is modified, if not go to the next matching route()

    bcrypt.hash(user.password, null, null, function(err, hash){
    	if(err) return next(err);

    	user.password = hash;
    	next();
    }); 
});

// creating custom method for UserSchema object to compare a password by user and one in the database
UserSchema.methods.comparePassword = function(password){
	var user = this;
	return bcrypt.compareSync(password, user.password);
};


module.exports = mongoose.model('User', UserSchema);