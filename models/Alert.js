// models/Alert.js
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  breachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Breach' },
  message: { type: String, required: true },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

const Alert = mongoose.model('Alert', alertSchema);

const createAlert = async (userId, breachId, message) => {
  const alert = new Alert({ userId, breachId, message });
  await alert.save();
  return alert._id;
};

const getAlertsByUser = async (userId) => {
  return await Alert.find({ userId });
};

module.exports = Alert;
module.exports.createAlert = createAlert;
module.exports.getAlertsByUser = getAlertsByUser;