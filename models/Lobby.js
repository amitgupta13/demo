var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./connection-string'));
}

autoIncrement.initialize(mongoose.connection);

var newSchema = new Schema({
  
  'userId':{ type:Number, ref:'User', required:true },
  'betId':{ type:Number, ref:'Bet', required:true},
  'profileImage':{ type:String },
  'participants':{ type:Number, default:0 },
  'currencyIcon':{type:String },
  'answers':{ type:Array },
  'result':{ type:String },
  'name':{ type:String, required:true },
  'betDetails':{ type:String, required:true },
  'endDate':{ type:Date, required:true },
  'stake':{ type:String, required:true },
  'lobbyId': { type: Number, required:true },
  // 'answer':{type:String, required:true},
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
  model: 'Lobby',
  field: 'lid',
  startAt: 1,
  incrementBy: 1
});



module.exports = mongoose.model('Lobby', newSchema);
