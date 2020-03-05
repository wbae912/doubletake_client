import React, { Component } from 'react';

export default class ItemForm extends Component {  
  render() {
    return (
      <form className="item-form">
        <input type="text" className="input-item"/>
        <button type="submit">+</button>
        <button 
          type="button" 
          className="cancel-button"
          onClick={this.props.handleCancel}
        >  
        X</button>
      </form>
    )
  }
}
