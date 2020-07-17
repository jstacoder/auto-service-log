import "bootstrap/scss/bootstrap.scss";
import React, { Component, useState, useEffect, useMemo } from "react";
import {
  Button,
  Container,
  Row,
  Col,
} from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { AddVehicleButton } from '../components/dashboard/AddVehicleButton'
import { JobsList } from '../components/jobs/JobList'
import { OdometerLog } from '../components/OdometerLog'
import requireAuth from "../components/requireAuth"
import VehihcleCard from "../components/dashboard/VehicleCard"
import { Toggle } from '../components/Toggle'
import { useVehicleContext } from '../contexts/VehicleContext'
import { AddJob } from '../components/jobs/AddJob'

export const AddJobPage = props =>{
  const { activeVehicle } = useVehicleContext()
  return (
      <AddJob activeVehicle={activeVehicle} />
  )
}


const Dashboard = () => {
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [viewingJobs, setViewingJobs] = useState(false)
  const history = useHistory()

  const {
    vehicles, removeVehicle,
    setActiveVehicle, activeVehicle
  } = useVehicleContext()

  const toggleModal = () => setLogModalOpen(logModalOpen => !logModalOpen)





  //UPDATE data from DB
  const updateData = editedVehicle => {
    //Axios update will go here...
    //assing a copy of vehicle array with modified value for the editedVehicle.
    const vehicleDatabase = vehicles.map(vehicle => {
      return vehicle._id === editedVehicle._id ? editedVehicle : vehicle;
    })
    //set new state
    this.setState({
      vehicleDatabase
    })
  }

  // DELETE function wont delete new vehicleDatabase because they are not created with an ID,
  // once you hoock up database you'll use the DB's id instead of 1, 2, 3.
  const deleteData = vehicle => {
    //Axios delete will go here...
    //assing a new vehicleDatabase const removing the to delete filtering by id
    removeVehicle(vehicle)
  }

   const openAddJobForm = vehicle =>{
      setActiveVehicle(vehicle)
      history.push(`/add-vehicle-job/${vehicle._id}`)
    }

    return (
      <Container>
        <OdometerLog logModalOpen={logModalOpen} toggleModal={toggleModal}/>
            <h1>Vehicle Dashboard</h1>
            <p> Browse or add a vehicle</p>
            <AddVehicleButton/>
            {!!viewingJobs &&
                  <Button onClick={ ()=> setViewingJobs(false)}>Go Back</Button>
            }
            {!viewingJobs && <VehicleList setViewingJobs={setViewingJobs} toggleLogModal={toggleModal} openAddJobForm={openAddJobForm} updateData={updateData} deleteData={deleteData}/>}
            {!!viewingJobs && <JobsList/>}
      </Container>
    );
  }

const VehicleList = ({setViewingJobs, updateData, deleteData, openAddJobForm, toggleLogModal, toggle}) => {
  const { vehicles } = useVehicleContext()

  return (
            <Row>
          {vehicles.map((vehicle, key) => (
            <VehihcleCard
              {...vehicle}
              setViewingJobs={setViewingJobs}
              toggleLogModal={toggleLogModal}
              currentOdometerReading={vehicle.currentOdometerReading}
              openAddJobForm={openAddJobForm}
              toggle={toggle}
              make={vehicle.make.name}
              model={vehicle.model}
              key={key}
              updateData={updateData}
              deleteData={deleteData}
            />
          ))}

        </Row>
  )
}

export default requireAuth(Dashboard)
