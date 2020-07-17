const mongoose = require('mongoose')
const { Schema } = mongoose

const PerformedServiceSchema = new Schema({
  serviceName: String,
  jobId: Schema.Types.ObjectId,
}, {toObject: { virtuals: true}})

PerformedServiceSchema.virtual('service', {
  ref: 'Service',
  localField: 'serviceName',
  foreignField: 'name',
  justOne: true,
})

PerformedServiceSchema.virtual('job', {
  ref: 'Job',
  localField: 'jobId',
  foreignField: '_id',
  justOne: true,
})


exports = module.exports = mongoose.model('PerformedService', PerformedServiceSchema)