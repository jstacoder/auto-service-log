import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import PropTypes from 'prop-types'
import { Button, Container, Form, FormGroup, Label } from 'reactstrap'
import { compose } from 'redux'
import { connect, useSelector, useDispatch } from 'react-redux'
import { doSignin } from '../../actions'
import * as actions from '../../actions'
import { useHistory } from 'react-router-dom'

export const SignIn  = props => {
  const history = useHistory()
  const dispatch = useDispatch()

  const errorMessage = useSelector(state=> state.auth.errorMessage)

  const onSubmit = formProps => {
    doSignin(dispatch, formProps, () => {
      history.push('/dashboard');
    })
  }

  const { handleSubmit } = props

  return (
      <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label for="signInEmail">Email</Label>
          <Field 
            className="form-control"
            name="email"
            type="text"
            component="input"
            id="signInEmail"
            placeholder="Enter an email"
            autoComplete="off"
          />
        </FormGroup>
        <FormGroup>
          <Label for="signInPassword">Password</Label>
          <Field 
          className="form-control"
            name="password"
            type="password"
            component="input"
            id="signInPassword" 
            placeholder="Enter a password"
            autoComplete="off"
          />
        </FormGroup>
        <div className="text-right">
          <Button className="mb-2" color="primary">Sign In</Button>
          <p className="text-danger">{errorMessage}</p>
        </div>
    </Form>
      </Container>
    )
}


export default reduxForm({ form: 'signin' })(SignIn)
  // export default compose(
  //   connect(mapStateToProps, actions),
  //   reduxForm({ form: 'signin' })
  // )(SignIn);