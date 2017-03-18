console.log("this is story model")

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var StorySchema = new Schema({
	creator: {type: Schema.Types.ObjectId, ref: "User"},   //referencing the user Schema
	content: String,
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Story', StorySchema);