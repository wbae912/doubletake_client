import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import './Nav.css';

class Nav extends Component {
  render() {
    return (
      <header className="nav-header" aria-live="polite">
        <div className="nav-logo-header">
          <Link to='/'><h2 className="nav-title">Doubletake</h2></Link>
        </div>
        <nav className="nav">
          <div className="nav-links">
            <NavLink to='/login' activeClassName="selected" className="nav-li">Login</NavLink>
            <NavLink to='/register' activeClassName="selected" className="nav-li">Register</NavLink>
          </div>
        </nav>
      </header>
    )
  }
}

export default withRouter(Nav)