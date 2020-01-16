import React, {  useState, useEffect, useMemo, useReducer } from 'react';
import {
  Jumbotron,
  Button,
  Container,
  Row,
  Col,
  Card,
  CardBlock,
  CardBody,
  CardColumns,
  CardDeck,
  CardTitle,
  CardFooter,
  CardHeader,
  Collapse,
} from 'reactstrap';
import { useToggleContext } from '../components/Toggle'
import { useServiceContext } from '../contexts/ServiceContext'
import { AddService } from '../components/services/AddService'
import { DataPage } from '../components/DataPage'


const noteReducer = (state, {type, value} = {}) => {
  switch(type){
    case 'SET_OPEN':
      return {
        ...state,
        [value.name]: true,
      }
    case 'SET_CLOSED':
      return {
        ...state,
        [value.name]: false,
      }
    default:
      return state
  }
}

const setServiceNoteOpen = (name, dispatch) => {
  dispatch({type: 'SET_OPEN', value: { name }})
}

const setServiceNoteClosed = (name, dispatch) => {
  dispatch({type: "SET_CLOSED", value: {name}})
}


export const Services = () => {
  const { services, addService, removeService } = useServiceContext()
  const [currentPage, setCurrentPage] = useState(0)

  const goToPage = num => setCurrentPage(num)

  const goBack = () => setCurrentPage(currentPage=> currentPage-1)
  const goNext = () => setCurrentPage(currentPage=> currentPage+1)

  const [state, dispatch] = useReducer(noteReducer, useMemo(()=>{
      return services.reduce((prev, service)=> {
        prev[service.name] = false
        return prev
      },{})
    }, [services])
  )

  const { on, off } = useToggleContext()

  const setOpen = service => {
    setServiceNoteOpen(service.name, dispatch)
  }

  const setClosed = service => {
    setServiceNoteClosed(service.name, dispatch)
  }

    const getColCount = () => {
      const serviceListLength = services && services.length
      if(serviceListLength){
        if(serviceListLength === 1){
          return 12
        }
        if(2 <= serviceListLength <= 4 ){
          return 12 / serviceListLength
        }
        return serviceListLength % 2 ? 5 : 4
      }
    }

    const submitService = service => {
      addService(service)
    }

    const colCount = useMemo(()=> getColCount(), [services])

    const parseTime = ({seconds, minutes, hours, days, months, years}, ...rest) => {
    console.log(seconds, hours)
      let rtn = ''
      if(years){
        rtn += ` ${years} year${years !== 1 ? 's' : ''}`
      }
      if(months){
        rtn += ` ${months} month${months !== 1 ? 's': ''} `
      }
      if(days){
        rtn += ` ${days} day${days !== 1  ? 's': ''} `
      }
      if(hours){
        rtn += ` ${hours} hour${hours !== 1 ? 's' : ''} `
      }
      if(minutes){
        rtn += ` ${minutes} minute${minutes !== 1 ? 's': ''} `
      }
      return `${rtn}`
    }

    return (
        services ? (
        <div style={{minHeight: '90vh', display: "flex", flexDirection: "column"}} className="home-container">

            <Jumbotron className="jumbotron text-center">
            <h1 className="display-3">Services</h1>
            <p className="lead">Add or Remove available services and vechile maintenece.</p>
            <hr className="my-2" />
          </Jumbotron>

            <Container className="section-1 text-center" fluid>
              <Row>
                <Col md={2}></Col>
                <Col md={8}>
                  { on && (<AddService onHandleSubmit={submitService}/>) || (
                      <div>
                        <h2>Current Services</h2>
                  <p className="lead">Add your vehicle and log your maintenece.</p>
                        <AddService />
                        <DataPage
                            goToPage={goToPage}
                            goBack={goBack}
                            goNext={goNext}
                            pageNum={currentPage}
                            perPage={3}>
                    {services ? services.map(service =>
                      <Col style={{marginTop: '10px'}} md={4}>
                        <Card>
                          <CardHeader tag={'h4'}>
                            {service.name}
                          </CardHeader>
                        <CardBody>
                          <dl>
                            <dt>Estimated Time To Complete</dt>
                            <dd>{parseTime(service.estimatedTimeToComplete)}</dd>
                            <dt>Difficulty</dt>
                            <dd>{service.difficulty}</dd>
                            <dt>suggested service interval</dt>
                            <dd>
                              {
                                (
                                    service.suggestedServiceInterval.months ||
                                    service.suggestedServiceInterval.years
                                )  && parseTime(service.suggestedServiceInterval)
                              }
                              {service.suggestedServiceInterval.miles && ` / ${service.suggestedServiceInterval.miles} miles`}
                            </dd>
                            {!state[service.name] && <p style={{opacity: service.notes ? 1 : .4 ,color: service.notes ? 'black' : 'gray'}} onClick={()=> service.notes && setOpen(service)}>see notes</p>}
                            {(service.notes && state[service.name]) ?
                            (<p onClick={() => setClosed(service)}>
                                <small>{service.notes}</small>
                            </p>) : null
                            }
                           </dl>
                           <Button block>edit</Button>
                        </CardBody>
                      </Card>
                    </Col>

                  ) : null}

                        </DataPage>
                      </div>
                  )}
                </Col>
                <Col md={2}></Col>
              </Row>
            </Container>

        </div>

         ) : <div style={{textAlign: 'center'}}>
              <h2>Loading</h2>
            </div>
    )
}
