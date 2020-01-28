import React, {useState} from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  Input,
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
                 <Table bordered hover>
                   <tr>
                     <th>
                       Miles
                     </th>
                    <th>
                      Date
                    </th>
                   </tr>
              {
                odometerReadings.map(({miles, dateCompleted}) =>(
                    <tr key={miles.toString()}>
                      <td>{miles}</td>
                      <td>{dateCompleted}</td>
                    </tr>
                ))}
                 </Table>
              </div>
              ) : (
                <form onSubmit={submit}>
                 <Input autoFocus value={newReading} onChange={updateReading} />
                </form>
             )
            }
          </ModalBody>
          <ModalFooter>
            <Button color={!formOpen ? 'secondary' : 'success'} onClick={!formOpen ? openForm : submit}>{!formOpen ? 'Add New' : 'Save'}</Button>
            <Button onClick={toggleModal}>close</Button>
          </ModalFooter>
        </Modal>
    )
}