import React from 'react'

export const VehicleDetails = props => {
  const { make, model, year } = props.location.state;
  return (
      <div>
            <h1>VehicleDetails Page</h1>
            <h2>{make}</h2>
            <h2>{model}</h2>
            <h2>{year}</h2>
          </div>
  );
}

export default VehicleDetails
