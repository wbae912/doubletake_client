import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import TokenService from '../../services/token-service';
import ItemForm from '../ItemForm/ItemForm';

export default class Items extends Component {
  static contextType = ItemContext;

  constructor(props) {
    super(props)
  
    this.state = {
       addClicked: false
    }
  }
  
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
            value={item.id}
          />
          <label className="list-input" htmlFor={`item - ${item.id}`}>{item.item}</label>
          <button 
            type="button" 
            className="delete-item-button"
            
            /* Previous issue was that onClick event handler was firing when page rendered. The solution is to use .bind(), where the first argument we pass through is "this"
               Bind makes it so that the method is triggered only when I click the item.

               Reference this: https://stackoverflow.com/questions/32937365/button-onclick-triggered-when-init-in-react-application
            */
            onClick={this.deleteItem.bind(this, item.id)}
          >
          Delete Item</button>
        </div>
      )}
  }

  toggleButton = e => {
    this.setState({
      [e.target.name]: true
    })
  }

  handleCancel = e => {
    this.setState({
      addClicked: false
    })
  }

  renderItemForm = () => {
    if(this.state.addClicked) {
      return (
        <div className="item-form-div">
          <ItemForm 
            handleCancel={this.handleCancel}
            listId={this.props.listId}
          />
        </div>
      )
    } else {
      return (
        <>
          <button 
            type="button" 
            className="add-item-button"
            name="addClicked"
            onClick={this.toggleButton}
          >
          Add Item</button>
        </>
      )
    }
  }

  deleteItem = (itemId) => {
    const listId = this.props.listId;

    fetch(`http://localhost:8000/api/generalItems/${listId}/${itemId}`, {
      method: 'DELETE',
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`
      }
    })
    .then(res => {
      if(!res.ok) {
        return res.json().then(err => Promise.reject(err));
      }
    })
    .then(() => {
      const generalItems = [...this.context.generalItemsForUser];

      const filteredGeneralItems = generalItems.filter(item => item.id !== itemId);
      this.context.setGeneralItems(filteredGeneralItems);
    })
    .catch(res => {
      this.context.setError(res.error);
    })
  }
  
  render() {
    return (
      <div className="items-div">
        {this.context.generalItemsForUser.map(item => this.renderItems(item))}
        {this.renderItemForm()}
      </div>
    )
  }
}
