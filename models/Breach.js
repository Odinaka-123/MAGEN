// models/Breach.js
const mongoose = require('mongoose');

const breachSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, required: true },
  date_detected: { type: Date, required: true },
  description: { type: String }
});

const Breach = mongoose.model('Breach', breachSchema);

const createBreach = async (userId, source, dateDetected, description) => {
  const breach = new Breach({ userId, source, date_detected: dateDetected, description });
  await breach.save();
  return breach._id;
};

const getBreachesByUser = async (userId) => {
  return await Breach.find({ userId });
};

module.exports = Breach;
module.exports.createBreach = createBreach;
module.exports.getBreachesByUser = getBreachesByUser;