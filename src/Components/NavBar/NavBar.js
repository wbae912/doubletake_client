import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import TokenService from '../../services/token-service';
import './NavBar.css';

class NavBar extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       menuClicked: false
    }
    this.ref = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutsideMenu, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutsideMenu, false);
  }

  handleClickOutsideMenu = e => {
    if(this.ref.current) {
      if(this.ref.current.contains(e.target)) {
        return;
      }
      this.toggleMenuOffAfterSelection(e);
    } 
  }
  
  handleLogoutClick = () => {
    TokenService.clearAuthToken();
    sessionStorage.removeItem('alerted');
  }

  toggleMenuOn = e => {
    this.setState({
      menuClicked: true
    })
  }

  toggleMenuOffAfterSelection = e => {
    let dropdownMenuCheckbox = document.getElementById('toggle');
    dropdownMenuCheckbox.checked = false;

    this.setState({
      menuClicked: false
    })
  }

  toggleMenuOff = () => {
    this.setState({
      menuClicked: false
    })
  }

  renderHamburger = () => {
    if(!this.state.menuClicked) {
      return (
        <div className="hamburger" ref={this.ref}>
          <label htmlFor="toggle" className="hamburger-logo" id="toggle-label" onClick={this.toggleMenuOn}>&#9776;</label>
          <input type="checkbox" id="toggle"/>
          <ul className="menu">
            <li className="appnav-li appnav-li-first" onClick={() => this.props.history.push('/home')}>Home</li>
            <li className="appnav-li" onClick={() => this.props.history.push('/general')}>Lists</li>
            <li className="appnav-li appnav-li-last" 
              onClick={() => {this.handleLogoutClick(); this.props.toggleLoggedOff(); this.props.history.push('/login')}}>
              Logout
            </li>    
          </ul>
        </div>
      )
    } else {
      return (
        <div className="hamburger" ref={this.ref}>
          <label htmlFor="toggle" className="hamburger-logo" onClick={this.toggleMenuOff} ref={node => this.node = node}>
            <FontAwesomeIcon icon={faTimes} className="times-icon" id="menu-close" />
          </label>
          <input type="checkbox" id="toggle"/>
          <ul className="menu">
            <li className="appnav-li appnav-li-first" onClick={(e) => {this.props.history.push('/home'); this.toggleMenuOffAfterSelection(e)}}>Home</li>
            <li className="appnav-li" onClick={(e) => {this.props.history.push('/general'); this.toggleMenuOffAfterSelection(e)}}>Lists</li>
            <li className="appnav-li appnav-li-last" 
              onClick={() => {this.handleLogoutClick(); this.props.toggleLoggedOff(); this.props.history.push('/')}}>
              Logout
            </li>    
          </ul>
        </div>
      )
    }
  }

  render() {
    return (
      <header className="appnav-header" aria-live="polite">
        <div className="appnav-logo-header">
          <Link to='/home'><h2 className="appnav-title">Doubletake</h2></Link>
        </div>
        
        <nav className="appnav">
          <div className="appnav-links">
            <NavLink to='/home' activeClassName="selected" className="appnav-li" id="home-menu">Home</NavLink>
            {/* <NavLink to='/general' activeClassName="selected" className="appnav-li">Lists</NavLink> */}
            <div className="appnav-li" id="dropdown-li">
              <div className="dropdown">
                <button className="dropbtn">Lists</button>
                <div className="dropdown-content">
                  <NavLink to='/general' activeClassName="selected-dropdown" className="dropdown-link"><span className="dropdown-span">General</span></NavLink>
                  <NavLink to='/event' activeClassName="selected-dropdown" className="dropdown-link"><span className="dropdown-span">Events</span></NavLink>
                </div>
              </div>
            </div>
            <Link to='/'>
              <p className="appnav-li" id="logout-menu" onClick={this.handleLogoutClick}>Logout</p>
            </Link>
          </div>
        </nav>

        {this.renderHamburger()}

      </header>
    )
  }
}

export default withRouter(NavBar);