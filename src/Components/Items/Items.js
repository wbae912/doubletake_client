import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import TokenService from '../../services/token-service';

export default class Items extends Component {
  static contextType = ItemContext;

  componentDidMount() {
    fetch('http://localhost:8000/api/generalItems/', {
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
      .then(res => {
        if(!res.ok) {
          return res.json().then(err => Promise.reject(err));
        }
        return res.json();
      })
      .then(data => {
        this.context.setGeneralItems(data);
      })
      .catch(res => {
        this.context.setError(res.error);
      })
  }

  renderItems = item => {
    if(item.list_id === this.props.listId) {
      return (
        <div className="item-div" key={item.id}>
          <input
            type="checkbox"
            name="itemChecked"
            className="list-input"
            id={`item - ${item.id}`}
          />
          <label className="list-input" htmlFor={`item - ${item.id}`}>{item.item}</label>
        </div>
      )}
  }
  
  render() {
    return (
      <div className="items-div">
        {this.context.generalItemsForUser.map(item => this.renderItems(item))}
      </div>
    )
  }
}
