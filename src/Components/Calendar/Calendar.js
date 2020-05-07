  
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ListContext from '../../Context/ListContext';
import EventService from '../../Utils/event-service';
import './Calendar.css';

const localizer = momentLocalizer(moment);

class Calender extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       eventLists: [],
       events: []
    }
  }
  
  componentDidMount() {	
    EventService.getLists()
      .then(data => {
        this.setState({
          eventLists: data
        })

        this.formatEventArray();
      })
      .catch(res => {
        this.context.setError(res.error);
      })

      let rbcButtonGroup = document.getElementsByClassName('rbc-btn-group');
      rbcButtonGroup[1].id = 'remove';

      let rbcHeader = document.getElementsByClassName('rbc-header');
      rbcHeader[0].id = "sunday"

      let monthRow = document.getElementsByClassName('rbc-month-row');
      monthRow[5].id = 'last-row';
  }
  
  formatEventArray = () => {
    let eventLists = [...this.state.eventLists];

    let newEvents = eventLists.map(list => {
      return {
        start: new Date(list.date_of_event),
        end: new Date(list.date_of_event),
        title: list.title,
        id: list.id
      }
    })
    this.setState({
      events: [...newEvents]
    })
  }

  handleSelectEvent = e => {
    let path = `/elist/${e.id}`;
    this.props.history.push(path);
  }

  render() {
    return (
      <div className="CalenderContainer">       
        <Calendar
          defaultDate={new Date()}
          defaultView="month"
          showMultiDayTimes
          events={this.state.events}
          onSelectEvent={this.handleSelectEvent}
          localizer={localizer}
          resizable
          style={{ height: '80vh', width: '90%', margin: 'auto' }}
        />
      </div>
    );
  }
}


export default withRouter(Calender);