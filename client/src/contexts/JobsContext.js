import React, { useContext, createContext, useState, useMemo, useEffect } from 'react'
import { makeRequest } from '../helpers/graphql'
import { useVehicleContext } from './VehicleContext'

export const JobsContext = createContext({
  addJob:job=>{},
  getJobs:vehicle=>{},
})

export const JobsContextProvider = ({children})=>{
  const [jobs, setJobs] = useState([])
  const { getActiveVehicle } = useVehicleContext()

  const vehicle = useMemo()

  const getJobs = async () =>{
    const query = `
      query jobs($vehicle: ID!) {
        getJobs(vehicle: $vehicle) {
          cost
          dateCompleted
          performedBy
          servicesPerformed{
            name
          }
          timeTaken
          _id
        }
      }
    `
    const result = await makeRequest(query, {vehicle})
  }



  useEffect(()=>{
    getJobs().then(result=> {
      setJobs(result.getJobs)
      console.log(result)
    })
  }, [vehicle])


  const value = {
    jobs,
    addJob,
  }
}
  return (
      <JobsContext.Provider value={value}}>

      </JobsContext.Provider>
  )