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
      }
    }
  `
}

export const VehicleContext = createContext({
  vehicles: [],
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
  const [activeVehicle, setActiveVehicle] = useState({make: '', model: {year: 0, name: ''}})
  const [odometerReadings, setOdometerReadings] = useState([])

  const getActiveVehicle = () => activeVehicle

  const getOdometerReadings = async vehicle => {
    const { getOdometerHistory:  { readings } } = await makeRequest(queries.getOdometerReadings, {vehicle})
    return readings || []
  }
  const addOdometerReading = async ({_id}, miles) => {
    const { createOdometerReading: { ok, errors }} = await makeRequest(
        queries.createOdometerReading,
        {
          reading:{
            miles,
            vehicle: {_id},
          }
        })
    if(errors){

    }
  }

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
    const loadVehicles = async ()=> {
      const { vehicles } = await makeRequest(queries.getVehicles)
      setVehicles(vehicles)
    }
    loadVehicles()
  }, [])


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
  }

  return (
      <VehicleContext.Provider value={value}>
        {children}
      </VehicleContext.Provider>
  )
}

export const useVehicleContext = () => useContext(VehicleContext)