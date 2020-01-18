import React, {useState} from 'react'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useVehicleContext } from '../../contexts/VehicleContext'

export const SettingsGroup = ({className, handleEditClick, handleDeleteClick, toggleLogModal, vehicle}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [modal, setModal] = useState(false)
  const [displayLog, setDisplayLog] = useState(false)
  const { setActiveVehicle } = useVehicleContext()

  const showLog = () => setDisplayLog(true)
  const hideLog = () => setDisplayLog(false)

  const toggle = () => {
    setDropdownOpen(dropdownOpen=> !dropdownOpen)
  }

  const toggleModal = () => {
    setModal(modal=> !modal)
  }

  const onEditClick = () => {
    handleEditClick()
  };

  const onDeleteClick = () => {
    toggleModal()
	  handleDeleteClick()
  }

  const onLogClick = ()=>{
      setActiveVehicle(vehicle)
      toggleLogModal()
  }

  return (
      <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret outline color="info">
          <FontAwesomeIcon icon="cogs" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem className="text-danger" onClick={toggleModal}>Delete</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={onEditClick}>Edit</DropdownItem>
          <DropdownItem onClick={onLogClick}>OD Log</DropdownItem>
        </DropdownMenu>
        <Modal isOpen={modal} toggle={toggleModal} className={className}>
			<ModalHeader toggle={toggleModal}>
				<span className="text-danger">WARNING: </span>
			</ModalHeader>
          <ModalBody>
            <p className="text-center">Are you sure you want to delete this Vehicle?</p>
			<div className="text-center">
				<Button className="mt-2" color="danger" onClick={onDeleteClick}>Delete</Button>
			</div>
          </ModalBody>
        </Modal>
      </ButtonDropdown>
    );
}

export default SettingsGroup
