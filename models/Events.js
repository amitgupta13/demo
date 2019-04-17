var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./connection-string'));
}

autoIncrement.initialize(mongoose.connection);

var newSchema = new Schema({
  
  'eventImage': { type: String },
  'description': { type: String, required:true },
  'startDate': { type: Date, default:Date.now() },
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
  model: 'Events',
  field: 'eventId',
  startAt: 1,
  incrementBy: 1
});

module.exports = mongoose.model('Events', newSchema);
