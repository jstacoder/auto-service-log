import "bootstrap/scss/bootstrap.scss";
import React, { Component, useState, useEffect, useMemo } from "react";
import {
  Button,
  Container,
  Row,
} from 'reactstrap'
import { JobsList } from '../components/jobs/JobList'
import { OdometerLog } from '../components/OdometerLog'
import requireAuth from "../components/requireAuth";
import AddVehicle from "../components/dashboard/AddVehicle";
import VehihcleCard from "../components/dashboard/VehicleCard";
import { useToggleContext } from '../components/Toggle'
import { makeRequest } from '../helpers/graphql'
import { useVehicleContext } from '../contexts/VehicleContext'
import { AddJob } from '../components/jobs/AddJob'

const Dashboard = () => {
  const [logModalOpen, setLogModalOpen] = useState(false)
  const { on, off, toggle } = useToggleContext()
  const [make, setMake] = useState(null)
  const [model, setModel] = useState(null)
  const [year, setYear] = useState('')
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingMakes, setLoadingMakes] = useState(false)
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [viewingJobs, setViewingJobs] = useState(false)


  const {
    addVehicle, vehicles,
    updateVehicle, removeVehicle,
    setActiveVehicle, activeVehicle
  } = useVehicleContext()

  const toggleModal = () => setLogModalOpen(logModalOpen => !logModalOpen)

  useEffect(()=>{
    if(make && make.name){
      makeRequest(
          `query models($input: GetModelsInput!){ getModels(input: $input) { name } }`,
          { input: { make: { name: make}, year}}
      ).then(({getModels})=>{
        setModels(getModels)
        setLoadingModels(false)
      })
    }
  }, [make])


   const handleChange = ({ target: { name, value } }) => {
    //workaround mutating state directly...
    const changeFuncs = {
      make: setMake,
      model: setModel,
      year: setYear,
    }
    const changeFunc = changeFuncs[name]
     changeFunc(value)
  }

  //CREATE data from the form submission
  const handleSubmit = async event => {
    event.preventDefault()
    //conditional input validation
    if (!make || !model || !year) return null;

    const variables = {
        make:{
          name: make
        },
        model: {
          name: model
        },
        year,
    }
    addVehicle(variables)
    // setState + reset form values onSubmit
    setMake(null)
    setModel(null)
    setYear("")
  }

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
  const deleteData = vehicleId => {
    //Axios delete will go here...
    //assing a new vehicleDatabase const removing the to delete filtering by id
    const vehicleDatabase = this.state.vehicleDatabase.filter(
      vehicle => vehicle.id !== vehicleId
    );
    this.setState({
      vehicleDatabase
    });
  };

  const handleYearChange = e =>{
    setYear(e.target.value)
    if(e.target.value.toString().length === 4) {
        setLoadingMakes(true)
        makeRequest(`{getMakes{ name }}`).then(({ getMakes }) => {
          setMakes(getMakes)
          setLoadingMakes(false)
        })
    }
  }
  const handleMakeChange = e =>{
    setLoadingModels(true)
    setMake(e.target.value)

  }

  const handleModelChange = e =>{
    setModel(e.target.value)
  }

  const openAddJobForm = vehicle =>{
    setActiveVehicle(vehicle)
    toggle()
  }
    return (
      <Container>
        <OdometerLog logModalOpen={logModalOpen} toggleModal={toggleModal}/>
        {off ? (
            <>
            <h1>Vehicle Dashboard</h1>
            <p> Browse or add a vehicle</p>
            { !viewingJobs &&
              <AddVehicle
                  onHandleChange={handleChange}
                  onHandleSubmit={handleSubmit}
                  onHandleYearChange={handleYearChange}
                  onHandleModelChange={handleModelChange}
                  onHandleMakeChange={handleMakeChange}
                  makes={makes}
                  models={models}
                  loadingMakes={loadingMakes}
                  loadingModels={loadingModels}
                  make={make}
                  model={model}
                  year={year}
              />
            }
            {!!viewingJobs &&
                  <Button onClick={ ()=> setViewingJobs(false)}>Go Back</Button>
            }
            {!viewingJobs && <VehicleList setViewingJobs={setViewingJobs} toggleLogModal={toggleModal} openAddJobForm={openAddJobForm} updateData={updateData} deleteData={deleteData}/>}
            {!!viewingJobs && <JobsList/>}
          </>
          ) : activeVehicle.model.year ? (
              <AddJob activeVehicle={activeVehicle} toggle={toggle}/>
        ) : null
        }
      </Container>
    );
  }

const VehicleList = ({setViewingJobs, updateData, deleteData, openAddJobForm, toggleLogModal}) => {
  const { vehicles } = useVehicleContext()
  const { on, off, toggle } = useToggleContext()


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
