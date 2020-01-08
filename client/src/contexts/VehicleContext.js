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
          }
          year
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
  `
}

export const VehicleContext = createContext({
  vehicles: [],
  addVehicle: vehicle => {},
  removeVehicle: vehicle => {},
})

export const VehicleContextProvider = ({children}) => {
  const [vehicleList, setVehicles] = useState( [])

  useEffect(()=>{
    const loadVehicles = async ()=> {
      const { vehicles } = await makeRequest(queries.getVehicles)
      console.log(vehicles)
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

  const value = {
    vehicles: vehicleList,
    addVehicle,
    removeVehicle,
  }

  return (
      <VehicleContext.Provider value={value}>
        {children}
      </VehicleContext.Provider>
  )
}

export const useVehicleContext = () => useContext(VehicleContext)