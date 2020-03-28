import React, { Component } from 'react';
import EventService from '../../Utils/event-service';
import ListContext from '../../Context/ListContext';
import TokenService from '../../services/token-service';

export default class EventEditForm extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       id: null,
       title: '',
       date_of_event: '',
       city: '',
       state: '',
       country: '',
       weather_summary: '',
       weather_icon: '',
       temperature: null
    }
  }
  
  componentDidMount() {
    const listId = this.props.list.id;
    EventService.getSpecificList(listId)
      .then(data => {
        let date_of_event = new Date(data.date_of_event).toISOString().split('T')[0];

        this.setState({
          id: data.id,
          title: data.title,
          date_of_event,
          city: data.city,
          state: data.state,
          country: data.country,
          weather_summary: data.weather_summary,
          weather_icon: data.weather_icon,
          temperature: data.temperature
        })
      })
  }


  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  /* 
    The convertDate method is specifically to handle the date input during a PATCH request.
    The issue was that when the date edited and submitted, it would render as one day behind. This is due to the timezone vs. UTC issues.
    To resolve this issue, instead of posting the new Date in "YYYY-MM-DD" format, the convertDate method changes the new Date format to "MM-DD-YYYY"
    When input is in this format, it does NOT set the date back one day on submit. This is a strange mechanism with JS date objects.
  */
 convertDate = date => {
  let dateConvert = new Date(date).toISOString().split('T')[0];
  let dateArray = dateConvert.split('-');
  let newDateFormat = `${dateArray[1]}-${dateArray[2]}-${dateArray[0]}`;
  return newDateFormat;
}

  handleSubmit = e => {
    e.preventDefault();

    const city = this.state.city;
    const state = this.state.state;
    const country = this.state.country;

    fetch(`http://localhost:8000/api/weather?city=${city}&state=${state}&country=${country}`, {
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
    .then(res => {
      if(!res.ok) {
        return res.json().then(err => Promise.reject(err));
      }
      return res.json();
    })
    .then(data => {
      let weather_summary = data.currently.summary;
      let weather_icon = data.currently.icon;
      let temperature = data.currently.temperature;

      this.setState({
        weather_summary,
        weather_icon,
        temperature
      })
    
      let date_of_event = this.convertDate(this.state.date_of_event);
      const editList = {...this.state, date_of_event};

      return EventService.editList(this.props.list.id, editList)
        .then(() => {
          const eventLists = [...this.context.eventLists];
          const updatedLists = eventLists.map(list => (list.id === editList.id) ? editList : list);
          this.context.setEventLists(updatedLists);

          this.props.handleCancel(e)
        })
        .catch(res => {
          this.context.setError(res.error);
        })
  })
}

  render() {
    return (
      <div className="event-edit">
        <form className="edit-form" onSubmit={this.handleSubmit}>
          <div className="event-labels-inputs">
              <label className="title-label" htmlFor="list-title">List Name</label>
              <input 
                type="text"
                name="title"
                className="list-title"
                id="list-title"
                required
                value={this.state.title}
                onChange={this.handleChange}
              />
              <label className="date-label" htmlFor="list-date">List Date</label>
              <input 
                type="date"
                name="date_of_event"
                className="list-date"
                id="list-date"
                required
                value={this.state.date_of_event}
                onChange={this.handleChange}
              />
              <label className="location-label" htmlFor="list-city">City</label>
              <input 
                type="text"
                name="city"
                className="list-city"
                id="list-city"
                value={this.state.city}
                onChange={this.handleChange}
              />
              <label className="location-label" htmlFor="list-state">State</label>
              <input 
                type="text"
                name="state"
                className="list-state"
                id="list-state"
                value={this.state.state}
                onChange={this.handleChange}
              />
              <label className="location-label" htmlFor="list-country">Country</label>
              <input 
                type="text"
                name="country"
                className="list-country"
                id="list-country"
                value={this.state.country}
                onChange={this.handleChange}
              />
            </div>
            <div className="event-buttons">
              <button type="submit" className="submit-button">Submit</button>
              <button type="button" className="cancel-button" onClick={this.props.handleCancel}>Cancel</button>
            </div>
        </form>        
      </div>
    )
  }
}


// handleSubmit = e => {
//   e.preventDefault();

//   let date_of_event = this.convertDate(this.state.date_of_event);

//   const editList = {...this.state, date_of_event};
//   EventService.editList(this.props.list.id, editList)
//     .then(() => {
//       const eventLists = [...this.context.eventLists];
//       const updatedLists = eventLists.map(list => (list.id === editList.id) ? editList : list);
//       this.context.setEventLists(updatedLists);

//       this.props.handleCancel(e)
//     })
//     .catch(res => {
//       this.context.setError(res.error);
//     })
// }