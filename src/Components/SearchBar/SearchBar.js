import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class SearchBar extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       searchTerm: ''
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  
  handleSubmit = e => {
    e.preventDefault();
    let listType = this.props.match.path.slice(1);

    fetch(`http://localhost:8000/api/search/${listType}?searchTerm=${this.state.searchTerm}`)
      .then(res => {
        if(!res.ok) {
          return res.json().then(err => Promise.reject(err));
        }
        return res.json();
      })
      .then(data => {
        
      })
  }

  render() {
    return (
      <form className="search-form">
        <label>Search for a list</label>
        <input 
          type="text"
          name="searchTerm"
          className="search-input"
          value={this.state.searchTerm}
          onChange={this.handleChange}
        />
        <button
          type="submit"
          className="search-button"
        >
        Search</button>
      </form>
    )
  }
}

export default withRouter(SearchBar);