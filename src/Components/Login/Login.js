import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TokenService from '../../services/token-service';
import AuthApiService from '../../services/auth-api-service';
import UserContext from '../../Context/UserContext';
import './Login.css';

export default class Login extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props)
  
    this.state = {
      credentials: {
        username: '',
        password: ''
      }
    }
  }

  handleInputChange = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState(prevState => ({
      credentials: {
        ...prevState.credentials,
        [name]: value
      }
    }))
  }

  handleSubmitJwtAuth = e => {
    e.preventDefault();
    const { username, password } = e.target;

    AuthApiService.postLogin(this.state.credentials)
      .then(res => {
        username.value = '';
        password.value = '';
        TokenService.saveAuthToken(res.authToken);
        // Do a this.props.history.push to PAGE WE WANT USER TO BE DIRECTED TO UPON SUCCESSFUL LOGIN...USE withROUTER
      })
      .catch(res => {
        return this.context.setError(res.error); // DOUBLE CHECK IF RETURN NEEDS TO BE HERE LATER
      })
  }
  
  render() {
    return (
      <section className="login-section">
        <div className="header-div">
          <h2 className="login-header">Doubletake</h2>
        </div>
        <form className="login-form" onSubmit={this.handleSubmitJwtAuth}>
          <div className="login_labels-inputs">
            <label className="login-label" htmlFor="username">Username</label>
            <input 
              type="text" 
              name="username"
              className="login-input" 
              id="login-username" 
              onChange={this.handleInputChange}
            />
            <label className="login-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              name="password"
              autoComplete="on" 
              className="login-input" 
              id="password-login" 
              onChange={this.handleInputChange}
            />
          </div>
          <div className="to-register"> 
            <p className="to-register-p">New to DoubleTake?&nbsp;
              <Link to='/register'>Create an account.</Link>
            </p>
          </div>
          <div className="login-buttons">
            <button type="submit" className="login-button">LOGIN ></button>
            {/* <button type="button" className="back-button">Back</button> */}
          </div>
        </form>
      </section>
    )
  }
}
