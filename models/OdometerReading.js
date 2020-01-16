const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { VehicleSchema } = require('./Vehicle')

const OdometerReadingSchema = new Schema({
  dateCompleted: {
     type: Date,
     default: Date.now(),
  },
  vehicle: VehicleSchema,
  miles: String,
})

exports = module.exports = mongoose.model('OdometerReading', OdometerReadingSchema )
