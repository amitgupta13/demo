var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./connection-string'));
}

autoIncrement.initialize(mongoose.connection);

var newSchema = new Schema({
  
  'userId': { type: Number, ref:'User',required:true },
  'lid': { type: Number, ref:'Lobby', required:true},
  'betId':{ type:Number, ref:'Bet', required:true},
  'profileImage':{ type:String },
  'name':{ type:String },
  'lobbyId': { type: Number },
  'answer': { type: String },
  'winnings':{ type:Number },
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
  model: 'Winners',
  field: 'winnerId',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('Winners', newSchema);
