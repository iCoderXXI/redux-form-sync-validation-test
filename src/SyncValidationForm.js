import React from 'react'
import { Field, reduxForm } from 'redux-form'


const validateFName = (values = {}, isWarn = false) => {
  let error

  if (!values.fname) {
    if (!isWarn) error = 'Имя является обязательным полем!'
  } else if (values.fname.length > 15) {
    error = 'Имя должно содержать не более 15 символов!'
  } else if (values.fname.toLowerCase().indexOf('аа')> -1) {
    error = 'Имя не может содержать подряд двух букв \'а\'!'
  }

  return error
}


const validateLName = (values = {}, isWarn = false) => {
  let error

  if (!values.lname) {
    if (!isWarn) error = 'Фамилия является обязательным полем!'
  } else if (values.lname.length>15) {
    error = 'Фамилия должна содержать не более 15 символов!'
  } else if (values.lname.split('-').length > 2) {
    error = 'Фамилия не может содержать более одного дефиса!'
  }

  return error
}


const removeUndefinedProps = obj => {
  const ret = Object.assign(obj)
  Object.keys(ret).forEach(function (key) {
    if(typeof ret[key] === 'undefined' || !ret[key]) {
      delete ret[key]
    }
  })
  return ret
}


const validate = values => {
  const ret = removeUndefinedProps({
    fname: validateFName(values),
    lname: validateLName(values)
  })

  return ret
}

const warn = values => {
  const ret = removeUndefinedProps({
    fname: validateFName(values, true),
    lname: validateLName(values, true)
  })

  return ret
}

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} label="Имя" autoComplete="off"/>
      {touched && (error && <span>{error}</span>) || (warning && <span>{warning}</span>)}
    </div>
  </div>
)

const SyncValidationForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit} touchOnChange={true}>
      <Field name="fname" type="text" component={renderField} label="Имя" autoComplete="off"/>
      <Field name="lname" type="text" component={renderField} label="Фамилия" autoComplete="off"/>
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'syncValidation',  // a unique identifier for this form
  validate,                // <--- validation function given to redux-form
  warn                     // <--- warning function given to redux-form
})(SyncValidationForm)
