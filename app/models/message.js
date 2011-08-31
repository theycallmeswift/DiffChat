(function() {
  var Message, MessageSchema, Schema, mongoose;
  mongoose = require('mongoose');
  Schema = mongoose.Schema;
  MessageSchema = new Schema({
    message: {
      type: String,
      required: true,
      index: true
    },
    user_id: {
      type: Schema.ObjectId
    },
    created_at: {
      type: Date,
      "default": Date.now
    },
    updated_at: {
      type: Date,
      "default": Date.now
    }
  });
  mongoose.model('Message', MessageSchema);
  Message = module.exports = mongoose.model('Message');
}).call(this);
