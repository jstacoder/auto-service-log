import React, { useState, useReducer } from 'react'
import { Button, Input, Label, FormGroup, Row, Col } from 'reactstrap'
import { useServiceContext } from '../../contexts/ServiceContext'
import { makeRequest } from '../../helpers/graphql'

const initialState = {
  minutes: undefined,
  hours: undefined,
  days: undefined,
}

const SET_MINUTES = 'set_minutes'
const SET_HOURS = 'set_hours'
const SET_DAYS = 'set_days'

const timeTakenReducer = (state, {type, value} = {}) => {
  switch(type){
    case SET_MINUTES:
      return {
        ...state,
        minutes: value,
      }
    case SET_HOURS:
      return {
        ...state,
        hours: value,
      }
    case SET_DAYS:
      return {
        ...state,
        days: value,
      }
    default:
      return state
  }
}

const setMinutesAction = value => ({
  type: SET_MINUTES,
  value,
})

const setHoursAction = value => ({
  type: SET_HOURS,
  value,
})

const setDaysAction = value =>({
  type: SET_DAYS,
  value,
})

const useTimeTaken = () => {
  const [timeTaken, dispatch] = useReducer(timeTakenReducer, initialState)

  const setHours = value => dispatch(setHoursAction(value))
  const setMinutes = value => dispatch(setMinutesAction(value))
  const setDays = value => dispatch(setDaysAction(value))

  return {
    timeTaken,
    setMinutes,
    setDays,
    setHours,
  }
}

export const AddJob = ({toggle, activeVehicle}) =>{
  const { services } = useServiceContext()
  const [selectedServices, setSelectedServices] = useState([])
  const [performedBy, setPerformedBy] = useState('')

  const setDiy = () => setPerformedBy('diy')
  const [diy, setdiy] = useState(false)
  const {
    timeTaken,
    setMinutes,
    setHours,
    setDays,
  } = useTimeTaken()
  // const [timeTaken, setTimeTaken] = useState('')
  const [cost, setCost] = useState('')

  const resetForm = ()=>{
    setSelectedServices([])
    setPerformedBy('')
    setdiy(false)
    setMinutes(undefined)
    setHours(undefined)
    setDays(undefined)
  }
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


  const saveJob = async () => {

    console.log(selectedServices)
    const job = {
      services: selectedServices.map(({name})=> name),
      performedBy,
      timeTaken,
      cost,
      vehicle: {
        _id: activeVehicle._id
      },
    }

    console.log('saveing, ', job)

    const result = await makeRequest(query, {job})
    console.log('saved', result)

    if(result.createJob.ok){
      resetForm()
      toggle()
    }

  }

  const change = service =>{
    if(selectedServices.indexOf(service) >= 0){
      setSelectedServices(services=> services.filter(s=> s.name!==service.name))
    }else {
      setSelectedServices(services => [...services, service])
    }
  }

  const toggleDiy = () => {
    setdiy(diy=> {
      const newDiy = !diy
      if(newDiy){
        setDiy()
      }else{
        setPerformedBy('')
      }
      return newDiy
    })
  }

  return (
       <form>
          <h1>Job Dashboard</h1>
          <h3>Add New Job for your {activeVehicle.model.year} {activeVehicle.make} {activeVehicle.model.name}</h3>
          <hr/>
          <legend><p>add job</p></legend>
         <Row>
           <Col md={6}>
             <FormGroup>
               <Row>
                 <Col md={{size: 1, offset: 1}}>
                       <Label for='diy' check>
                       <Input name={'diy'} id='diy' type='checkbox' checked={diy} onChange={()=> toggleDiy()}/>
                       diy
                       </Label>
                 </Col>
                 <Col md={10}>
                   <Label>Done By</Label>
                   <Input name={'performedBy'} value={performedBy} onChange={(e)=>setPerformedBy(e.target.value)}/>
                 </Col>
               </Row>
             </FormGroup>
             <FormGroup>
               <Label>Time Taken</Label>
               <Row>
                 <Col>
                   <Label>Days</Label>
                   <Input name={'timeTakenDays'} value={timeTaken.days} onChange={e=> setDays(e.target.value) }/>
                 </Col>
                 <Col>
                   <Label>Hours</Label>
                   <Input name={'timeTakenHours'} value={timeTaken.hours} onChange={e => setHours(e.target.value) }/>
                 </Col>
                 <Col>
                   <Label>Minutes</Label>
                   <Input name={'timeTakenMinutes'} value={timeTaken.minutes} onChange={e=> setMinutes(e.target.value) }/>
                 </Col>
               </Row>
               {/*<Input name={'timeTaken'} value={timeTaken} onChange={(e)=>setTimeTaken(e.target.value)}/>*/}
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
                 <FormGroup check key={service.serviceName}>
                   <Label check>
                     <Input
                         type={'checkbox'}
                         checked={selectedServices.indexOf(service)>=0}
                         onChange={()=> change(service)}
                     />
                     {service.serviceName}
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