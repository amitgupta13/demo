var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./connection-string'));
}

autoIncrement.initialize(mongoose.connection);



//bet model schema
var newSchema = new Schema({
 
  'userId':{ type:Number, ref:'User', required:true },
  'creator':{ type:String },
  'betDetails': { type: String },
  'answers': { type: Array },
  'result':{type:String},
  'endDate': { type: Date },
  'stake': { type: Number },
  'currencyIcon':{type:String},
  'adminBet':{type:Boolean, default:false},
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
   model: 'Bet',
   field: 'betId',
   startAt: 1,
   incrementBy: 1
});


module.exports = mongoose.model('Bet', newSchema);