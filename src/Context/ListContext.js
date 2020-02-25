import React, { Component } from 'react';

const ListContext = React.createContext({
  generalLists: [],
  eventLists: [],
  specificGeneralList: {}, // Response from GET request (':/id' endpoint)
  specificEventList: {}, // Response from GET request (':/id' endpoint) 
  newGeneralList: {}, // Response from POST request
  newEventList: {}, // Response from POST request
  error: null,
  setGeneralLists: () => {},
  setEventLists: () => {},
  setSpecificGeneralList: () => {},
  setSpecificEventList: () => {},
  setNewGeneralList: () => {},
  setNewEventList: () => {},
  setError: () => {},
  clearError: () => {}
});

export default ListContext;

export class ListProvider extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       generalLists: [],
       eventLists: [],
       specificGeneralList: {}, // Response from GET request (':/id' endpoint)
       specificEventList: {}, // Response from GET request (':/id' endpoint)
       newGeneralList: {}, // Response from POST request
       newEventList: {}, // Response from POST request,
       error: null
    }
  }

  setGeneralLists = data => {
    this.setState({
      generalLists: data
    })
  }

  setEventLists = data => {
    this.setState({
      eventLists: data
    })
  }

  setSpecificGeneralList = data => {
    this.setState({
      specificGeneralList: data
    })
  }

  setSpecificEventList = data => {
    this.setState({
      specificEventList: data 
    })
  }

  setNewGeneralList = data => {
    this.setState({
      newGeneralList: data
    })
  }

  setNewEventList = data => {
    this.setState({
      newEventList: data
    })
  }

  setError = error => {
    this.setState({
      error
    })
  }

  clearError = () => {
    this.setState({
      error: null
    })
  }
  
  render() {
    const value = {
      generalLists: this.state.generalLists,
      eventLists: this.state.eventLists,
      specificGeneralList: this.state.specificGeneralList, 
      specificEventList: this.state.specificEventList,
      newGeneralList: this.state.newGeneralList,
      newEventList: this.state.newEventList,
      error: this.state.error,
      setGeneralLists: this.setGeneralLists,
      setEventLists: this.setEventLists,
      setSpecificGeneralList: this.setSpecificGeneralList,
      setSpecificEventList: this.setSpecificEventList,
      setNewGeneralList: this.setNewGeneralList,
      setNewEventList: this.setNewEventList,
      setError: this.setError,
      clearError: this.clearError
    }
    return (
      <ListContext.Provider value={value}>
        {this.props.children}
      </ListContext.Provider>
    )
  }
}
