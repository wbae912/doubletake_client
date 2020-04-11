import React, { Component } from 'react';
import List from '../../Components/List/List';
import EventListForm from '../../Components/EventListForm/EventListForm';
import SearchBar from '../SearchBar/SearchBar';
import EventService from '../../Utils/event-service';
import ListContext from '../../Context/ListContext';

export default class EventCheckList extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       formClicked: false
    }
  }

  componentDidMount() {
    EventService.getLists()
      .then(data => {
        this.context.setEventLists(data);
      })
      .catch(res => {
        return this.context.setError(res.error);
      })
  }

  toggleButton = e => {
    this.setState({
      formClicked: true
    })
  }

  handleCancel = e => {
    this.setState({
      formClicked: false
    })
  }

  renderForm = () => {
    if(!this.state.formClicked) {
      return (
        <div className="list-form-div">
          <p className="list-form-p">Create New List</p>
          <button
            type="button" 
            className="list-form-button"
            onClick={this.toggleButton}
          >
          +</button>
        </div>
      )} else {
        return (
          <EventListForm 
            handleCancel={this.handleCancel}
          />
        )}
  }

  render() {
    return (
      <div className="event-lists">
        <p>This will render the event lists on the page</p>
        <SearchBar />
        
        {this.context.eventLists.map(list => 
          <List 
            key={list.id}
            list={list}
          />
        )}

        {this.renderForm()}
        
      </div>
    )
  }
}