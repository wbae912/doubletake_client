import React, { Component } from 'react';

export default class List extends Component {
  render() {
    return (
      <div className="list-entry">
        <h2 className="list-h2">Title of the list</h2>
        <input 
          type="checkbox"
          name="item"
          className="list-input"
          id="item"
        />
        <label className="list-input" htmlFor="item">Item name</label>
      </div>
    )
  }
}
