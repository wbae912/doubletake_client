import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from '../../Components/Login/Login';
import Register from '../../Components/Register/Register';
import GeneralCheckList from '../../Components/GeneralCheckList/GeneralCheckList';
import EventCheckList from '../../Components/EventCheckList/EventCheckList';
import NotFound from '../NotFound/NotFound';
import Nav from '../Nav/Nav';
import NavBar from '../NavBar/NavBar';
import Home from '../Home/Home';
import Footer from '../Footer/Footer';
import TokenService from '../../services/token-service';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       isLoggedIn: null
    }
  }

  componentDidMount() {
    if(TokenService.getAuthToken()) {
      this.setState({
        isLoggedIn: true
      })
    }
  }

  toggleLoggedOff = () => {
    this.setState({
      isLoggedIn: false
    })
  }
  
  render() {
    return (
      <div className="App">
        {this.state.isLoggedIn ? <NavBar toggleLoggedOff={this.toggleLoggedOff} /> : <Nav />}
        <Switch>
          <Route 
            path={'/register'}
            component={Register}
          />
          <Route
            path={'/login'}
            component={Login}
          />
          <Route
            path={'/home'}
            component={Home}
          />
          <Route 
            path={'/general'}
            component={GeneralCheckList}
          />
          <Route
            path={'/event'}
            component={EventCheckList}
          />
          <Route 
            component={NotFound}
          />
        </Switch>
        <Footer />
      </div>
    );
  }
}