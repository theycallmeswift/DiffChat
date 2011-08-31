(function() {
  var Comment, CommentSchema, Schema, mongoose;
  mongoose = require('mongoose');
  Schema = mongoose.Schema;
  CommentSchema = new Schema({
    pull_id: {
      type: String
    },
    line: {
      type: Number,
      "default": 0
    },
    message: {
      type: String,
      required: true,
      index: true
    },
    login: {
      type: String
    },
    time: {
      type: Date,
      "default": Date.now()
    }
  });
  mongoose.model('Comment', CommentSchema);
  Comment = module.exports = mongoose.model('Comment');
}).call(this);
