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
       temperature: null,
       fahrenheitDisplay: true,
       celsiusDisplay: false
    }
  }
  
  componentDidMount() {
    fetch(`http://localhost:8000/api/weather?city=${this.props.list.city}&state=${this.props.list.state}&country=${this.props.list.country}`, {
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
      let temperature = data.main.temp;
      temperature = temperature.toFixed(1);

      this.setState({
        weather_main: data.weather[0].main,
        weather_description: data.weather[0].description,
        weather_icon: data.weather[0].icon,
        temperature
      })
    })
    .catch(res => {
      this.context.setError(res.error);
    })
  }

  convertFahrenheit = temperature => {
    if(this.state.celsiusDisplay) {
      let fahrenheit = temperature * (9/5) + 32;
      fahrenheit = fahrenheit.toFixed(1);

      this.setState({
        temperature: fahrenheit,
        fahrenheitDisplay: true,
        celsiusDisplay: false
      })
    }
  }

  convertCelsius = temperature => {
    let celsius = (temperature - 32) * (5/9);
    celsius = celsius.toFixed(1);
    
    this.setState({
      temperature: celsius,
      celsiusDisplay: true,
      fahrenheitDisplay: false
    })
  }

  renderTemperature = () => {
    if(this.state.temperature && this.state.fahrenheitDisplay) {
      return (
        <p className="temperature-p">{this.state.temperature}&#176;F</p>
      )
    } else if(this.state.temperature && this.state.celsiusDisplay) {
      return (
        <p className="temperature-p">{this.state.temperature}&#176;C</p>
      )
    }
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
        {this.renderTemperature()}

        <button 
          className="fahrenheit-button"
          onClick={() => this.convertFahrenheit(this.state.temperature)}
        >&#176;F</button>
        <button 
          className="celsius-button"
          onClick={() => this.convertCelsius(this.state.temperature)}
        >&#176;C</button>
      </div>
    )
  }
}
