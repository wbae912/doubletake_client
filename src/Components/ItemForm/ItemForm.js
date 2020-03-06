import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import TokenService from '../../services/token-service';

export default class ItemForm extends Component {
  static contextType = ItemContext;
  constructor(props) {
    super(props)
  
    this.state = {
       item: ''
    }
  }

  handleChange = e => {
    this.setState({
      item: e.target.value
    })
  }

  addItem = e => {
    e.preventDefault();

    const newItem = {...this.state};

    fetch(`http://localhost:8000/api/generalItems/${this.props.listId}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify(newItem)
    })
    .then(res => {
      if(!res.ok) {
        return res.json().then(err => Promise.reject(err));
      }
      return res.json();
    })
    .then(data => {
      this.context.setNewGeneralItem(data);

      const newGeneralItems = [...this.context.generalItemsForUser];
      newGeneralItems.push(data);
      this.context.setGeneralItems(newGeneralItems);

    })
    .catch(res => {
      this.context.setError(res.error);
    })

    e.target.item.value = '';
  }
    
  render() {
    return (
      <form 
        className="item-form"
        onSubmit={(e) => {this.addItem(e); this.props.handleCancel(e)}}
      >
        <input 
          type="text" 
          className="input-item"
          name="item"
          onChange={this.handleChange}
        />
        <button type="submit" className="add-button">+</button>
        <button 
          type="button" 
          className="cancel-button"
          name="addClicked"
          onClick={this.props.handleCancel}
        >  
        X</button>
      </form>
    )
  }
}
