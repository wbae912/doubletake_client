import React, { Component } from 'react';
import ListContext from '../../Context/ListContext';
import EventService from '../../Utils/event-service';
import GeneralService from '../../Utils/general-service';
import './Home.css';

export default class Home extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       generalLists: [],
       eventLists: [],
       upcomingList: {},
       smallestDate: null
    }
  }

  componentDidMount() {    
    GeneralService.getLists()
      .then(data => {
        this.setState({
          generalLists: data
        })
      })
      .catch(res => {
        return this.context.setError(res.error);
      })

    EventService.getLists()
    .then(data => {
      let eventLists = [...data];
      
      let smallestDate = Infinity;
      let index = 0;
      for(let i = 0; i < eventLists.length; i++) {
        let today = new Date();
        let date = new Date(eventLists[i].date_of_event);

        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if(diffDays >= 0 && diffDays < smallestDate) {
          smallestDate = diffDays;
          index = i;
        }
      }

      let upcomingList = eventLists[index] || {};

      this.setState({
        eventLists: data,
        upcomingList,
        smallestDate
      })

      this.renderAlert();
    })
    .catch(res => {
      return this.context.setError(res.error);
    })
  }

  renderAlert = () => {
    let alerted = sessionStorage.getItem('alerted') || false;
    if(!alerted) {
      if(this.state.smallestDate === 0) {
        alert(`Event: "${this.state.upcomingList.title}" is today!`)
      }
      if(this.state.smallestDate <= 7 && this.state.smallestDate !== 0) {
        alert(`There is ${this.state.smallestDate} day(s) remaining until Event: "${this.state.upcomingList.title}"`)
      }
      sessionStorage.setItem('alerted', true);
    }
  }
  
  render() {
    let generalLists = [...this.state.generalLists];
    let eventLists = [...this.state.eventLists];

    let upcomingDate = new Date(this.state.upcomingList.date_of_event).toLocaleString();
    let dateArray = upcomingDate.split(',');

    let date = (dateArray[0] === 'Invalid Date') ? 'Loading...' : dateArray[0];

    return (
      <div className="home-div">
        <div className="upcoming-event-div">
          <h2 className="upcoming-h2">Upcoming Event</h2>
        </div>
        <div id="container">
          <div className="upcoming-div">
            <div id="upcoming-container">
              <p className="upcoming-title">{this.state.upcomingList.title}</p>
              <p className="upcoming-date">{date}</p>
            </div>
            <div id="upcoming-goto">
              <p className="go-to">>></p>
            </div>
          </div>
        </div>
        <div className="general-home-div">
          <h2 className="general-home-h2">General</h2>

          <ul className="general-ul">
            {(generalLists.length === 0)
              ? <li className="loading-li">Loading...</li>
              : generalLists.map(list => 
              <li key={list.id} className="general-li">{list.title}</li>  
            )}
          </ul>

        </div>
        <div className="event-home-div">
          <h2 className="event-home-h2">Events</h2>

          <ul className="event-ul">
            {(eventLists.length === 0)
              ? <li className="loading-li">Loading...</li>
              : eventLists.map(list => 
              <li key={list.id} className="event-li">{list.title}</li> 
            )}
          </ul>

        </div>
      </div>
    )
  }
}