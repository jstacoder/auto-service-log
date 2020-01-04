import React, {  useState, useEffect, useMemo } from 'react';
import { Jumbotron, Button, Container, Row, Col } from 'reactstrap';
import { useServiceContext } from '../contexts/ServiceContext'
import { AddService } from '../components/services/AddService'


export const Services = () => {
  const { services, addService, removeService } = useServiceContext()


    const getColCount = () => {
      const serviceListLength = services && services.length
      if(serviceListLength){
        if(serviceListLength === 1){
          return 12
        }
        if(2 <= serviceListLength <= 4 ){
          return 12 / serviceListLength
        }
        return serviceListLength % 2 ? 4 : 3
      }
    }

    const submitService = service => {
      addService(service)
    }

    const colCount = useMemo(()=> getColCount(), [services])

    const parseTime = ({seconds, minutes, hours, days, months, years}, ...rest) => {
    console.log(seconds, hours)
      let rtn = ''
      if(seconds){
        rtn += `${seconds} seconds `
      }
      if(minutes){
        rtn += ` ${minutes} minute${minutes !== 1 ? 's': ''} `
      }
      if(hours){
        rtn += ` ${hours} hour${hours !== 1 ? 's' : ''} `
      }
      if(days){
        rtn += ` ${days} day${days !== 1  ? 's': ''} `
      }
      if(months){
        rtn += ` ${months} month${months !== 1 ? 's': ''} `
      }
      if(years){
        rtn += ` ${years} year${years !== 1 ? 's' : ''}`
      }
      return `${rtn}`
    }

    return (
        services ? (
        <div className="home-container">

            <Jumbotron className="jumbotron text-center">
            <h1 className="display-3">Services</h1>
            <p className="lead">Add or Remove available services and vechile maintenece.</p>
            <hr className="my-2" />
          </Jumbotron>

            <Container className="section-1 text-center">
            <h2>Current Services</h2>
            <p className="lead">Add your vehicle and log your maintenece.</p>
            <AddService onHandleSubmit={submitService}/>
            <Row>
            {services ? services.map(service =>
                <Col md={colCount}>
                  <h4>{service.name}</h4>
                  <dl>
                    <dt>Estimated Time To Complete</dt>
                    <dd>{service.estimatedTimeToComplete.map(time=> JSON.parse(time).map(tme=> parseTime(tme)) )}</dd>
                    <dt>Difficulty</dt>
                    <dd>{service.difficulty}</dd>
                    <dt>suggested service interval</dt>
                    <dd>{service.suggestedServiceInterval}</dd>
                    <p><small>{service.notes}</small></p>
                  </dl>
                </Col>
            ) : null}

            </Row>
            </Container>

        </div>

         ) : <div style={{textAlign: 'center'}}>
              <h2>Loading</h2>
            </div>
    )
}
