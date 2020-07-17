import React from 'react'
import { Button, Col, Row } from 'reactstrap'
import { Link } from 'react-router-dom'
import Container from 'reactstrap/lib/Container'

// import { useUnsplashContext } from '../contexts/UnsplashApiContext'


export const VehicleDetails = props => {
  // const { searchPhotos, photos } = useUnsplashContext()

  const { make, model, year } = React.useMemo(
      ()=> props.location && props.location.state || {},
      [props]
  )

  return (
      <Container>
        <Row>
          <Col xs={10}>
          <Button tag={Link} to={"/dashboard"}>back</Button>
            <h1>VehicleDetails Page</h1>
            <h2>{make}</h2>
            <h2>{model}</h2>
            <h2>{year}</h2>
          </Col>
        </Row>
      </Container>
  );
}

export default VehicleDetails
