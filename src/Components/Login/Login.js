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
       password: '',
       username: ''  
    }
  }

  handleSubmitJwtAuth = e => {
    e.preventDefault();
    const { username, password } = e.target;

    AuthApiService.postLogin({
      username: username.value,
      password: password.value
    })
      .then(res => {
        username.value = '';
        password.value = '';
        TokenService.saveAuthToken(res.authToken);
      })
      .catch(res => {
        return this.context.setError(res.error); // DOUBLE CHECK IF RETURN NEEDS TO BE HERE LATER
      })
  }
  
  render() {
    return (
      <section className="login-section">
        <h2 className="login-header">Login</h2>
        <form className="login-form" onSubmit={this.handleSubmitJwtAuth}>
          <div className="login_labels-inputs">
            <label className="login-label" htmlFor="username">Username</label>
            <input type="text" className="login-input" id="username" />
            <label className="login-label" htmlFor="password">Password</label>
            <input type="password" autoComplete="on" className="login-input" id="password" />
          </div>
          <div className="login_buttons">
            <button type="submit" className="login-button">Login</button>
            <button type="button" className="back-button">Back</button>
          </div>
          <div className="to-register"> 
            <p className="to-register-p">New to DoubleTake?&nbsp;
              <Link to='/register'>Create an account.</Link>
            </p>
          </div>
        </form>
      </section>
    )
  }
}
