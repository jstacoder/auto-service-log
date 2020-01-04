import React, { createContext, useContext, useState, useEffect } from 'react'

import { makeRequest } from '../helpers/graphql'

const queries = {
  getServices: `
    {
      services: getServices{
        name
        difficulty
        estimatedTimeToComplete
        suggestedServiceInterval
        notes 
      }
    }
  `,
  createService: `
    mutation addService($service: ServiceInput!){
      createService(input: $service){
        ok
        service{
          name
          difficulty
          estimatedTimeToComplete
          suggestedServiceInterval
          name
         }
      } 
    }
  `
}

export const ServiceContext = createContext({
  services: [],
  addService: service => {},
  removeService: service => {},
})

export const ServiceContextProvider = ({children}) => {
  const [serviceList, setServices] = useState( [])

  useEffect(()=>{
    const loadServices = async ()=> {
      const { services } = await makeRequest(queries.getServices)
      console.log(services)
      setServices(services)
    }
    loadServices()
  }, [])


  const addService = async service => {
    await makeRequest(queries.createService, {service})
    setServices(services => [...services, {...service}])
  }
  const removeService = service => {
    setServices(services=> services.filter(currentService=> currentService.name !== service.name))
  }

  const value = {
    services: serviceList,
    addService,
    removeService,
  }

  return (
      <ServiceContext.Provider value={value}>
        {children}
      </ServiceContext.Provider>
  )
}

export const useServiceContext = () => useContext(ServiceContext)