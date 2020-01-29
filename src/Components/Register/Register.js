/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
import FormValidation from '../../Components/FormValidation/FormValidation';
import UserContext from '../../Context/UserContext';
import './Register.css';

export default class Register extends Component {

  static contextType = UserContext;
  
  constructor(props) {
    super(props)
  
    this.state = {
       credentials: {
         email: '',
         username: '',
         password: ''
       },
       passwordVerify: '',
       touched: {
         email: false,
         username: false,
         password: false,
         passwordVerify: false
       }
    };
  }

  handleNonNestedChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleCredentialsChange = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState(prevState => ({
      credentials: {
        ...prevState.credentials,
        [name]: value
      }
    }))
  }

  handleTouchedChange = e => {
    const name = e.target.name;

    this.setState(prevState => ({
      touched: {
        ...prevState.touched,
        [name]: true
      }
    }))
  }

  validateEmail = () => {
    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!EMAIL_REGEX.test(this.state.credentials.email)) {
      return 'Please enter a valid email address';
    }
  }

  validateUsername = () => {
    if(this.state.credentials.username.length === 0) {
      return 'Please enter a username';
    }
  }

  validatePassword = () => {
    const PASSWORD_REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#$@!%&*?])/; // At least one uppercase, lowercase, numerical, AND special character

    if(this.state.credentials.password.length === 0) {
      return 'Please enter a password';
    }
    if(this.state.credentials.password.length < 8 || this.state.credentials.password.length > 72) {
      return 'Password must be between 8 and 72 characters'
    }
    if(!PASSWORD_REGEX.test(this.state.credentials.password)) {
      return 'Password must contain at least one uppercase, lowercase, numerical, and special character';
    }
  }

  validatePasswordVerify = () => {
    if(this.state.credentials.password !== this.state.passwordVerify) {
      return 'Passwords do not match';
    }
  }
  
  handleSubmit = e => {
    e.preventDefault();
    const credentials = this.state.credentials;

    fetch('http://localhost:8000/api/user/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    .then(res => {
      if(!res.ok) {
        return res.json().then(err => Promise.reject(err));
      }
      return res.json();
    })
    .then(() => {
      this.props.history.push('/login');
    })
    .catch(res => {
      this.context.setError(res.error); // DOUBLE CHECK IF RETURN NEEDS TO BE HERE
    })
  }

  render() {
    let emailError = this.validateEmail();
    let usernameError = this.validateUsername();
    let passwordError = this.validatePassword();
    let passwordVerifyError = this.validatePasswordVerify();

    return (
      <section className="register-section">
        <h2 className="register-h2">Register</h2>
        <form className="register-form" onSubmit={this.handleSubmit}>
          <div className="register_inputs-labels">
            <label className="register-label" htmlFor="email">Email</label>
            <input 
              type="email" 
              name="email"
              className="register-input" 
              id="email" 
              placeholder="example@email.com"
              required
              onChange={(e) => {this.handleCredentialsChange(e); this.handleTouchedChange(e);}}
            />
            {this.state.touched.email && <FormValidation message={emailError} />}
            <label className="register-label" htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              className="register-input"
              id="username"
              placeholder="user123"
              required
              onChange={(e) => {this.handleCredentialsChange(e); this.handleTouchedChange(e)}}
            />
            {this.state.touched.username && <FormValidation message={usernameError} />}
            <label className="register-label" htmlFor="password">Password</label>
            <input 
              type="password"
              name="password"
              className="register-input"
              id="password"
              autoComplete="off"
              required
              onChange={(e) => {this.handleCredentialsChange(e); this.handleTouchedChange(e); this.validatePassword();}}
            />
            {this.state.touched.password && <FormValidation message={passwordError} />}
            <label className="register-label" htmlFor="password-again">Re-Enter Password</label>
            <input 
              type="password"
              name="passwordVerify"
              className="register-input" 
              id="password-again"
              autoComplete="off"
              required
              onChange={(e) => {this.handleNonNestedChange(e); this.handleTouchedChange(e)}}
            />
            {this.state.touched.passwordVerify && <FormValidation message={passwordVerifyError} />}
          </div>
          <div className="register-buttons">
            <button type="submit" className="register-button" disabled={emailError || usernameError || passwordError || passwordVerifyError}>Register</button>
            <button type="button" className="back-button">Back</button>
          </div>
        </form>
      </section>
    )
  }
}