const mongoose = require("mongoose")
const Schema = mongoose.Schema

const VehicleSchema = new Schema({
  make: {
    type: String,
    lowercase: true
  },
  model: {
    name: String,
    year: String
  },
  year: {
    type: Number,
  },
  currentOdometerReading: Number,
})

exports = module.exports = mongoose.model('Vehicle', VehicleSchema )
exports.VehicleSchema = VehicleSchema