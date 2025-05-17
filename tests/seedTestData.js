const Breach = require('../models/Breach');
const Alert = require('../models/Alert');

module.exports = async () => {
  await Breach.deleteMany({});
  await Alert.deleteMany({});
};
