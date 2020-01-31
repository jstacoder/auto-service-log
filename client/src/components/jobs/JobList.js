import React from 'react'
import { Card, CardTitle, CardBody,  CardFooter } from 'reactstrap'
import CardText from 'reactstrap/lib/CardText'
import { useVehicleContext } from '../../contexts/VehicleContext'

const JobCard = ({job})=> {
  return (
      <Card>
        <CardTitle>{job.dateCompleted}</CardTitle>
        <CardBody>
          <CardText>{job.cost}</CardText>
          {job.services.map(service=> <CardText key={service.id}>{service.serviceName}</CardText> )}
           <CardText>Done By: {job.performedBy}</CardText>
          <CardText>Time Taken:{' '}
            {!!job.timeTaken.days ? `${job.timeTaken.days} day${job.timeTaken.days === 1 ? '' : 's'} ` : ''}
            {!!job.timeTaken.hours ? `${job.timeTaken.hours} hour${job.timeTaken.hours === 1 ? '' : 's'} ` : '' }
            {!!job.timeTaken.minutes ? `${job.timeTaken.minutes} minute${job.timeTaken.minutes === 1 ? '' : 's'}`: ''}
          </CardText>
        </CardBody>
      </Card>
  )
}

export const JobsList = () =>{
  const { activeVehicleJobs } = useVehicleContext()

  return (
      <div style={{border: '1px solid black'}}>
        {activeVehicleJobs.map(job=><JobCard key={JSON.stringify(job)} job={job}/>)}
      </div>
  )
}