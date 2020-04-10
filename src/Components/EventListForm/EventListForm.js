import React, { Component } from 'react';
import EventService from '../../Utils/event-service';
import ListContext from '../../Context/ListContext';

export default class EventListForm extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       title: '',
       date_of_event: '',
       city: '',
       state: '',
       country: ''
    }
  }
  
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault();

    const newList = {...this.state};

    EventService.postList(newList)
    .then(data => {
      this.context.setNewEventList(data);

      /* This step is performed so that an immediate re-render is triggered when a new list is POSTed. Without this, the re-render and new list would not appear on page
        until a page refresh is performed. */
      const newEventList = [...this.context.eventLists];
      newEventList.push(data);
      this.context.setEventLists(newEventList);

      this.props.handleCancel(e);
    })
    .catch(res => {
      this.context.setError(res.error);
    })
    // Resets the values of the input fields after Submit
    e.target.title.value = '';
  }

  render() {
    return (
      <div className="event-form-div">
        <h2 className="event-form-h2">Create List</h2>
        <form 
          className="event-form"
          onSubmit={this.handleSubmit}
        >
          <div className="event-labels-inputs">
            <label className="title-label" htmlFor="list-title">List Name</label>
            <input 
              type="text"
              name="title"
              className="list-title"
              id="list-title"
              required
              onChange={this.handleChange}
            />
            <label className="date-label" htmlFor="list-date">List Date</label>
            <input 
              type="date"
              name="date_of_event"
              className="list-date"
              id="list-date"
              required
              onChange={this.handleChange}
            />
            <label className="location-label" htmlFor="list-city">City</label>
            <input 
              type="text"
              name="city"
              className="list-city"
              id="list-city"
              onChange={this.handleChange}
            />
            <label className="location-label" htmlFor="list-state">State</label>
            <input 
              type="text"
              name="state"
              className="list-state"
              id="list-state"
              onChange={this.handleChange}
            />
            <label className="location-label" htmlFor="list-country">Country</label>
            <input 
              type="text"
              name="country"
              className="list-country"
              id="list-country"
              onChange={this.handleChange}
            />
          </div>
          <div className="event-buttons">
            <button type="submit" className="submit-button">Submit</button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={this.props.handleCancel}
            >
            Cancel</button>
          </div>
        </form>
      </div>
    )
  }
}