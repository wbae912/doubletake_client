import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Calendar from '../Calendar/Calendar';
import ListContext from '../../Context/ListContext';
import EventService from '../../Utils/event-service';
import GeneralService from '../../Utils/general-service';
import TokenService from '../../services/token-service';
import './Home.css';

class Home extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       generalLists: [],
       eventLists: [],
       upcomingList: {},
       smallestDate: null,
       loading: false,
       error: null
    }
  }

  componentDidMount() {
    this.setState({
      loading: true
    })

    if(TokenService.getAuthToken()) {
      this.props.callbackFromParent(true);
    }

    GeneralService.getLists()
      .then(data => {
        this.setState({
          generalLists: data,
          loading: false
        })
      })
      .catch(res => {
        this.setState({
          error: res.error,
          loading: false
        })
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
      this.setState({
        error: res.error
      })    
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

  handleGeneralClick = e => {
    let elementId = e.target.id;
    this.props.history.push(`/glist/${elementId}`);
  }

  handleEventClick = e => {
    let elementId = e.target.id;
    this.props.history.push(`/elist/${elementId}`);
  }

  renderUpcomingEvent = () => {
    let dateOfEvent = new Date(this.state.upcomingList.date_of_event);
    let todayDate = new Date();

    let dateAltered = new Date(this.state.upcomingList.date_of_event);
    dateAltered.setDate(dateAltered.getDate() + 1);

    let datePlusOne = dateAltered.toLocaleString();
    let dateArray = datePlusOne.split(',');

    let date = '';
    let upcomingTitle = '';

    if(this.state.loading) {
      date = 'Loading';
    }
    if(!this.state.loading && !this.state.upcomingList.date_of_event) {
      date = '';
    }
    if(!this.state.loading && this.state.upcomingList.date_of_event) {
      date = dateArray[0];
    }

    if(this.state.loading) {
      upcomingTitle = 'Loading';
    }
    if(!this.state.loading && !this.state.upcomingList.title) {
      upcomingTitle = 'N/A';
    }
    if(!this.state.loading && this.state.upcomingList.title) {
      upcomingTitle = this.state.upcomingList.title;
    }

    if(todayDate.getTime() > dateOfEvent.getTime()) {
      return (
        <div id="container" aria-live="polite">
          <p className="no-event">No Upcoming Event</p>
        </div>
      )
    } else {
      return (
        <div id="container" aria-live="polite">
          <div className="upcoming-div" id={this.state.upcomingList.id} onClick={this.handleEventClick}>
            <div id="upcoming-container">
              <p className="upcoming-title" id={this.state.upcomingList.id} onClick={this.handleEventClick}>{upcomingTitle}</p>
              <p className="upcoming-date" id={this.state.upcomingList.id} onClick={this.handleEventClick}>{date}</p>
            </div>
            <div id="upcoming-goto">
              <p className="go-to" id={this.state.upcomingList.id} onClick={this.handleEventClick}>>></p>
            </div>
          </div>
        </div>
      )
    }
  }
  
  render() {
    let generalLists = [...this.state.generalLists];

    let generalText = '';

    if(this.state.loading) {
      generalText = 'Loading...';
    }
    if(!this.state.loading && generalLists.length === 0) {
      generalText = 'N/A';
    }

    return (
      <div className="home-div">
        <div className="upcoming-general-container">

          <div id="upcoming-home-div">
            <div className="upcoming-event-div">
              <h2 className="upcoming-h2">Upcoming Event</h2>
            </div>
            {this.renderUpcomingEvent()}
          </div>

          <div className="general-home-div">
            <div className="title-div-general">
              <h2 className="general-home-h2">General</h2>
            </div>
            <ul className="general-ul">
              {(generalLists.length === 0)
                ? <li className="loading-li" aria-live="polite">{generalText}</li>
                : generalLists.map(list =>
                <div key={list.id} className="li-div" id={list.id} aria-live="polite" onClick={this.handleGeneralClick}>
                  <li className="general-li" id={list.id} onClick={this.handleGeneralClick}>{list.title}</li>
                  <p className="go-to-general" id={list.id} onClick={this.handleGeneralClick}>>></p>
                </div>
              )}
            </ul>
          </div>

        </div>

        <div className="event-home-div">
          <div className="title-div-event">
            <h2 className="event-home-h2">Events</h2>
          </div>
          <Calendar />
        </div>

      </div>
    )
  }
}

export default withRouter(Home);