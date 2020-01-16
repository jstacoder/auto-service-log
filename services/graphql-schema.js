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
    Vehicle.find((err, results)=>{
      if(err){
        reject(err)
      }
      resolve(
          results.map(
              result=>(
                  {
                    currentOdometerReading: result.currentOdometerReading,
                    make:
                        {name: result.make},
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
        console.log(result)
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
          resolve(results.map(result=>{
            return {
              ...result,
              name: result.name,
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

const getJobs = () => {}

const getJob = (_id) => {}

const createVehicle = (obj, {input: {make, model, year}}, context, info) => {
  const vehicle = new Vehicle({make: make.name, model: model.name, year})
  return vehicle.save().then(vehicle => ({ ok: true, vehicle: { make, model, year} }))
}
const createService = (obj, {input}, context, info)=> {
  console.log('creating service: ', input)
  const service = new Service({
    ...input,
    // estimatedTimeToComplete: JSON.stringify(input.estimatedTimeToComplete),
    // suggestedServiceInterval: JSON.stringify(input.suggestedServiceInterval),
  })
  return new Promise((resolve, reject) => {
    service.save((err, result) => {
      console.log(err)
      if (err) {
        reject(err)
      }
      resolve({ ok: true, service })
    })
  })
}
const createJob = (obj, {input}, context, info)=>{
  const job = new Job({
    ...input,
    date: Date.now()
  })
  return new Promise((resolve, reject)=>{
    job.save((err, result)=>{
      if(err){
        reject(err)
      }
      resolve({ok: true, job: result})
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
      console.log(result)
      Vehicle.updateOne({_id: result.vehicle._id}, { $set: {currentOdometerReading: result.miles}}, (err, vehicle)=>{
          resolve({ ok: true })
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
  },
  Mutation: {
    createVehicle,
    createService,
    createJob,
    createOdometerReading,
  },
  Make: {
    models(obj, args, context, info) {
      return getModels(obj, args, context, info)
    }
  },
  Vehicle: {
    // odometerHistory(obj, args, context, info) {
    //   console.log(obj)
    //   const _id = obj._id
    //   return new Promise((resolve, reject) => {
    //     OdometerReading.find({ vehicle: { _id } }, (err, result) => {
    //       if (err) {
    //         reject({ errors: [err], ok: false })
    //       }
    //       console.log(result)
    //       resolve({ readings: result })
    //     })
    //   })
    // },
    // currentOdometerReading(obj, args, context, info) {
    //   const { _id } = obj
    //   return new Promise((resolve, reject) => {
    //     OdometerReading.find({vehicle: {_id}},{$sort: 'dateCompleted'}).limit(1, (err, result) => {
    //
    //       if (err) {
    //         reject({ errors: [err], ok: false })
    //       }
    //       console.log(result)
    //       resolve({ readings: result })
    //     })
    //   })
    // }
  }
}

const typeDefs = fs.readFileSync('./schema.graphql').toString()

module.exports.schema = makeExecutableSchema({typeDefs, resolvers})

