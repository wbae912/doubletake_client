import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ListContext from '../../Context/ListContext';
import './SortOptions.css';

class SortOptions extends Component {
  static contextType = ListContext;
  
  handleSortChange = e => {
    this.setState({
      sortOption: e.target.value
    })
  }

  renderEventDate = () => {
    if(this.props.match.path === '/event') {
      return (
        <>
          <optgroup label="Date of Event">
            <option value="5">Earliest</option>
            <option value="6">Latest</option>
          </optgroup>
        </>
      )
    }
  }

  render() {
    return (
      <div className="sort-div">
        <label className="hidden" htmlFor="sort-options">Sort Options</label>
        <select 
          name="sortOption" 
          id="sort-options" 
          onChange={this.props.handleSortChange}
        >
          <option value="0">Sort By...</option>
          <optgroup label="List Name">
            <option value="1">A - Z</option>
            <option value="2">Z - A</option>
          </optgroup>
          <optgroup label="Date Created">
            <option value="3">Newest</option>
            <option value="4">Oldest</option>
          </optgroup>
          {this.renderEventDate()}
        </select>
      </div>
    )
  }
}

export default withRouter(SortOptions);