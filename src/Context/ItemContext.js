import React, { Component } from 'react';

const ItemContext = React.createContext({
  generalItemsForList: [],
  eventItemsForList: [],
  specificGeneralItem: {},
  specificEventItem: {},
  newGeneralItem: {},
  newEventItem: {},
  error: null
});

export default ItemContext;

export class ItemProvider extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      generalItemsForList: [],
      eventItemsForList: [],
      specificGeneralItem: {},
      specificEventItem: {},
      newGeneralItem: {},
      newEventItem: {},
      error: null
    }
  }

  setGeneralItems = data => {
    this.setState({
      generalItemsForList: data
    })
  }

  setEventItems = data => {
    this.setState({
      eventItemsForList: data
    })
  }

  setSpecificGeneralItem = data => {
    this.setState({
      specificGeneralItem: data
    })
  }

  setSpecficEventItem = data => {
    this.setState({
      specificEventItem: data
    })
  }

  setNewGeneralItem = data => {
    this.setState({
      newGeneralItem: data
    })
  }

  setNewEventItem = data => {
    this.setState({
      newEventItem: data
    })
  }

  setError = error => {
    this.setState({
      error
    })
  }

  cleaError = error => {
    this.setState({
      error: null
    })
  }

  render() {
    const value = {
      generalItemsForList: this.state.generalItemsForList,
      eventItemsForList: this.state.eventItemsForList,
      specificGeneralItem: this.state.specificEventItem,
      specificEventItem: this.state.specificEventItem,
      newGeneralItem: this.state.newGeneralItem,
      newEventItem: this.state.newEventItem,
      error: this.state.error,
      setGeneralItems: this.setGeneralItems,
      setEventItems: this.setEventItems,
      setSpecificGeneralItem: this.setSpecificGeneralItem,
      setSpecficEventItem: this.setSpecficEventItem,
      setNewGeneralItem: this.setNewGeneralItem,
      setNewEventItem: this.setNewEventItem,
      setError: this.setError,
      clearError: this.clearError
    }
    return (
      <ItemContext.Provider value={value}>
        {this.props.children}
      </ItemContext.Provider>
    )
  }
}
