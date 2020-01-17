const mongoose = require("mongoose")
const Schema = mongoose.Schema

const VehicleSchema = new Schema({
  make: {
    name: String,
  },
  model: {
    name: String,
    year: String
  },
  year: Number,
  currentOdometerReading: Number,
})

exports = module.exports = mongoose.model('Vehicle', VehicleSchema )
exports.VehicleSchema = VehicleSchema