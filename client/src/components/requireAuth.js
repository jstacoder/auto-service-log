import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default ChildComponent => props => {
  const auth = useSelector(state => state.auth.authenticated)
  const history = useHistory()

  useEffect(() => {
    // Our component just got rendered
    shouldNavigateAway();
  }, [])

  useEffect(() => {
    // Our component just got updated
    shouldNavigateAway();
  }, [props, auth])

  const shouldNavigateAway = () => {
    if (!auth) {
      history.push('/')
    }
  }

  return <ChildComponent {...props} />
}
