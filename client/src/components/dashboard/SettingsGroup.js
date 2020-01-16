import React, {useState} from 'react'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const SettingsGroup = ({handleEditClick, handleDeleteClick, vehicle}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [modal, setModal] = useState(false)
  const [displayLog, setDisplayLog] = useState(false)

  const showLog = () => setDisplayLog(true)
  const hideLog = () => setDisplayLog(false)

  const toggle = () => {
    setDropdownOpen(dropdownOpen=> !dropdownOpen)
  }

  const toggleModal = () => {
    setModal(modal=> !modal)
  }

  const onEditClick = () => {
    props.handleEditClick()
  };

  const onDeleteClick = () => {
    toggleModal()
	  props.handleDeleteClick()
  }

  const onLogClick = ()=>{
    
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
        <Modal isOpen={modal} toggle={toggleModal} className={props.className}>
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
