var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./connection-string'));
}

autoIncrement.initialize(mongoose.connection);

//user model schema
var newSchema = new Schema({
  'name': { type: String },
  'phone': { type: String },
  'verified':{type:Boolean,default:false},
  'answer': {type:String},
  'profileImage': { type: String },
  'deviceId': { type: String },
  'deviceType': { type: String },
  'lobbyId':{type:Number},
  'isAdmin':{type:Boolean, default:false},
  'countryCode':{ type: String },
  'winnings':{ type:Number, default:0 },
  'betPlaced':{ type:Number, default:0 },
  'betsPlayed':{ type:Number, default:0 },
  'createdAt': { type: Date, default: Date.now },
  'updatedAt': { type: Date, default: Date.now }
});

newSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

newSchema.pre('update', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

newSchema.pre('findOneAndUpdate', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

newSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'userId',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('User', newSchema);
