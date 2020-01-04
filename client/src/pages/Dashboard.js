import "bootstrap/scss/bootstrap.scss";
import React, { Component, useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import requireAuth from "../components/requireAuth";
import AddVehicle from "../components/dashboard/AddVehicle";
import VehihcleCard from "../components/dashboard/VehicleCard";
import { makeRequest } from '../helpers/graphql'
import { useVehicleContext } from '../contexts/VehicleContext'

const Dashboard = () => {
   const [id, setId] = useState("")
   const [make, setMake] = useState(null)
   const [model, setModel] = useState(null)
   const [year, setYear] = useState('')
   const [loadingModels, setLoadingModels] = useState(false)
   const [loadingMakes, setLoadingMakes] = useState(false)
   const [makes, setMakes] = useState([])
   const [models, setModels] = useState([])

  useEffect(()=>{
    makeRequest(
        `query models($input: GetModelsInput!){ getModels(input: $input) { name } }`,
        { input: { make: { name: make}, year}}
    ).then(({getModels})=>{
        setModels(getModels)
        setLoadingModels(false)
    })
  }, [make])

   const { vehicles, addVehicle } = useVehicleContext()

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
      input: {
        make:{
          name: make
        },
        model: {
          name: model
        },
        year,
      }
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
    const vehicleDatabase = this.state.vehicleDatabase.map(vehicle => {
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

    return (
      <Container>
        <h1>Vehicle Dashboard</h1>
        <p>Browse or add a vehicle</p>
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
        <VehicleList updateData={updateData} deleteData={deleteData}/>
      </Container>
    );
  }

const VehicleList = ({updateData, deleteData}) => {
  const { vehicles } = useVehicleContext()
  return (
       <Row>
          {vehicles.map((vehicle, key) => (
            <VehihcleCard
              {...vehicle}
              make={vehicle.make.name}
              model={vehicle.model.name}
              key={key}
              updateData={updateData}
              deleteData={deleteData}
            />
          ))}
        </Row>
  )
}

export default requireAuth(Dashboard);

const dummyDB = [
  {
    "id": "348tewhrgfi3u4asd5htwgfe978rhf",
    "make": "Volvo",
    "model": "S40 T5",
    "year": 2008,
    "services": {
      "oilChange": {
        "id_oc": "348tewhrgfi3wefweu45htwgfe978rhf",
        "mileage": 75000,
        "oilType": "5W-30",
        "filter": "Mann-Filter HU 719/8",
        "reminder": true,
        "reminderInterval": 10000
      },
      "tires": {
        "id_ti": "348tewhrgfi3u45htwgfe978rhf",
        "mileage": 82091,
        "reminder": true,
        "reminderInterval": 10000,
        "size": {
          "front": "205/50R17",
          "rear": "205/50R17"
        }
      },
      "brakes": {
        "mileage": {
          "id_bf": "348tewhrgf453t6i3u45htwgfe978rhf",
          "front": {
            "mileage": 67635,
            "rotation": false,
            "reminder": true,
            "reminderInterval": 10000
          },
          "rear": {
            "id_br": "348tewhrgfidsaff3u45htwgfe978rhf",
            "mileage": 63435,
            "rotation": false,
            "reminder": true,
            "reminderInterval": 10000
          }
        }
      },
      "registration": {
        "id_re": "348tewhrgfi3u43gyj45htwgfe978rhf",
        "date": "02/12/2018",
        "state": "CA",
        "reminder": true,
        "reminderInterval": 10000
      },
      "custom": {
        "id_cu": "348tewhrgfi3u45htwdfgaseerytgfe978rhf",
        "mileage": 67309,
        "customName": "Timing Belt",
        "customDesc": "changed timing belt",
        "reminder": true,
        "reminderInterval": 10000
      }
    }
  },
  {
    "id": "534643456rgfi3u4asd5htwgfe978rhf",
    "make": "Lexus",
    "model": "IS300",
    "year": 2008,
    "services": {
      "oilChange": {
        "id_oc": "534643456348tewhrgfi3wefweu45htwgfe978rhf",
        "mileage": 175000,
        "oilType": "5W-30",
        "filter": "Bosch",
        "reminder": true,
        "reminderInterval": 10000
      },
      "tires": {
        "id_ti": "534643456348tewhrgfi3u45htwgfe978rhf",
        "mileage": 182091,
        "reminder": true,
        "reminderInterval": 10000,
        "size": {
          "front": "215/45R17",
          "rear": "215/45R17"
        }
      },
      "brakes": {
        "mileage": {
          "id_bf": "534643456348tewhrgf453t6i3u45htwgfe978rhf",
          "front": {
            "mileage": 167635,
            "rotation": false,
            "reminder": true,
            "reminderInterval": 10000
          },
          "rear": {
            "id_br": "534643456348tewhrgfidsaff3u45htwgfe978rhf",
            "mileage": 163435,
            "rotation": false,
            "reminder": true,
            "reminderInterval": 10000
          }
        }
      },
      "registration": {
        "id_re": "534643456348tewhrgfi3u43gyj45htwgfe978rhf",
        "date": "02/12/2018",
        "state": "CA",
        "reminder": true,
        "reminderInterval": 10000
      },
      "custom": {
        "id_cu": "534643456348tewhrgfi3u45htwdfgaseerytgfe978rhf",
        "mileage": 167309,
        "customName": "Timing Belt",
        "customDesc": "changed timing belt",
        "reminder": true,
        "reminderInterval": 10000
      }
    }
  }
]
