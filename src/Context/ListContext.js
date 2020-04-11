import React, { Component } from 'react';

const ListContext = React.createContext({
  generalLists: [],
  eventLists: [],
  specificGeneralList: {}, // Response from GET request (':/id' endpoint) AND/OR GET request ('/search' endpoint)
  specificEventList: {}, // Response from GET request (':/id' endpoint) AND/OR GET request ('/search' endpoint)
  newGeneralList: {}, // Response from POST request
  newEventList: {}, // Response from POST request,
  generalSearched: false,
  eventSearched: false,
  searchTerm: '',
  error: null,
  setGeneralLists: () => {},
  setEventLists: () => {},
  setSpecificGeneralList: () => {},
  setSpecificEventList: () => {},
  setNewGeneralList: () => {},
  setNewEventList: () => {},
  setGeneralSearched: () => {},
  setEventSearched: () => {},
  setSearchTerm: () => {},
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
       generalSearched: false,
       eventSearched: false,
       searchTerm: '',
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

  setGeneralSearchedToTrue = () => {
    this.setState({
      generalSearched: true
    })
  }

  setEventSearchedToTrue = () => {
    this.setState({
      eventSearched: true
    })
  }

  setGeneralSearchedToFalse = () => {
    this.setState({
      generalSearched: false
    })
  }

  setEventSearchedToFalse = () => {
    this.setState({
      eventSearched: false
    })
  }

  setSearchTerm = searchTerm => {
    this.setState({
      searchTerm
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
      generalSearched: this.state.generalSearched,
      eventSearched: this.state.eventSearched,
      searchTerm: this.state.searchTerm,
      error: this.state.error,
      setGeneralLists: this.setGeneralLists,
      setEventLists: this.setEventLists,
      setSpecificGeneralList: this.setSpecificGeneralList,
      setSpecificEventList: this.setSpecificEventList,
      setNewGeneralList: this.setNewGeneralList,
      setNewEventList: this.setNewEventList,
      setGeneralSearchedToTrue: this.setGeneralSearchedToTrue,
      setEventSearchedToTrue: this.setEventSearchedToTrue,
      setGeneralSearchedToFalse: this.setGeneralSearchedToFalse,
      setEventSearchedToFalse: this.setEventSearchedToFalse,
      setSearchTerm: this.setSearchTerm,
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
