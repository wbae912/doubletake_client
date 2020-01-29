import React, { Component } from 'react'

export default class GeneralListForm extends Component {
  render() {
    return (
      <div className="general-form-div">
        <h2 className="general-form-h2">Create List</h2>
        <form className="general-form">
          <div className="general-labels-inputs">
            <label className="title-label" htmlFor="list-title">List Name</label>
            <input 
              type="text"
              name="list-title"
              className="list-title"
              id="list-title"
              required
            />
            <label className="items-label" htmlFor="items-text">Items</label>
            <p className="items-p">Please enter each item on a new line.</p>
            <textarea 
              name="items-text"
              className="items-text"
              id="items-text"
              required
            />
          </div>
        </form>
      </div>
    )
  }
}
