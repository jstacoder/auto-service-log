import React, { useState } from 'react'
import { Button, Input, Label, FormGroup, Row, Col } from 'reactstrap'
import { useServiceContext } from '../../contexts/ServiceContext'
import { makeRequest } from '../../helpers/graphql'

export const AddJob = ({toggle, activeVehicle}) =>{
  const { services } = useServiceContext()
  const [selectedServices, setSelectedServices] = useState([])
  const [performedBy, setPerformedBy] = useState('')
  const [timeTaken, setTimeTaken] = useState('')
  const [cost, setCost] = useState('')

  // language=GraphQL
  const query = `
    mutation newJob($job: JobInput!){
      createJob(input: $job) {
        ok
        job{
          dateCompleted     
        }
      }
    }
  `


  const saveJob = () => {
    const job = {
      servicesPerformed: selectedServices.map(({name})=> name),
      performedBy,
      timeTaken,
      cost,
      vehicle: activeVehicle._id,

    }

    console.log('saveing, ', job)


  }

  const change = service =>{
    if(selectedServices.indexOf(service) >= 0){
      setSelectedServices(services=> services.filter(s=> s.name!==service.name))
    }else {
      setSelectedServices(services => [...services, service])
    }
  }

  return (
       <form>
          <h1>Job Dashboard</h1>
          <h3>Add New Job for your {activeVehicle.model.year} {activeVehicle.make} {activeVehicle.model.name}</h3>
          <hr/>
          <legend><p>add job</p></legend>
         <Row>
           <Col size={{md: 6}}>
             <FormGroup>
               <Label>Done By</Label>
               <Input name={'performedBy'} value={performedBy} onChange={(e)=>setPerformedBy(e.target.value)}/>
             </FormGroup>
             <FormGroup>
               <Label>Time Taken</Label>
               <Input name={'timeTaken'} value={timeTaken} onChange={(e)=>setTimeTaken(e.target.value)}/>
             </FormGroup>
             <FormGroup>
               <Label>Cost</Label>
               <Input name={'cost'} value={cost} onChange={(e)=>setCost(e.target.value)}/>
             </FormGroup>
           </Col>
           <Col size={{md: 6}}>
              <label htmlFor='service'>Services performed</label>
             <hr/>
             {services.map(service=>
                 <FormGroup check key={service.name}>
                   <Label check>
                     <Input
                         type={'checkbox'}
                         checked={selectedServices.indexOf(service)>=0}
                         onChange={()=> change(service)}
                     />
                     {service.name}
                   </Label>
                 </FormGroup>
             )}
           </Col>
         </Row>
         <Row>
           <Col xs={2}>
             <Button onClick={saveJob} color='success'>save</Button>
           </Col>
           <Col xs={3}/>
           <Col xs={2}>
             <Button color={'danger'} onClick={toggle} type={'danger'}>cancel</Button>
           </Col>
         </Row>
       </form>
  )
}