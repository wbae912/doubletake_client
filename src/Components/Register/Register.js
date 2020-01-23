import React, { Component } from 'react';
import UserContext from '../../Context/UserContext';
import './Register.css';

export default class Register extends Component {

static contextType = UserContext;
  handleSubmit = e => {
    e.preventDefault();
    const credentials = {
      email: this.context.email,
      username: this.context.username,
      password: this.context.password
    };

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
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
}
