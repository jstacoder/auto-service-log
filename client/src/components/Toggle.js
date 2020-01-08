import React, { useState, useEffect, createContext, useContext } from "react";

export const ToggleContext = createContext({on: false, off: true, toggle: ()=> {}})

export const ToggleContextProvider = ({children})=>{
  const [on, setOn] = useState(false)
  const [off, setOff] = useState(true)

  const toggle = () =>{
    setOn(oldOn => !oldOn)
    setOff(oldOff => !oldOff)
  }

  const value = {
    on,
    off,
    toggle,
  }
  return (
      <ToggleContext.Provider value={value}>
        {children}
      </ToggleContext.Provider>
  )
}

export const Toggle = ({children, ...props}) => {
  const { on, off, toggle } = useContext(ToggleContext)

  return (
      children({on, off, toggle})
  )
}

export default Toggle
