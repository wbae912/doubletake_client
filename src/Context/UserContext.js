import React, { Component } from 'react'

const UserContext = React.createContext({
  user: {
    email: '',
    username: '',
    password: '',
    passwordVerify: ''
  },
  error: null,
  setError: () => {},
  clearError: () => {},
  setUser: () => {},
  setEmail: () => {},
  setUsername: () => {},
  setPassword: () => {},
  setPasswordVerify: () => {}
});

export default UserContext;

export class UserProvider extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      user: {
        email: '',
        username: '',
        password: '',
        passwordVerify: ''
      },
      error: null
    };
  }

  setError = error => {
    console.error(error);
    this.setState({error});
  }

  clearError = () => {
    this.setState({error: null});
  }

  setUser = user => {
    this.setState({user});
  }

  setEmail = email => {
    this.setState( {...this.state.user, email} );
  }

  setUsername = username => {
    this.setState( {...this.state.user, username} );
  }

  setPassword = password => {
    this.setState( {...this.state.user, password} );
  }

  setPasswordVerify = passwordVerify => {
    this.setState( {...this.state.user, passwordVerify} )
  }

  render() {
    const value = {
      user: this.state.user,
      error: this.state.error,
      setError: this.setError,
      clearError: this.clearError,
      setUser: this.setUser,
      setEmail: this.setEmail,
      setUsername: this.setUsername,
      setPassword: this.setPassword,
      setPasswordVerify: this.setPasswordVerify
    };

    return (
      <UserProvider value={value}>
        {this.props.children}
      </UserProvider>
    )
  }
}
