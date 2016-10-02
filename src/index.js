import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'

require('es6-promise').polyfill()
require('isomorphic-fetch')

const dest = document.getElementById('content')
const reducer = combineReducers({
  form: reduxFormReducer // mounted under "form"
})
const store =
  (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore)(reducer)


const showResults = values => {

  const checkStatus = response => {
    if (response.status >= 400) {
      throw new Error('Bad response from server')
      //alert(`Yo! Server is not reachable!`)
    }
  }

  const parseJSON = response => {
    let json
    try {
      json = response.json()
    } catch(e) {
      throw e
    }
    return json
  }

  fetch('http://sample.com/api/v3/contact', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: values //JSON.stringify(values)
  })
  .then(checkStatus)
  .then(parseJSON)
  .then({})
  .catch( x => alert(x) )
}

let divStyle = {
  width: '700px',
  border: '1px solid grey',
  borderRadius: '10px',
  margin: '10px',
  boxShadow: '2px 2px 2px black'
}

let render = () => {
  const SyncValidationForm = require('./SyncValidationForm').default
  ReactDOM.render(
    <Provider store={store}>
      <div style={divStyle}>
        <center><h2>Form</h2></center>

        <SyncValidationForm onSubmit={showResults} touchOnChange={true}/>

      </div>

    </Provider>,
    dest
  )
}

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react')
    ReactDOM.render(
      <RedBox error={error} className="redbox"/>,
      dest
    )
  }
  render = () => {
    try {
      renderApp()
    } catch (error) {
      renderError(error)
    }
  }
  const rerender = () => {
    setTimeout(render)
  }
  module.hot.accept('./SyncValidationForm', rerender)
  module.hot.accept('./SyncValidation.md', rerender)
  module.hot.accept('!!raw!./SyncValidationForm', rerender)
}

render()
