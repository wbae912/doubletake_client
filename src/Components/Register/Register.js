/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
import Modal from 'react-modal';
import LoaderSpinner from '../LoaderSpinner/LoaderSpinner';
import FormValidation from '../../Components/FormValidation/FormValidation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Register.css';

Modal.setAppElement('#root');

export default class Register extends Component {  
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
         passwordVerify: false,
       },
       showPassword: false,
       error: null,
       loading: false
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

  toggleShowPassword = e => {
    this.setState({
      showPassword: !this.state.showPassword
    })
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

    this.setState({
      loading: true
    })

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
      this.setState({
        loading: false
      })
      this.props.history.push('/login');
    })
    .catch(res => {
      this.setState({
        error: res.error,
        loading: false
      })
    })


  }

  renderShowPassword = () => {
    if(this.state.showPassword) {
      return (
      <>
        <FontAwesomeIcon icon={faEyeSlash} aria-live="polite" id="hide-icon" onClick={this.toggleShowPassword} />
        <span className="show-span" onClick={this.toggleShowPassword}>Hide Password</span>
      </>
      )
    } else {
      return (
        <>
          <FontAwesomeIcon icon={faEye} aria-live="polite" id="show-icon" onClick={this.toggleShowPassword} />
          <span className="show-span" onClick={this.toggleShowPassword}>Show Password</span>
        </>
      )
    }
  }

  renderCheckmark = () => {
    if(!this.validatePassword()) {
      return (
        <>
          <span className="password-good" aria-live="polite">&#10004;</span>
        </>
      )
    }
  }

  renderCheckmarkAgain = () => {
    if(this.state.credentials.password === this.state.passwordVerify && this.state.credentials.password) {
      return (
        <>
          <span className="password-good" aria-live="polite">&#10004;</span>
        </>
      )
    }
  }

  renderLoader = () => {
    if(this.state.loading) {
      return (
        <div className="load-div">
          <Modal
            isOpen={this.state.loading}
            style={{
              overlay: {
                backdropFilter: 'blur(3px)' 
              },
              content: {
                margin: 0,
                width: '100px',
                backgroundColor: 'transparent',
                border: 'none',
                position: 'relative',
                top: '40%',
                bottom: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }
            }}
          >
            <LoaderSpinner />
          </Modal>
        </div>
      )
    }
  }

  render() {
    let emailError = this.validateEmail();
    let usernameError = this.validateUsername();
    let passwordError = this.validatePassword();
    let passwordVerifyError = this.validatePasswordVerify();

    return (
      <div className="login-register-div">
        <div className="top-div-register">
          {this.state.error && <p className='red'>{this.state.error}</p>}
        </div>
        <section className="register-section">
          <div className="header-div">
            <h2 className="register-h2">Doubletake</h2>
          </div>
          <form className="register-form" onSubmit={this.handleSubmit} autoComplete="off">
          {!this.state.showPassword 
          ? <div className="register_inputs-labels" aria-live="polite">
              <label className="register-label" htmlFor="email">Email</label>
              <input 
                type="email" 
                name="email"
                className="register-input" 
                id="email" 
                placeholder="example@email.com"
                aria-required="true"
                aria-invalid="true"
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
                aria-required="true"
                aria-invalid="true"
                required
                onChange={(e) => {this.handleCredentialsChange(e); this.handleTouchedChange(e)}}
              />
              {this.state.touched.username && <FormValidation message={usernameError} />}
              <label className="register-label" htmlFor="password">Password</label>
              <div className="password-div">
                <input 
                  type="password"
                  name="password"
                  className="register-input password-test"
                  id="password"
                  aria-required="true"
                  aria-invalid="true"
                  required
                  onChange={(e) => {this.handleCredentialsChange(e); this.handleTouchedChange(e); this.validatePassword();}}
                />
                {this.renderCheckmark()}
              </div>
              {this.state.touched.password && <FormValidation message={passwordError} />}
              <label className="register-label" htmlFor="password-again">Re-Enter Password</label>
              <div className="password-div">
                <input 
                  type="password"
                  name="passwordVerify"
                  className="register-input" 
                  id="password-again"
                  aria-required="true"
                  aria-invalid="true"
                  required
                  onChange={(e) => {this.handleNonNestedChange(e); this.handleTouchedChange(e)}}
                />
                {this.renderCheckmarkAgain()}
              </div>
              {this.state.touched.passwordVerify && <FormValidation message={passwordVerifyError} />}
            </div>
          : <div className="register_inputs-labels" aria-live="polite">
            <label className="register-label" htmlFor="email">Email</label>
            <input 
              type="email" 
              name="email"
              className="register-input" 
              id="email" 
              placeholder="example@email.com"
              aria-required="true"
              aria-invalid="true"
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
              aria-required="true"
              aria-invalid="true"
              required
              onChange={(e) => {this.handleCredentialsChange(e); this.handleTouchedChange(e)}}
            />
            {this.state.touched.username && <FormValidation message={usernameError} />}
            <label className="register-label" htmlFor="password">Password</label>
            <div className="password-div">
              <input 
                type="text"
                name="password"
                className="register-input"
                id="password"
                aria-required="true"
                aria-invalid="true"
                required
                onChange={(e) => {this.handleCredentialsChange(e); this.handleTouchedChange(e); this.validatePassword();}}
              />
              {this.renderCheckmark()}
            </div>
            {this.state.touched.password && <FormValidation message={passwordError} />}
            <label className="register-label" htmlFor="password-again">Re-Enter Password</label>
            <div className="password-div">
              <input 
                type="text"
                name="passwordVerify"
                className="register-input" 
                id="password-again"
                aria-required="true"
                aria-invalid="true"
                required
                onChange={(e) => {this.handleNonNestedChange(e); this.handleTouchedChange(e)}}
              />
              {this.renderCheckmarkAgain()}
            </div>
            {this.state.touched.passwordVerify && <FormValidation message={passwordVerifyError} />}
            </div>
          }

            <div className="div-checkbox">
              {this.renderShowPassword()}
            </div>

            <div className="register-buttons">
              <button type="submit" className="register-button" disabled={emailError || usernameError || passwordError || passwordVerifyError}>SIGN UP</button>
            </div>
          </form>
        </section>
        {this.renderLoader()}
      </div>
    )
  }
}