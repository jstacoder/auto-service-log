import React from 'react'
import { useVehicleContext } from '../../contexts/VehicleContext'

export const JobsList = () =>{
  const { activeVehicleJobs } = useVehicleContext()

  return (
      <div style={{border: '1px solid black'}}>
        {activeVehicleJobs.map(job=><p>{job.cost}</p>)}
      </div>
  )
}