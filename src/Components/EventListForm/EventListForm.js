import React, { Component } from 'react';
import Modal from 'react-modal';
import EventService from '../../Utils/event-service';
import ListContext from '../../Context/ListContext';
import './EventListForm.css';

Modal.setAppElement('#root');

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
      newEventList.unshift(data);
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
      <Modal
        isOpen={this.props.formClicked}
        onRequestClose={(e) => this.props.handleCancel(e)}
        style={{
          overlay: {
            backdropFilter: 'blur(3px)' 
          },
          content: {
            margin: 0,
            position: 'relative',
            top: '35%',
            bottom: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        <div className="event-form-div">
          <form 
            className="event-form"
            onSubmit={this.handleSubmit}
          >
            <div className="event-labels-inputs">
              <label className="event-label" htmlFor="list-title" id="event-title">List Name<span className="required">*</span></label>
              <input 
                type="text"
                name="title"
                className="event-input"
                id="list-title"
                placeholder="Enter a name"
                required
                onChange={this.handleChange}
              />
              <label className="event-label" htmlFor="list-date">Date of Event<span className="required">*</span></label>
              <input 
                type="date"
                name="date_of_event"
                className="event-input"
                id="list-date"
                placeholder="mm/dd/yyyy"
                required
                onChange={this.handleChange}
              />
              <label className="event-label" htmlFor="list-city">City</label>
              <input 
                type="text"
                name="city"
                className="event-input"
                id="list-city"
                placeholder="E.g. Los Angeles"
                onChange={this.handleChange}
              />
              <label className="event-label" htmlFor="list-state">State</label>
              <input 
                type="text"
                name="state"
                className="event-input"
                id="list-state"
                placeholder="E.g. California"
                onChange={this.handleChange}
              />
              <label className="event-label" htmlFor="list-country">Country</label>
              <input 
                type="text"
                name="country"
                className="event-input"
                id="list-country"
                placeholder="E.g. US"
                onChange={this.handleChange}
              />
            </div>
            <p className="required-p"><span className="required">*</span> = required</p>
            <div className="event-buttons">
              <button type="submit" className="submit-button" id="event-submit">Submit</button>
              <button 
                type="button" 
                className="cancel-button"
                id="event-cancel"
                onClick={this.props.handleCancel}
              >
              Cancel</button>
            </div>
          </form>
        </div>
      </Modal>
    )
  }
}