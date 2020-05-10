import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ListContext from '../../Context/ListContext';
import TokenService from '../../services/token-service';
import './SearchBar.css';

class SearchBar extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       searchTerm: '',
       error: null
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

    fetch(`http://localhost:8000/api/search/${listType}?searchTerm=${this.state.searchTerm}`, {
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
      .then(res => {
        if(!res.ok) {
          return res.json().then(err => Promise.reject(err));
        }
        return res.json();
      })
      .then(data => {
        if(this.props.match.path === '/general') {
          this.context.setGeneralLists(data);
          this.context.setGeneralSearchedToTrue();
          this.context.setSearchTerm(this.state.searchTerm);
        } else if(this.props.match.path === '/event') {
          this.context.setEventLists(data);
          this.context.setEventSearchedToTrue();
          this.context.setSearchTerm(this.state.searchTerm);
        }
        this.setState({
          searchTerm: ''
        })
      })
      .catch(res => {
        this.setState({
          error: res.error
        })
      })
  }

  render() {
    return (
      <form 
        className="search-form"
        onSubmit={this.handleSubmit}
      >
        <input 
          type="text"
          name="searchTerm"
          className="search-input"
          placeholder="Search List..."
          required
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