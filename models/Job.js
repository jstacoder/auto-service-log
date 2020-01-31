const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ServiceSchema } = require('./Service')
const { VehicleSchema } = require('./Vehicle')
const PerformedService = require('./PerformedService')

const JobSchema = new Schema({

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
}, {toObject: {virtuals: true}})
JobSchema.virtual('services', {
  ref: 'PerformedService',
  localField: '_id',
  foreignField: 'jobId',
})

JobSchema.statics.createJob = function({performedBy, timeTaken, cost, vehicle, dateCompleted, services = []}, callback){
  const createServicePromise = (service, jobId) => new Promise((resolve, reject)=>{
    PerformedService.create({jobId, serviceName: service}, (err, ps)=>{
      if(err){
        reject(err)
      }
      resolve(ps)
    })
  })
  return new Promise( (resolve, reject)=> {
    this.create({
      performedBy,
      timeTaken,
      cost,
      vehicle,
      dateCompleted
    }, (err, job) => {
      const servicePromises = services.map(service => {
        return createServicePromise(service, job._id)
      })
      return Promise.all(servicePromises).then(res => {
        job.populate('services', (err, job)=>{
          console.log(job)
          resolve(job)
          callback(err, job)
        })
      })
    })
  })

}

exports = module.exports = mongoose.model('Job', JobSchema )
