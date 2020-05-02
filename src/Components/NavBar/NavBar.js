import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import TokenService from '../../services/token-service';
import './NavBar.css';

class NavBar extends Component {
  handleLogoutClick = () => {
    TokenService.clearAuthToken();
  }

  render() {
    return (
      <header className="appnav-header" aria-live="polite">
        <div className="appnav-logo-header">
          <div className="appnav-logo-div">
            <i className="fa fa-tv fa-2x" onClick={() => this.props.history.push('/')}></i>
          </div>
          <Link to='/'><h2 className="appnav-title">TV Tracker</h2></Link>
        </div>
        
        
        <nav className="appnav">
          <div className="appnav-links">
            <NavLink to='/dashboard' activeClassName="selected" className="appnav-li">Dashboard</NavLink>
            <div className="appnav-li" id="dropdown-li">
              <div className="dropdown">
                <button className="dropbtn">TV Show Status</button>
                <div className="dropdown-content">
                  <NavLink to='/plan-to-watch' activeClassName="selected" className="dropdown-link"><span className="dropdown-span">Plan to Watch</span></NavLink>
                  <NavLink to='/currently-watching' activeClassName="selected" className="dropdown-link"><span className="dropdown-span">Currently Watching</span></NavLink>
                  <NavLink to='/completed' activeClassName="selected" className="dropdown-link"><span className="dropdown-span">Completed</span></NavLink>
                </div>
              </div>
            </div>
            <NavLink to='/add-entry' activeClassName="selected" className="appnav-li">Add New Show</NavLink>
            <Link to='/'>
              <div className="appnav-li">
                <button type="button" className="logout-button"
                  onClick={() => {this.handleLogoutClick(); this.context.toggleIsLoggedOff()}}>
                  Logout
                </button>
              </div>
            </Link>
          </div>
        </nav>


        <div className="hamburger">
            <label htmlFor="toggle" className="hamburger-logo">&#9776;</label>
            <input type="checkbox" id="toggle"/>
            <ul className="menu">
                <li className="appnav-li appnav-li-first" onClick={() => this.props.history.push('/dashboard')}>Dashboard</li>
                <li className="appnav-li" onClick={() => this.props.history.push('/plan-to-watch')}>Plan to Watch</li>
                <li className="appnav-li" onClick={() => this.props.history.push('/currently-watching')}>Currently Watching</li>
                <li className="appnav-li" onClick={() => this.props.history.push('/completed')}>Completed</li>
                <li className="appnav-li" onClick={() => this.props.history.push('/add-entry')}>Add New Show</li>
                <li className="appnav-li" 
                  onClick={() => {this.handleLogoutClick(); this.context.toggleIsLoggedOff(); this.props.history.push('/')}}>
                  Logout
                </li>    
            </ul>
        </div>


      </header>
    )
  }
}

export default withRouter(NavBar);