import React, { Fragment, useState } from "react";
import { useHistory } from 'react-router-dom'
import { Col, Card, CardTitle, CardSubtitle, Button } from "reactstrap";
import SettingsGroup from "./SettingsGroup";
import VehicleEditForm from "./VehicleEditForm";
import { useVehicleContext } from '../../contexts/VehicleContext'

const VehicleCard  = props => {
  const { setActiveVehicle } = useVehicleContext()
  const history = useHistory()

  //Toggle state to conditional rendering
  const [toggleEdit, setToggleEdit] = useState(false)

  const addJob = () => props.openAddJobForm(props)

  //show edit form when clicking initial edit button
  const handleEditClick = () => setToggleEdit(true)

  const handleEditSubmit = editedValues => {
    // assign to edited field coming from VehicleEditForm the id of the student
    editedValues.id = props.id;
    //call updateData function in App with editedValues
    props.updateData(editedValues);
    //change state to render student card
    setToggleEdit(false)
  }

  //change state to render student card
  const handleCancelSubmit = () => setToggleEdit(false)

  const handleDeleteClick = () => props.deleteData(props)

  const handleDetailClick = () => {
    //deconstruct props
    const { _id, make, model } = props
    //assign them to an object to be pushed
    //const propsToPush = { make, model, year };
    // use React-Router-Dom history.push to go to new page and send props
    history.push({
      pathname: "/vehicle-details",
      state: { id: _id, make, model: model.name, year: model.year }
    })
  }
  const setViewingJobs = () =>{
    setActiveVehicle(props)
    props.setViewingJobs(true)
  }

  // this renderContent function written outside render method to use if statement
  const renderContent = () => {
    //deconstruct props
    console.log(props)
    const { _id, make, model, currentOdometerReading } = props
    //if toggleEdit is false show student card
    if (!toggleEdit) {
      return (
        <Fragment>
          <Col className="mt-2 mb-4" xs={12}>
            <Card body id={_id}>
              <CardTitle className="lead">{make}</CardTitle>
              <CardSubtitle className="text-muted">
                {model.name} | {model.year}
              </CardSubtitle>
              <CardSubtitle tag={'p'}>
                {currentOdometerReading}: mi
              </CardSubtitle>
              <div className="text-right">

                  <Button
                      onClick={addJob}
                      color='success'
                      className='mr-2'>
                    Add Job
                  </Button>
                  <Button
                    color='info'
                    className='mr-2'
                    onClick={()=> setViewingJobs()}
                  >
                    view jobs
                  </Button>
                  <Button
                    className="mt-2 mb-2 mr-2"
                    color="primary"
                    onClick={handleDetailClick}
                  >
                    Details
                  </Button>

                <SettingsGroup
                  vehicle={{make, model, _id}}
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteClick}
                  toggleLogModal={props.toggleLogModal}
                />
              </div>
            </Card>
          </Col>
        </Fragment>
      );
    }
    return (
      //if toggleEdit is true show VehicleEditForm
      <VehicleEditForm
        vehicleData={props}
        editSubmit={handleEditSubmit}
        cancelSubmit={handleCancelSubmit}
      />
    );
  };

    return renderContent()
}

export default VehicleCard
