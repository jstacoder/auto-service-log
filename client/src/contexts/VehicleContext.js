import React, { createContext, useContext, useState, useEffect } from 'react'

import { makeRequest } from '../helpers/graphql'

// language=GraphQL
const queries = {
  getVehicles: `
   query vehicles {
        vehicles: getVehicles{
          make{
            name
          }
          model {
            name
            year
          }
          currentOdometerReading
          _id
        }
      }
  `,
  // language=GraphQL
  createVehicle: `
    mutation newVehicle($vehicle: CreateVehicleInput!){
      createVehicle(input:$vehicle){
        ok
        vehicle{
          make{
            name
          }
          model {
             name
          }
        }
      }
    }
  `,
  // language=GraphQL
  getOdometerReadings: `
    query odometerReadings($vehicle: ID!){
      getOdometerHistory(vehicle: $vehicle) {
        readings {
          miles
          dateCompleted
        }
      }
    }
  `,
  // language=GraphQL
  createOdometerReading: `
    mutation newOdometerReading($reading: OdometerReadingInput!){
      createOdometerReading(input: $reading){
        ok
        errors
        reading {
          dateCompleted
        } 
      }
    }
  `,
  // language=GraphQL
  getJobs: `
    query getJobs($vehicle: ID!){
      jobs: getJobs(vehicle: $vehicle){
        cost
        services{
          serviceName
          id
        }
        dateCompleted
        performedBy 
        timeTaken {
          minutes
          hours
          days
        }
      }
    }
    
  `
}

export const VehicleContext = createContext({
  vehicles: [],
  activeVehicle: null,
  activeVehicleJobs: [],
  updateVehicle: vehicle=>{},
  getActiveVehicle: ()=>{},
  setActiveVehicle: vehicle=>{},
  addVehicle: vehicle => {},
  removeVehicle: vehicle => {},
  addOdometerReading: (vehicle, miles) => {},
  odometerReadings: [],
})

export const VehicleContextProvider = ({children}) => {
  const [vehicleList, setVehicles] = useState( [])
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [activeVehicle, setActiveVehicle] = useState({make: '', model: {year: 0, name: ''}})
  const [odometerReadings, setOdometerReadings] = useState([])
  const [activeVehicleJobs, setActiveVehicleJobs] = useState([])



  const getActiveVehicle = () => activeVehicle

  const getOdometerReadings = async vehicle => {
    const { getOdometerHistory:  { readings } } = await makeRequest(queries.getOdometerReadings, {vehicle})
    return readings || []
  }
  const addOdometerReading = async ({_id}, miles) => {
    const today = new Date
    const monthStart = today.getMonth()+1
    const month = `${monthStart < 10 ? '0' : ''}${monthStart}`
    const dayStart = today.getDate()
    const day = `${dayStart < 10 ? '0' : ''}${dayStart}`
    const dateCompleted = `${month}-${day}-${today.getFullYear()}`
    const { createOdometerReading: { ok, errors, reading }} = await makeRequest(
        queries.createOdometerReading,
        {
          reading:{
            miles,
            vehicle: {_id},
            }
        })
    if(errors){

    }
    setOdometerReadings(odometerReadings=> [{miles, dateCompleted: reading.dateCompleted, vehicle: { _id}}, ...odometerReadings])
  }
  const loadVehicles = async ()=> {
    if(!loadingVehicles) {
      setLoadingVehicles(true)
      const { vehicles } = await makeRequest(queries.getVehicles)
      setVehicles(vehicles)
      setLoadingVehicles(false)
    }
  }
  useEffect(()=>{
    const loadJobs = async () => {
      if(activeVehicle._id){
        const { jobs } = await makeRequest(queries.getJobs, {vehicle: activeVehicle._id})
        console.log('got ', jobs)
        setActiveVehicleJobs(jobs)
      }
    }
    loadJobs()
  }, [activeVehicle])
  useEffect(()=>{
    const loadReadings = async () => {
      if(activeVehicle._id){

        const readings = await getOdometerReadings(activeVehicle._id)
        setOdometerReadings(readings)
      }
    }
    loadReadings()
  }, [activeVehicle])

  useEffect(()=>{
    loadVehicles()
  }, [])
  useEffect(()=>{
    loadVehicles()
  }, [odometerReadings])



  const addVehicle = async vehicle => {
    await makeRequest(queries.createVehicle, {vehicle})
    setVehicles(vehicles => [...vehicles, {...vehicle}])
  }
  const removeVehicle = vehicle => {
    setVehicles(vehicles=> vehicles.filter(current=> current._id !== vehicle._id))
  }
  const updateVehicle = editedVehicle =>{
    setVehicles(vehicles=> vehicles.map(vehicle=> vehicle._id === editedVehicle._id ? editedVehicle : vehicle))
  }


  const value = {
    vehicles: vehicleList,
    updateVehicle,
    getActiveVehicle,
    setActiveVehicle,
    addVehicle,
    removeVehicle,
    odometerReadings,
    activeVehicle,
    addOdometerReading,
    activeVehicleJobs,
  }

  return (
      <VehicleContext.Provider value={value}>
        {children}
      </VehicleContext.Provider>
  )
}

export const useVehicleContext = () => useContext(VehicleContext)