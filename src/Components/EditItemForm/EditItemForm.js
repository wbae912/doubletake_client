import React, { Component } from 'react';
import TokenService from '../../services/token-service';
import ItemContext from '../../Context/ItemContext';

export default class EditItemForm extends Component {
  static contextType = ItemContext;

  constructor(props) {
    super(props)
  
    this.state = {
       item: '',
       itemObject: {}
    }
  }

  componentDidMount() {
    const listId = this.props.listId;
    const itemId = this.props.itemId;

    fetch(`http://localhost:8000/api/generalItems/${listId}/${itemId}`, {
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
    .then(res => (!res.ok)
      ? res.json().then(err => Promise.reject(err))
      : res.json()
    )
    .then(data => {
      this.setState({
        item: data.item,
        itemObject: data
      })
      this.context.setSpecificGeneralItem(data);
    })
    .catch(res => {
      this.context.setError(res.error);
    })
  }

  handleChange = e => {
    this.setState({
      item: e.target.value
    })
  }

  editItem = e => {
    e.preventDefault();

    const listId = this.props.listId;
    const itemId = this.props.itemId;

    const item = this.state.item;
    const editItem = {...this.state.itemObject, item};

    fetch(`http://localhost:8000/api/generalItems/${listId}/${itemId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify(editItem)
    })
    .then(res => {
      if(!res.ok) {
        return res.json().then(err => Promise.reject(err));
      }
    })
    .then(() => {
      const generalItems = [...this.context.generalItemsForUser];

      const updatedGeneralItems = generalItems.map(item => (item.id === editItem.id) ? editItem : item);
      this.context.setGeneralItems(updatedGeneralItems);

      this.props.handleEditCancel(e);
    })
    .catch(res => {
      this.context.setError(res.error);
    })
  }
  
  render() {
    return (
      <form 
        className="edit-item-form"
        onSubmit={e => {this.editItem(e)}}
      >
        <input
          type="text"
          className="input-item"
          name="itemName"
          value={this.state.item}
          onChange={this.handleChange}
        />
        <button type="submit" className="edit-button">Edit</button>
        <button
          type="button"
          className="cancel-button"
          name="editClicked"
          onClick={this.props.handleEditCancel}
        >
        X</button>
      </form>
    )
  }
}