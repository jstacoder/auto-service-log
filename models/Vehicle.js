const mongoose = require("mongoose")
const { OdometerReadingSchema } = require("./OdometerReading")

const Schema = mongoose.Schema

const VehicleSchema = new Schema({
  make: {
    name: String,
  },
  model: {
    name: String,
    year: Number,
  },
  currentOdometerReading: Number,
  odometerReadings: [
      OdometerReadingSchema
  ]
})

exports = module.exports = mongoose.model('Vehicle', VehicleSchema )
exports.VehicleSchema = VehicleSchema