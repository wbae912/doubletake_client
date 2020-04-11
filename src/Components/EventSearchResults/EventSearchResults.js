import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import List from '../List/List';
import ListContext from '../../Context/ListContext';

export default class EventSearchResults extends Component {
  static contextType = ListContext;

  render() {
    return (
      <div className="event-lists">
        <p>This will render the searched event lists on the page</p>
        <SearchBar />

        <Link to="/event">
          <h4 className="search-h4">Back to Events</h4>
        </Link>

        {this.context.searchedEventLists.map(list =>
          <List 
            key={list.id}
            list={list}
          />  
        )}     
      </div>
    )
  }
}
