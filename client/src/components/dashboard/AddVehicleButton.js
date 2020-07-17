import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

export const AddVehicleButton = props =>(
    <Button
        tag={Link}
        to={"/add-vehicle"}
        className="mt-2 mb-2"
        color="success">
      Add a vehicle
    </Button>
)