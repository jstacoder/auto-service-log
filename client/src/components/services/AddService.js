import React, { useState } from "react";
import { Button, Form, FormGroup, Input, Label, FormText, Col,  Row } from "reactstrap";
import Toggle from "../Toggle";
import { useToggleContext } from '../Toggle'

export const AddService = ({onHandleSubmit}) => {
  const [serviceName, setServiceName] = useState('')
  const [difficulty, setDifficulty] = useState('EASY')
  const [estimatedTimeToCompleteMinutes, setEstimatedTimeToCompleteMinutes] = useState('')
  const [estimatedTimeToCompleteHours, setEstimatedTimeToCompleteHours] = useState('')
  const [estimatedTimeToCompleteDays, setEstimatedTimeToCompleteDays] = useState('')
  const [suggestedServiceIntervalMonths, setSuggestedServiceIntervalMonths] = useState('')
  const [suggestedServiceIntervalYears, setSuggestedServiceIntervalYears] = useState('')
  const [suggestedServiceIntervalMiles, setSuggestedServiceIntervalMiles] = useState('')
  const [serviceNote, setServiceNote] = useState('')
  const { on, off, toggle } = useToggleContext()

  const setSuggestedServiceInterval = val => {
    setSuggestedServiceIntervalMiles(val)
    setSuggestedServiceIntervalMonths(val)
    setSuggestedServiceIntervalYears(val)
  }

  const setEstimatedTimeToComplete = val => {
    setEstimatedTimeToCompleteDays(val)
    setEstimatedTimeToCompleteHours(val)
    setEstimatedTimeToCompleteMinutes(val)
  }

  const resetForm = () => {
    setServiceName('')
    setDifficulty('EASY')
    setEstimatedTimeToComplete('')
    setSuggestedServiceInterval('')
    setServiceNote('')
  }

  const parseInterval = interval =>{
    const parts = interval.split(' ')
    if(!parts[1].endsWith('s')){
      parts[1] = `${parts[1]}s`
    }
    return [{
      [parts[1]]: parts[0]
    }]
  }

  const setMap = {
    name: setServiceName,
    difficulty: setDifficulty,
    estimatedTimeToCompleteMinutes: setEstimatedTimeToCompleteMinutes,
    estimatedTimeToCompleteHours: setEstimatedTimeToCompleteHours,
    estimatedTimeToCompleteDays: setEstimatedTimeToCompleteDays,
    suggestedServiceIntervalMiles: setSuggestedServiceIntervalMiles,
    suggestedServiceIntervalYears: setSuggestedServiceIntervalYears,
    suggestedServiceIntervalMonths: setSuggestedServiceIntervalMonths,
    notes: setServiceNote,
  }

  const onChange = e => {
    const changeFunc = setMap[e.target.name]
    changeFunc(e.target.value)
  }

  const handleSubmit = (e, toggle) => {
    e.preventDefault()
    onHandleSubmit(
        {
          name: serviceName,
          difficulty,
          estimatedTimeToComplete: {
            minutes: estimatedTimeToCompleteMinutes && parseInt(estimatedTimeToCompleteMinutes),
            hours: estimatedTimeToCompleteHours && parseInt(estimatedTimeToCompleteHours),
            days: estimatedTimeToCompleteDays && parseInt(estimatedTimeToCompleteDays),
          },
          suggestedServiceInterval: {
            months: suggestedServiceIntervalMonths && parseInt(suggestedServiceIntervalMonths),
            years: suggestedServiceIntervalYears && parseInt(suggestedServiceIntervalYears),
            miles: suggestedServiceIntervalMiles && parseInt(suggestedServiceIntervalMiles),
          },
          notes: serviceNote,
        }
    )
    resetForm()
    toggle()
  }

  return (

          <div>
          {on && (
              <Form>
                <FormText>
                  <h3>Add a Service</h3>
                </FormText>
                  <legend>
                  <FormGroup row>
                  <Label for='name'>Name</Label>
                <Input
                    id={'name'}
                    name="name"
                    type='text'
                    placeholder="Name of service"
                    value={serviceName}
                    onChange={onChange}
                />
              </FormGroup>
              <FormGroup row>
                <Label for='difficulty'>Difficulty</Label>
                <Input
                    type='select'
                    name="difficulty"
                    id='difficulty'
                    placeholder="Difficulty Level"
                    value={difficulty}
                    onChange={onChange}
                    className='form-control'
                >
                  <option value={'EASY'}>Easy</option>
                  <option value={'INTERMEDIATE'}>Intermediate</option>
                  <option value={'HARD'}>Hard</option>
                  <option value={'IMPOSSIBLE'}>Impossible</option>
                </Input>
              </FormGroup>
                <Row form>
                  <Col md={{size: 5}}>
                    <FormGroup style={{display: 'flex', flexDirection: 'column'}}>
                        <FormText inline style={{display: 'block'}}>Estimated Time To Complete</FormText>
                        <FormGroup row>
                          <Label for='estimatedTimeToCompleteMinutes'>Minutes</Label>
                          <Input
                              size='sm'
                              name={'estimatedTimeToCompleteMinutes'}
                              id='estimatedTimeToCompleteMinutes'
                              onChange={onChange}
                              value={estimatedTimeToCompleteMinutes} />
                          <Label for='estimatedTimeToCompleteMinutes'>Hours</Label>
                          <Input
                              size='sm'
                              name={'estimatedTimeToCompleteHours'}
                              id='estimatedTimeToCompleteHours'
                              onChange={onChange}
                              value={estimatedTimeToCompleteHours} />
                          <Label for='estimatedTimeToCompleteMinutes'>Days</Label>
                          <Input
                              size='sm'
                              name={'estimatedTimeToCompleteDays'}
                              id='estimatedTimeToCompleteDays'
                              onChange={onChange}
                              value={estimatedTimeToCompleteDays} />

                        </FormGroup>
                    </FormGroup>
                  </Col>
                  <Col md={{size: 5, offset: 2}}>
                        <FormGroup style={{display: 'flex',flexDirection: 'column'}}>
                          <FormText inline>Suggested  Service Interval</FormText>
                          <FormGroup row>
                          <Label for={'suggestedServiceIntervalMiles'}>Miles</Label>
                          <Input
                              size='sm'
                              name={'suggestedServiceIntervalMiles'}
                              id={'suggestedServiceIntervalMiles'}
                              onChange={onChange}
                              value={suggestedServiceIntervalMiles} />
                          <Label for={'suggestedServiceIntervalMonths'}>Months</Label>
                          <Input
                              size='sm'
                              name={'suggestedServiceIntervalMonths'}
                              id={'suggestedServiceIntervalMonths'}
                              onChange={onChange}
                              value={suggestedServiceIntervalMonths} />
                          <Label for={'suggestedServiceIntervalYears'}>Years</Label>
                          <Input
                              size='sm'
                              name={'suggestedServiceIntervalYears'}
                              id={'suggestedServiceIntervalYears'}
                              onChange={onChange}
                              value={suggestedServiceIntervalYears} />
                          </FormGroup>
                        </FormGroup>
                  </Col>
                </Row>
              <FormGroup row>
                <Label htmlFor={'notes'}>Note</Label>
                <Input type='textarea' value={serviceNote} onChange={onChange} id={'notes'} name={'notes'}/>
              </FormGroup>
                  </legend>
              <div className="text-right">
                <Button
                    className="text-right mr-2 mb-2"
                    color="secondary"
                    onClick={toggle}
                >
                  Hide
                </Button>
                <Button
                    className="text-right mr-2 mb-2"
                    color="success"
                    onClick={e => handleSubmit(e, toggle)}
                >
                  Add
                </Button>
              </div>
              </Form>
          )}
            {off && (
                <Button onClick={toggle}>
              Add a Service
            </Button>
            )}
        </div>

  )
}
