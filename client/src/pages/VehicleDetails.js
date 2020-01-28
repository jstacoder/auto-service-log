import React from 'react'

export const VehicleDetails = props => {
  const { make, model } = props.location.state;
  return (
      <div>
            <h1>VehicleDetails Page</h1>
            <h2>{make}</h2>
            <h2>{model.name}</h2>
            <h2>{model.year}</h2>
          </div>
  );
}

export default VehicleDetails
