import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import ItemForm from '../ItemForm/ItemForm';
import EditEventItemForm from '../EditEventItemForm/EditEventItemForm';
import ItemQuantity from '../ItemQuantity/ItemQuantity';
import EventItemsService from '../../Utils/eventItems-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

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
      // Callback method sent from "List" component. This is a trick for Child components to send generalItems to Parent component...Needs to be used on all HTTP requests
      this.props.callbackFromParent(eventItems);
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
            className={`list-input_e${this.props.listId}`}
            id={`item - ${item.id}`}
            onClick={() => this.toggleChecked(item)}
          />
          <label htmlFor={`item - ${item.id}`}></label>
          
          <EditEventItemForm 
            item={item}
            listId={item.list_id}
            itemId={item.id}
            callbackFromParent={this.props.callbackFromParent}
          />

          <ItemQuantity 
            item={item}
            callbackFromParent={this.props.callbackFromParent} // CHECK IF THIS BELONGS HERE
          />
  
          <FontAwesomeIcon 
              icon={faTrashAlt}
              className="delete-item-button"
              onClick={this.deleteItem.bind(this, item.id)}
          />
        </div>
      )} else if(item.list_id === this.props.listId && item.checked) {
        return (
          <div className="item-div" key={item.id}>
            <input
              type="checkbox"
              name="itemChecked"
              className={`list-input_e${this.props.listId}`}
              id={`item - ${item.id}`}
              onChange={() => this.toggleChecked(item)}
              defaultChecked
            />
            <label htmlFor={`item - ${item.id}`}></label>

            <EditEventItemForm 
              item={item}
              listId={item.list_id}
              itemId={item.id}
              callbackFromParent={this.props.callbackFromParent}
            />

            <ItemQuantity 
              item={item}
              callbackFromParent={this.props.callbackFromParent} // CHECK IF THIS BELONGS HERE
            />

            <FontAwesomeIcon 
              icon={faTrashAlt}
              className="delete-item-button"
              onClick={this.deleteItem.bind(this, item.id)}
            />
          </div>
        )}
  }

  toggleButton = e => {
    this.setState({
      [e.target.name]: true
    })
  }

  handleAddCancel = e => {
    this.setState({
      addClicked: false
    })
  }

  handleAddClicked = e => {
    this.setState({
      addClicked: true
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
            handleAddCancel={this.handleAddCancel}
            listId={this.props.listId}
            callbackFromParentEvent={this.props.callbackFromParent}
          />
        </div>
      )
    } else {
      return (
        <>
          <FontAwesomeIcon 
            icon={faPlusSquare}
            className="add-item-button"
            onClick={this.handleAddClicked}
          />
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
      // Callback method sent from "List" component. This is a trick for Child components to send generalItems to Parent component...Needs to be used on all HTTP requests
      this.props.callbackFromParent(filteredEventItems);
    } catch(res) {
      this.context.setError(res.error);
    }
  }

  // renderEditForm = (item) => {
  //   if(this.state.editClicked === item.id) {
  //     return (
  //       <>
  //         <EditEventItemForm 
  //           listId={item.list_id}
  //           itemId={item.id}
  //           handleEditCancel={this.handleEditCancel} // CHECK TO SEE IF WE NEED
  //           callbackFromParent={this.props.callbackFromParent}
  //         />
  //       </>
  //     )} else {
  //     return (
  //       <>
  //         <input 
  //           type="text"
  //           name="editClicked"
  //           className="item-input"
  //           value={item.item}
  //           id={item.id}
  //           readOnly={true}
  //         />
  //       </>
  //     )}
  // }

  // handleEditClicked = itemId => {
  //   this.setState({
  //     editClicked: itemId
  //   })
  // }

  // handleEditCancel = e => {
  //   this.setState({
  //     editClicked: false
  //   })
  // }

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
      // Callback method sent from "List" component. This is a trick for Child components to send generalItems to Parent component...Needs to be used on all HTTP requests
      this.props.callbackFromParent(updatedEventItems);
    } catch(res) {
      this.context.setError(res.error);
    }
  }

  // This was the "ref" created in List component so that it could access the following method in child (Items) component. In List component, this refers to (this.child.current.updateEventItems)
  updateEventItems = (items) => {
    this.context.setEventItems(items);
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