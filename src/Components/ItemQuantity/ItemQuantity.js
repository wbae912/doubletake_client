import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import GeneralItemsService from '../../Utils/generalItems-service';
import './ItemQuantity.css';

export default class ItemQuantity extends Component {
  static contextType = ItemContext;

  constructor(props) {
    super(props)
  
    this.state = {
       quantity: this.props.item.quantity
    }
  }
  
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  decrementQuantity = item => {
    item.quantity--;

    this.setState({
      quantity: item.quantity
    })

    const editItem = {...item};

    const listId = item.list_id;
    const itemId = item.id;

    GeneralItemsService.editItem(listId, itemId, editItem)
    .then(() => {
      const generalItems = [...this.context.generalItemsForUser];
      
      const updatedGeneralItems = generalItems.map(item => (item.id === editItem.id) ? editItem : item);
      this.context.setGeneralItems(updatedGeneralItems);

      this.props.callbackFromParent(updatedGeneralItems);
    })
    .catch(res => {
      this.context.setError(res.error);
    })
  }

  incrementQuantity = item => {
    item.quantity++;

    this.setState({
      quantity: item.quantity
    })

    const editItem = {...item};

    const listId = item.list_id;
    const itemId = item.id;

    GeneralItemsService.editItem(listId, itemId, editItem)
    .then(() => {
      const generalItems = [...this.context.generalItemsForUser];
      
      const updatedGeneralItems = generalItems.map(item => (item.id === editItem.id) ? editItem : item);
      this.context.setGeneralItems(updatedGeneralItems);

      this.props.callbackFromParent(updatedGeneralItems);
    })
    .catch(res => {
      this.context.setError(res.error);
    })
  }

  handleKeyPress = (e, item) => {
    // This event listener fires once the user has pressed "Enter" key
    if(e.key === 'Enter') {
      let quantity = this.state.quantity;
      const editItem = {...item, quantity};
  
      const listId = item.list_id;
      const itemId = item.id;
  
      GeneralItemsService.editItem(listId, itemId, editItem)
      .then(() => {
        const generalItems = [...this.context.generalItemsForUser];
        
        const updatedGeneralItems = generalItems.map(item => (item.id === editItem.id) ? editItem : item);
        this.context.setGeneralItems(updatedGeneralItems);

        this.props.callbackFromParent(updatedGeneralItems);
      })
      .catch(res => {
        this.context.setError(res.error);
      })
      // After the user presses "Enter" key, we do not want to focus on the input element anymore. That is why we use the "blur()" method to remove focus
      let inputElement = document.getElementById(`quantity-g${item.id}`);
      inputElement.blur();
    }
  }

  // This method was made so that if the user focuses out of the element, it will persist their quantity in the database
  handleBlur = item => {
    let quantity = this.state.quantity;
    const editItem = {...item, quantity};

    const listId = item.list_id;
    const itemId = item.id;

    GeneralItemsService.editItem(listId, itemId, editItem)
    .then(() => {
      const generalItems = [...this.context.generalItemsForUser];
      
      const updatedGeneralItems = generalItems.map(item => (item.id === editItem.id) ? editItem : item);
      this.context.setGeneralItems(updatedGeneralItems);

      this.props.callbackFromParent(updatedGeneralItems);
    })
    .catch(res => {
      this.context.setError(res.error);
    })
  }

  render() {
    return (
      <>
        <button
          type="button"
          className="decrement-button"
          onClick={() => this.decrementQuantity(this.props.item)}
        >
        -</button>
        <input 
          type="number"
          name="quantity"
          className="quantity-input"
          min="1"
          id={`quantity-g${this.props.item.id}`}
          value={this.state.quantity}
          required
          onChange={this.handleChange}
          onKeyPress={(e) => this.handleKeyPress(e, this.props.item)}
          onBlur={() => this.handleBlur(this.props.item)}
        />
        <button
          type="button"
          className="increment-button"
          onClick={() => this.incrementQuantity(this.props.item)}
        >
        +</button>
      </>
    )
  }
}
