import React, { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { Button, Form, FormGroup, Input } from "reactstrap"
import InputGroup from 'reactstrap/es/InputGroup'
import InputGroupAddon from 'reactstrap/es/InputGroupAddon'
import Label from 'reactstrap/lib/Label'
import { useVehicleContext } from '../../contexts/VehicleContext'
import { makeRequest } from '../../helpers/graphql'
import { useHistory } from 'react-router-dom'

const AddVehicle = props => {
    const [make, setMake] = useState(null)
    const [model, setModel] = useState(null)
    const [year, setYear] = useState('')
    const [loadingModels, setLoadingModels] = useState(false)
    const [loadingMakes, setLoadingMakes] = useState(false)
    const [makes, setMakes] = useState([])
    const [models, setModels] = useState([])
    const [mileage, setMileage] = useState(null)
    const history = useHistory()

    const {
      addVehicle
    } = useVehicleContext()

    useEffect(()=>{
      console.log(make)
      if(make){
        makeRequest(
            `query models($input: GetModelsInput!){ getModels(input: $input) { name } }`,
            { input: { make: { name: make}, year}}
        ).then(({getModels})=>{
          setModels(getModels)
          setLoadingModels(false)
        })
      }
     }, [make])


    const onHandleYearChange = e =>{
      setYear(e.target.value)
      if(e.target.value.toString().length === 4) {
          setLoadingMakes(true)
          makeRequest(`{getMakes{ name }}`).then(({ getMakes }) => {
            setMakes(getMakes)
            setLoadingMakes(false)
          })
      }
    }
    const onHandleMakeChange = e =>{
      setLoadingModels(true)
      setMake(e.target.value)

    }

    const onHandleModelChange = e => setModel(e.target.value)

    const onHandleMileageChange = e => setMileage(e.target.value)

    //CREATE data from the form submission
    const onHandleSubmit = async event => {
      event.preventDefault()
      //conditional input validation
      if (!make || !model || !year) return null;

      const variables = {
          make:{
            name: make
          },
          model: {
            name: model,
            year: parseInt(year),
          },
          miles: parseInt(mileage),
      }
      addVehicle(variables)
      // setState + reset form values onSubmit
      setMake(null)
      setModel(null)
      setYear("")
      history.push("/dashboard")
    }

  return (
      <Form onSubmit={onHandleSubmit}>
        <div>
            <div>
              <h3>Add a vehicle</h3>
                <FormGroup>
                <Input
                    name="year"
                    placeholder="Vehicle's Year"
                    value={year || ''}
                    onChange={onHandleYearChange}
                />
              </FormGroup>
              <FormGroup>
                <Input
                    type="select"
                    disabled={year === '' || loadingMakes}
                    name="make"
                    placeholder="Vehicle's Make"
                    value={make || ''}
                    onChange={onHandleMakeChange}
                >

                  {makes.length ?
                      [<option>Choose Make</option>].concat(
                          makes.map(make =>
                              <option key={make.name}
                                      value={make.name}>{make.name}</option>
                          )
                      ) : loadingMakes ? <option>Loading...</option> :
                          <option>Choose a Year</option>
                  }
                </Input>
              </FormGroup>
              <FormGroup>
                <Input
                    type='select'
                    disabled={make === null || loadingModels}
                    name="model"
                    placeholder="Vehicle's Model"
                    value={model || ''}
                    onChange={onHandleModelChange}
                >
                  {models.length ?
                      [<option>Choose Model</option>].concat(
                          models.map(model =>
                              <option key={model.name}
                                      value={model.name}>{model.name}</option>
                          )
                      ) : loadingModels ? <option>Loading...</option> :
                          <option>Choose a Make</option>
                  }
                </Input>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType='prepend'>@</InputGroupAddon>
                  <Input value={mileage} name={'mileage'} placeholder={'vehicle mileage'} onChange={onHandleMileageChange}/>                </InputGroup>
              </FormGroup>

              <div className="text-right">
                <Button
                    tag={Link}
                    className="text-right mr-2 mb-2"
                    color="secondary"
                    to={"/dashboard"}
                >
                  Hide
                </Button>
                <Button
                    className="text-right mr-2 mb-2"
                    color="success"
                    type="submit"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

    <hr />
  </Form>
  )
};

export default AddVehicle;
