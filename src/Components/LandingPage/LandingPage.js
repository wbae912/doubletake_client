import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import generalimg from '../../images/GeneralList.PNG';
import eventimg from '../../images/EventList.PNG';
import calendarimg from '../../images/Calendar.PNG';
import './LandingPage.css';

export default class LandingPage extends Component {
  render() {
    return (
      <>
        <section className="landing-page">
          <div className="landing-page-headings">
            <h2 id="app-name">Doubletake</h2>
            <h3 id="tagline">Double back and keep track.</h3>
          </div>
          <Link to="/register" className="landing-signup-a">Sign up</Link>
          <a href="#about-container" className="landing-to-about">
            <FontAwesomeIcon icon={faAngleDoubleDown} id="icon" />
          </a>
        </section>

        <section id="filler"></section>

        <section id="about-container">
          <div className="about-div">
            <p className="about-description">
              Doubletake is an item manager customized for your personal use.
              Need to remember what items to bring on a camping trip? Or, perhaps
              you need a general list of items to bring to school. Create different
              lists that suit your needs and add items to each. Check the items off as 
              you pack your belongings, and you're good to go!
            </p>
          </div>
        </section>

        <hr className="landing-underline" />

        <section className="feature-section">
          <div className="feature-div">
            <img alt="home-page" src={calendarimg} />
            <div className="feature-description">
              <h2 className="feature-title">Home Dashboard</h2>
              <p className="feature-p">
                See your upcoming events on the calendar or scan for a particular list. Receive alerts if there
                are any events coming up within the next 7 days.
              </p>
            </div>
          </div>

          <hr className="landing-underline" />

          <div className="feature-div">
            <img alt="general-list" src={generalimg} />
            <div className="feature-description">
              <h2 className="feature-title">General Lists</h2>
              <p className="feature-p">
                View all your general lists. These lists are meant to be used on
                a regular basis. Mark items off, edit items, or alter the quantity as needed.
              </p>
            </div>
          </div>

          <hr className="landing-underline" />

          <div className="feature-div" id="last-feature">
            <img alt="event-list" src={eventimg} />
            <div className="feature-description">
              <h2 className="feature-title">Event Lists</h2>
              <p className="feature-p">
                View all your event lists. These lists are typically used for specific occasions or
                one-off instances. Add the date of the event, and optionally, the location.
              </p>
            </div>
          </div>
        </section>

        <div className="landing-page-bg"></div>
      </>
    );
  }
}