import React, {useState} from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'
import { useVehicleContext } from '../contexts/VehicleContext'

export const OdometerLog = ({logModalOpen, toggleModal}) => {
  const { activeVehicle, odometerReadings, addOdometerReading } = useVehicleContext()
  const [formOpen, setFormOpen] = useState(false)
  const [newReading, setNewReading] = useState(null)

  const openForm = () => {
    setFormOpen(true)
  }
  const updateReading = e => {
    setNewReading(e.target.value)
  }
  const resetReading = () =>{
    setNewReading(null)
  }
  const submit = e => {
    e.preventDefault()
    console.log(activeVehicle)
    addOdometerReading(activeVehicle, newReading)
    setFormOpen(false)
    resetReading()
  }

  const {
      make,
      model: {
        name: model,
        year
      },
  } = activeVehicle
  console.log(odometerReadings)
  return (
      <Modal isOpen={logModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{year} {make} {model}</ModalHeader>
          <ModalBody>
           { !formOpen ? (
               <div>
              <p>Mileage Log:</p>
              {odometerReadings.map(({miles, dateCompleted}) => <p>{miles} miles on {dateCompleted}</p>)}
              </div>
              ) : (
                <form onSubmit={submit}>
                 <input value={newReading} onChange={updateReading} />
                </form>
             )
            }
          </ModalBody>
          <ModalFooter>
            <Button onClick={openForm}>add New</Button>
            <Button onClick={toggleModal}>close</Button>
          </ModalFooter>
        </Modal>
    )
}