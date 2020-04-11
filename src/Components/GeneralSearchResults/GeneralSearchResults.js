import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import List from '../List/List';
import ListContext from '../../Context/ListContext';

export default class GeneralSearchResults extends Component {
  static contextType = ListContext;

  render() {
    return (
      <div className="general-lists">
        <p>This will render the searched general lists on the page</p>
        <SearchBar />

        <Link to="/general">
          <h4 className="search-h4">Back to General</h4>
        </Link>

        {this.context.searchedGeneralLists.map(list =>
          <List 
            key={list.id}
            list={list}
          />  
        )}     
      </div>
    )
  }
}
