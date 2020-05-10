import React, { Component } from 'react';
import LoaderSpinner from '../LoaderSpinner/LoaderSpinner';
import TokenService from '../../services/token-service';
import ListContext from '../../Context/ListContext';
import './Weather.css';

export default class Weather extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       weather_main: '',
       weather_description: '',
       weather_icon: '',
       fahrenheit: null,
       celsius: null,
       fahrenheitDisplay: true,
       celsiusDisplay: false,
       loading: false,
       error: null
    }
  }
  
  componentDidMount() {
    this.setState({
      loading: true
    })

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
      let fahrenheit = data.main.temp;
      fahrenheit = fahrenheit.toFixed(1);

      let celsius = (fahrenheit - 32) * (5/9);
      celsius = celsius.toFixed(1);

      this.setState({
        weather_main: data.weather[0].main,
        weather_description: data.weather[0].description,
        weather_icon: data.weather[0].icon,
        fahrenheit,
        celsius,
        loading: false
      })
    })
    .catch(res => {
      this.setState({
        error: res.error,
        loading: false
      })
    })
  }

  convertFahrenheit = () => {
    this.setState({
      fahrenheitDisplay: true,
      celsiusDisplay: false
    })
  }

  convertCelsius = () => {    
    this.setState({
      celsiusDisplay: true,
      fahrenheitDisplay: false
    })
  }

  renderTemperature = () => {
    if(this.state.fahrenheit && this.state.fahrenheitDisplay) {
      return (
        <div className="temperature-div" aria-live="polite">
          <h2 className="temperature-h2">{this.state.fahrenheit}
            <span className="temp-degree">&#176;</span>
            <span className="temp-notation">F</span>
          </h2>
          <div className="weather-button-div">
            <button 
                className="fahrenheit-button"
                onClick={() => this.convertFahrenheit()}
            >
              <span className="temp-degree" id="f-button">&#176;</span>
              <span className="temp-notation" id="f-button">F</span>
            </button>
            <button 
              className="celsius-button"
              onClick={() => this.convertCelsius()}
            >
              <span className="temp-degree" id="c-button">&#176;</span>
              <span className="temp-notation" id="c-button">C</span>
            </button>
          </div>
        </div>
      )
    } else if(this.state.celsius && this.state.celsiusDisplay) {
      return (
        <div className="temperature-div" aria-live="polite">
          <h2 className="temperature-h2">{this.state.celsius}
            <span className="temp-degree">&#176;</span>
            <span className="temp-notation">C</span>
          </h2>
          <div className="weather-button-div">
            <button 
              className="fahrenheit-button"
              onClick={() => this.convertFahrenheit()}
            >
              <span className="temp-degree" id="f-button">&#176;</span>
              <span className="temp-notation" id="f-button">F</span>
            </button>
            <button 
              className="celsius-button"
              onClick={() => this.convertCelsius()}
            >
              <span className="temp-degree" id="c-button">&#176;</span>
              <span className="temp-notation" id="c-button">C</span>
            </button>
          </div>
        </div>
      )
    }
  }

  renderLoaderOrContent = () => {
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

    let weatherIconCode = this.state.weather_icon;
    let weatherIconImage = `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

    if(this.state.loading) {
      return (
        <>
          <LoaderSpinner />
        </>
      )
    } else {
      return (
        <>

          {(location === '') 
            ? <>
                <h3 className="location-h3" aria-live="polite">Location: N/A</h3>
              </>
            :
              <>
                <h3 className="location-h3">{location}</h3>
                <div className="weather-flex-main">
                  <div className="weather-summary-div">
                    <p className="weather-main-p">{this.state.weather_main}</p>
                    <img src={weatherIconImage} alt="weather-icon" id="weather-icon"></img>
                  </div>
                  {this.renderTemperature()}
                </div>
              </>
          }
        </>
      )
    }
  }
  
  render() {
    return (
      <div className="weather-div">

        {this.renderLoaderOrContent()}

      </div>
    )
  }
}