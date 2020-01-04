import React, { useState } from "react";
import { Button, Form, FormGroup, Input, Label, FormText } from "reactstrap";
import Toggle from "../Toggle";

export const AddService = ({onHandleSubmit}) => {
  const [serviceName, setServiceName] = useState('')
  const [difficulty, setDifficulty] = useState('EASY')
  const [estimatedTimeToComplete, setEstimatedTimeToComplete] = useState('')
  const [suggestedServiceInterval, setSuggestedServiceInterval] = useState('')
  const [serviceNote, setServiceNote] = useState('')

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
    estimatedTimeToComplete: setEstimatedTimeToComplete,
    suggestedServiceInterval: setSuggestedServiceInterval,
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
          estimatedTimeToComplete: parseInterval(estimatedTimeToComplete),
          suggestedServiceInterval: parseInterval(suggestedServiceInterval),
          notes: serviceNote,
        }
    )
    resetForm()
    toggle()
  }

  return (

    <Toggle>
      {({ on, off, toggle }) => (
          <div>
          {on && (
              <Form>
                <FormText>
                  <h3>Add a Service</h3>
                </FormText>
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
                <select
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
                </select>
              </FormGroup>
              <FormGroup row>
                <Label for='estimatedTimeToComplete'>Estimated Time To Complete</Label>
                <Input name={'estimatedTimeToComplete'} id='estimatedTimeToComplete' onChange={onChange} value={estimatedTimeToComplete} />
              </FormGroup>
              <FormGroup row>
                <Label for='suggestedServiceInterval'>Suggested Service Interval</Label>
                <Input name={'suggestedServiceInterval'} id={'suggestedServiceInterval'} onChange={onChange} value={suggestedServiceInterval} />
              </FormGroup>
              <FormGroup row>
                <Label htmlFor={'notes'}>Note</Label>
                <Input type='textarea' value={serviceNote} onChange={onChange} id={'notes'} name={'notes'}/>
              </FormGroup>
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
      )}
    </Toggle>

  )
}
