import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import ItemForm from '../ItemForm/ItemForm';
import EditEventItemForm from '../EditEventItemForm/EditEventItemForm';
import EventItemsService from '../../Utils/eventItems-service';
import './EventItems.css'

export default class EventItems extends Component {
  static contextType = ItemContext;

  constructor(props) {
    super(props)
  
    this.state = {
       addClicked: false,
       editClicked: null
    }
  }
  
  async componentDidMount() {
    try {
      let eventItems = await EventItemsService.getItems();
      this.context.setEventItems(eventItems);
    } catch(res) {
      this.context.setError(res.error);
    }
  }

  renderItems = item => {
    if(item.list_id === this.props.listId && !item.checked) {
      return (  
        <div className="item-div" key={item.id}>
          <input
            type="checkbox"
            name="itemChecked"
            className="list-input"
            id={`item - ${item.id}`}
            onClick={() => this.toggleChecked(item)}
          />
          <label className="list-input" htmlFor={`item - ${item.id}`}>{item.item}</label>
  
          {this.renderEditForm(item)}

          <button 
            type="button" 
            className="delete-item-button"
            /* Previous issue was that onClick event handler was firing when page rendered. The solution is to use .bind(), where the first argument we pass through is "this"
               Bind makes it so that the method is triggered only when I click the item.

               Reference this: https://stackoverflow.com/questions/32937365/button-onclick-triggered-when-init-in-react-application

               Alternatively, it would work by using this: onClick={() => this.deleteItem(item.id)}
               This is because if we don't do this, we are performing a function call as the value, when instead we should be PASSING the function as a value

               Reference this: https://stackoverflow.com/questions/33846682/react-onclick-function-fires-on-render
            */
            onClick={this.deleteItem.bind(this, item.id)}
          >
          Delete Item</button>
        </div>
      )} else if(item.list_id === this.props.listId && item.checked) {
        return (
          <div className="item-div" key={item.id}>
            <input
              type="checkbox"
              name="itemChecked"
              className="list-input"
              id={`item - ${item.id}`}
              onChange={() => this.toggleChecked(item)}
              defaultChecked
            />
            <label className="list-input-strikethrough" htmlFor={`item - ${item.id}`}>{item.item}</label>
    
            {this.renderEditForm(item)}

            <button 
              type="button" 
              className="delete-item-button"
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

  handleAddClicked = e => {
    this.setState({
      addClicked: false
    })
  }

  handleCancel = e => {
    this.setState({
      [e.target.name]: false
    })
  }

  renderItemForm = () => {
    if(this.state.addClicked) {
      return (
        <div className="item-form-div">
          <ItemForm 
            handleAddClicked={this.handleAddClicked}
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

  deleteItem = async itemId => {
    const listId = this.props.listId;

    try {
      await EventItemsService.deleteItem(listId, itemId);

      const eventItems = [...this.context.eventItemsForUser];
      const filteredEventItems = eventItems.filter(item => item.id !== itemId);
      this.context.setEventItems(filteredEventItems);
    } catch(res) {
      this.context.setError(res.error);
    }
  }

  renderEditForm = (item) => {
    if(this.state.editClicked === item.id) {
      return (
        <>
          <EditEventItemForm 
            listId={item.list_id}
            itemId={item.id}
            handleEditCancel={this.handleEditCancel}
          />
        </>
      )} else {
      return (
        <>
          <button
            type="button"
            className="edit-item-button"
            name="editClicked"
            onClick={() => {this.handleEditClicked(item.id);}}
          >
          Edit Item</button>
      </>
      )}
  }

  handleEditClicked = itemId => {
    this.setState({
      editClicked: itemId
    })
  }

  handleEditCancel = e => {
    this.setState({
      editClicked: false
    })
  }

  toggleChecked = async item => {
    item.checked = !item.checked;
    const editItem = {...item};

    const listId = item.list_id;
    const itemId = item.id;

    try {
      await EventItemsService.editItem(listId, itemId, editItem)

      const eventItems = [...this.context.eventItemsForUser];
      const updatedEventItems = eventItems.map(item => (item.id === editItem.id) ? editItem : item);
      this.context.setEventItems(updatedEventItems);
    } catch(res) {
      this.context.setError(res.error);
    }
  }
  
  render() {
    return (
      <div className="items-div">
        {this.context.eventItemsForUser.map(item => this.renderItems(item))}
        {this.renderItemForm()}
      </div>
    )
  }
}