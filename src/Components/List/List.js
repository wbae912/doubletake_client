import React, { Component } from 'react';

export default class List extends Component {
  render() {
    return (
      <div className="list-entry">
        <h2 className="list-h2">{this.props.list.title}</h2>
        <input 
          type="checkbox"
          name="item"
          className="list-input"
          id="item"
        />
        <label className="list-input" htmlFor="item">{this.props.list.items}</label>
      </div>
    )
  }
}
