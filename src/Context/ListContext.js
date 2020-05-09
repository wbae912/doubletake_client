import React, { Component } from 'react';
import TokenService from '../services/token-service';

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
  user: {},
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
  clearError: () => {},
  setUser: () => {},
  processLogin: () => {},
  processLogout: () => {},
});

export default ListContext;

export class ListProvider extends Component {
  constructor(props) {
    super(props)

    const state = {
      generalLists: [],
      eventLists: [],
      specificGeneralList: {},
      specificEventList: {},
      newGeneralList: {},
      newEventList: {},
      generalSearched: false,
      eventSearched: false,
      searchTerm: '',
      error: null,
      user: {},
    }
    
    const jwtPayload = TokenService.parseAuthToken();

    if(jwtPayload) {
      state.user = {
        id: jwtPayload.user_id,
        username: jwtPayload.sub
      }
    }

    this.state = state;
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

  setUser = user => {
    this.setState({user});
  }

  processLogin = () => {
    const jwtPayload = TokenService.parseAuthToken();

    this.setUser({
      id: jwtPayload.user_id,
      username: jwtPayload.sub
    })
  }

  processLogout = () => {
    this.setUser({});
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
      user: this.state.user,
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
      clearError: this.clearError,
      setUser: this.setUser,
      processLogin: this.processLogin,
      processLogout: this.processLogout,
    }
    return (
      <ListContext.Provider value={value}>
        {this.props.children}
      </ListContext.Provider>
    )
  }
}
