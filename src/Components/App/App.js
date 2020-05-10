import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingPage from '../LandingPage/LandingPage';
import Login from '../../Components/Login/Login';
import Register from '../../Components/Register/Register';
import GeneralCheckList from '../../Components/GeneralCheckList/GeneralCheckList';
import EventCheckList from '../../Components/EventCheckList/EventCheckList';
import IndividualGeneral from '../IndividualGeneral/IndividualGeneral';
import IndividualEvent from '../IndividualEvent/IndividualEvent';
import NotFound from '../NotFound/NotFound';
import Nav from '../Nav/Nav';
import NavBar from '../NavBar/NavBar';
import Home from '../Home/Home';
import Footer from '../Footer/Footer';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import PublicOnlyRoute from '../PublicOnlyRoute/PublicOnlyRoute';
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

  // Since user is directed to Home page immediately after login, created this method so Home component can setState of "isLoggedIn" back up to parent (App) with this callback method
  callbackIsLoggedIn = boolean => {
    this.setState({
      isLoggedIn: boolean
    })
  }
  
  render() {
    return (
      <div className="App">
        {this.state.isLoggedIn ? <NavBar toggleLoggedOff={this.toggleLoggedOff} /> : <Nav />}
        <Switch>
          <Route 
            exact path={'/'}
            render={() => <LandingPage callbackFromParent={this.callbackIsLoggedIn} />}
          />
          <PublicOnlyRoute 
            path={'/register'}
            component={Register}
          />
          <PublicOnlyRoute
            path={'/login'}
            component={Login}
          />
          <PrivateRoute
            path={'/home'}
            component={Home}
            callbackFromParent={this.callbackIsLoggedIn}
          />
          <PrivateRoute 
            path={'/general'}
            component={GeneralCheckList}
          />
          <PrivateRoute
            path={'/event'}
            component={EventCheckList}
          />
          <PrivateRoute 
            path={'/glist/:id'}
            component={IndividualGeneral}
          />
          <PrivateRoute 
            path={'/elist/:id'}
            component={IndividualEvent}
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