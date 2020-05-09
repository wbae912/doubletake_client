import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import LoaderSpinner from '../LoaderSpinner/LoaderSpinner';
import TokenService from '../../services/token-service';
import AuthApiService from '../../services/auth-api-service';
import ListContext from '../../Context/ListContext';
import './Login.css';

Modal.setAppElement('#root');

class Login extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
      credentials: {
        username: '',
        password: '',
        error: null,
        loading: false
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

    this.setState({
      loading: true
    })

    const { username, password } = e.target;

    AuthApiService.postLogin(this.state.credentials)
      .then(res => {
        username.value = '';
        password.value = '';
        TokenService.saveAuthToken(res.authToken);
        this.context.processLogin();
        this.setState({
          loading: false
        })
        this.props.history.push('/home');
      })
      .catch(res => {
        this.setState({
          error: res.error,
          loading: false
        });
      })
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
    return (
      <div className="login-register-div">
        <div className="top-div">
          {this.state.error && <p className='red'>{this.state.error}</p>}
        </div>

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
                aria-required="true"
                aria-invalid="true"
                required
                onChange={this.handleInputChange}
              />
              <label className="login-label" htmlFor="password">Password</label>
              <input 
                type="password" 
                name="password"
                autoComplete="on" 
                className="login-input" 
                id="password-login" 
                aria-required="true"
                aria-invalid="true"
                required
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
            </div>
          </form>
        </section>

        {this.renderLoader()}
      </div>
    )
  }
}

export default withRouter(Login);