import React, { Component } from 'react';
import TokenService from '../../services/token-service';
import ListContext from '../../Context/ListContext';

export default class Weather extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       weather_main: '',
       weather_description: '',
       weather_icon: '',
       temperature: null
    }
  }
  
  componentDidMount() {
    let city = this.props.list.city;
    let state = this.props.list.state;
    let country = this.props.list.country;

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
      this.setState({
        weather_main: data.weather[0].main,
        weather_description: data.weather[0].description,
        weather_icon: data.weather[0].icon,
        temperature: data.main.temp
      })
    })
    .catch(res => {
      this.context.setError(res.error);
    })
  }
  
  render() {
    let city = this.props.list.city;
    let state = this.props.list.state;

    let country = this.props.list.country.toLowerCase();
    if(country === 'united states' || country === 'united states of america' || country === 'united states america' || country === 'us' || country === 'u.s.' || country === 'u.s.a' || country === 'usa') {
      country = 'US';
    }

    let location = '';
    if(!state) {
      location = `${city}, ${country}` 
    } else {
      location = `${city}, ${state}, ${country}`;
    }

    if(!city && !state && !country) {
      location = '';
    }

    return (
      <div className="weather-div">
        <h3 className="location-h3">{location}</h3>
        <p className="weather-main-p">{this.state.weather_main}</p>
        <p className="weather-description-p">{this.state.weather_description}</p>
        <p className="weather-icon-p">{this.state.weather_icon}</p>
        {this.state.temperature && <p className="temperature-p">{this.state.temperature}&#176;F</p>}
      </div>
    )
  }
}
