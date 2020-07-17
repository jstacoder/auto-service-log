// import { makeExecutableSchema } from 'graphql-tools'
// import { fs } from 'fs'
// import * as axios from 'axios'
// import _ from 'lodash'
const { makeExecutableSchema } =  require('graphql-tools')
const fs = require('fs')
const axios = require('axios')
const _ = require('lodash')
const Vehicle = require('../models/Vehicle')
const Service = require('../models/Service')
const Job = require('../models/Job')
const OdometerReading = require('../models/OdometerReading')
const async = require('async')

const getMakes = module.exports.getMakes = async (obj, args, context, info) => {
  const url =  `https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json`

  const result = await axios.get(url)
  return result.data.Count > 0 && _.sortedUniqBy(
      _.sortBy(
          _.filter(
              result.data.Results.map(
                  make=>
                      ({name: make.Mfr_CommonName})
              ),
                  o=> o.name !== null
          ), 'name'
      ), 'name'
  )
}

const getMake = async name => {
  const makes = await getMakes()
  return _.find(makes, { Mfr_CommonName: name })
}

const getVehicles = () => {
  return new Promise((resolve, reject)=>{
    Vehicle.find({}, (err, results)=>{
      if(err){
        reject(err)
      }
      resolve(
          results && results.map(
              result=>(
                  {
                    currentOdometerReading: result.currentOdometerReading,
                    make: result.make,
                    model:
                        {name: result.model.name, year: result.model.year},

                    _id: result._id
                  })
          )
      )
    })
  })
}

const getVehicle = (obj, {_id})=>{
  return new Promise((resolve, reject)=>{
    Vehicle.findOne({_id}, (err, result)=>{
        if (err) {
          reject(err)
        }
        resolve({
          ...result,
          make: {
            name: result.make,
          },
          model: result.model,
          currentOdometerReading: result.currentOdometerReading,
          _id: result._id,
        })
      })
  })
}

const getModels = module.exports.getModels = async (obj, { input: { make, year} }, context, info) => {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${make.name}/modelyear/${year}?format=json`

  const result = await axios.get(url)

  return result.data.Count > 0 && _.sortedUniqBy(
      _.sortBy(
          _.takeWhile(
              result.data.Results,
              ['Make_Name', make.name]
          ).map(model=>
              ({name : model.Model_Name, year})
          ), 'name'
      ),'name'
  )
}

const getServices = () => {
  return new Promise(
      (resolve, reject) => {
        Service.find((err, results) => {
          if (err) {
            reject(err)
          }
          resolve(results && results.map(result=>{
            console.log(result)
            return {
              ...result,
              id: result._id,
              serviceName: result.name,
              difficulty: result.difficulty,
              suggestedServiceInterval: result.suggestedServiceInterval,
              estimatedTimeToComplete: result.estimatedTimeToComplete,
              notes: result.notes,
            }
          }))
        })
      }
  )
}

const getService = (_id) =>{}

const getJobs = (obj, {vehicle: vehicleId}) => {
  return new Promise((resolve, reject)=>{
    Job.find({vehicle: { _id: vehicleId }}, (err, jobs)=>{
      if(err){
        reject(err)
      }
      Job.populate(jobs, 'services', ()=>{
        // console.log(jobs[0].services)
        // const services = jobs[0].services
        // jobs = jobs.map(job => ({
        //   ...job._doc,
        //   services: services.map(service=>(service.name)),
        // }))
      console.log(jobs)
        resolve(jobs)
     })
    })
  })
}
const getJob = (obj, args) => {
  return new Promise((resolve, reject)=>{
    Job.findById(args.id, (err, job)=>{
      resolve(job)
    })
  })
}
const getOdometerHistory = (obj, args) => {
  return new Promise((resolve, reject)=>{
    Vehicle.findById(args.vehicle, (err, vehicle)=>{
      OdometerReading.aggregate()
      .match({ vehicle: { _id: vehicle._id } })
      .sort('-dateCompleted')
      .project(
          {
              miles: "$$ROOT.miles",
              dateCompleted:
                { $dateToString:
                      {
                        date: '$dateCompleted',
                        format: '%m-%d-%Y'
                      }
                }
          }
      ).limit(10)
      .exec((err, readings)=> { if (err) { reject(err) } resolve({ vehicle, readings, }) })
      //OdometerReading.find({vehicle: {_id: vehicle._id}}).sort('-dateCompleted')
    })
  })
}

const deleteVehicle = (obj, {vehicleId}, context, info) =>{
  const vehicle = Vehicle.find({_id: vehicleId})
  return vehicle.remove()
}

const createVehicle = (obj, {input: {make, model, miles}}, context, info) => {
  const vehicle = new Vehicle({make: make, model: model, currentOdometerReading: miles})
  return vehicle.save().then(vehicle => ({ ok: true, vehicle: { make, model, currentOdometerReading: miles} }))
}
const createService = (obj, {input}, context, info)=> {
  const service = new Service({
    ...input,
  })
  return new Promise((resolve, reject) => {
    service.save((err, result) => {
      if (err) {
        reject(err)
      }
      resolve({ ok: true, service })
    })
  })
}
const createJob = (obj, {input}, context, info)=>{
  return new Promise((resolve, reject)=> {
    Job.createJob({
      ...input,
      dateCompleted: Date.now()
    }, (err, job) => {
      console.log(job)
      resolve({ ok: true, job})
      })
  })

}

const createOdometerReading = (obj, {input}, context, info) =>{
  const reading = new OdometerReading({...input})
  return new Promise((resolve, reject)=>{
    reading.save((err, result)=>{
      if(err){
        reject({errors: [err], ok: false})
      }
      Vehicle.updateOne({_id: result.vehicle._id}, { $set: {currentOdometerReading: result.miles}}, (err, vehicle)=>{
          resolve({ ok: true, reading : result})
      })
    })
  })
}


const resolvers = {
  Query: {
    getMake,
    getMakes,
    getModels,
    getVehicles,
    getVehicle,
    getServices,
    getJobs,
    getJob,
    getOdometerHistory,
  },
  Mutation: {
    createVehicle,
    createService,
    createJob,
    createOdometerReading,
    deleteVehicle,
  },
  Make: {
    models(obj, args, context, info) {
      return getModels(obj, args, context, info)
    }
  },



  // Vehicle: {
  //   model(obj, args){
  //     console.log(obj)
  //     return new Promise((resolve, reject)=>{
  //       Vehicle.findOne(obj, (err, vehicle)=>{
  //         Vehicle.populate(vehicle, 'model', (err)=>{
  //           resolve(vehicle.model)
  //         })
  //       })
  //     })
  //   },
  //   make(obj, args, context, info){
  //     return new Promise((resolve, reject)=>{
  //       Vehicle.findOne(obj, (err, vehicle)=>{
  //         if(err){
  //           reject(err)
  //         }
  //         Vehicle.populate(vehicle, 'make', (err)=>{
  //           resolve(vehicle.make)
  //         })
  //       })
  //     })
  //   }
  // }
}

const typeDefs = fs.readFileSync('./schema.graphql').toString()

module.exports.schema = makeExecutableSchema({typeDefs, resolvers})

