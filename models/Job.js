const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ServiceSchema } = require('./Service')
const { VehicleSchema } = require('./Vehicle')

const JobSchema = new Schema({
  servicesPerformed: [
       String
  ],
  dateCompleted: {
     type: Date,
     default: Date.now(),
  },
  performedBy: String,
  timeTaken: {
    minutes: Number,
    hours: Number,
    days: Number,
  },
  cost: String,
  vehicle: VehicleSchema,
})

JobSchema.virtual('services', {
  ref: 'Service',
  localField: 'servicesPerformed',
  foreignField: 'name',
})

exports = module.exports = mongoose.model('Job', JobSchema )
