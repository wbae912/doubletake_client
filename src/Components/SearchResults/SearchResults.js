import React, { Component } from 'react';

export default class SearchResults extends Component {
  render() {
    return (
      <div className="general-lists">
        <p>This will render the general lists on the page</p>
        <SearchBar />

        {this.context.generalLists.map(list => 
          <List 
            key={list.id}
            list={list}
          />
        )}

        {this.renderForm()}
        
      </div>
    )
  }
}
