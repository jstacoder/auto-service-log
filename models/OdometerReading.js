const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OdometerReadingSchema = new Schema({
  dateCompleted: {
     type: Date,
     default: Date.now(),
  },
  vehicle: mongoose.ObjectId,
  miles: String,
})

const OdometerReading =  mongoose.model('OdometerReading', OdometerReadingSchema )

exports = module.exports = {
  OdometerReading,
  OdometerReadingSchema,
}
