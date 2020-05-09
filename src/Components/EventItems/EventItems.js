import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import ItemForm from '../ItemForm/ItemForm';
import EditEventItemForm from '../EditEventItemForm/EditEventItemForm';
import ItemQuantity from '../ItemQuantity/ItemQuantity';
import EventItemsService from '../../Utils/eventItems-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import './EventItems.css';

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
        <div className="item-div" key={item.id} aria-live="polite">
          <input
            type="checkbox"
            name="itemChecked"
            aria-label="event-item-checkbox"
            className={`list-input_e${this.props.listId} item-checkbox`}
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
            callbackFromParent={this.props.callbackFromParent}
          />
  
          <FontAwesomeIcon 
            icon={faTrashAlt}
            className="delete-item-button"
            onClick={this.deleteItem.bind(this, item.id)}
          />
        </div>
      )} else if(item.list_id === this.props.listId && item.checked) {
        return (
          <div className="item-div" key={item.id} aria-live="polite">
            <input
              type="checkbox"
              name="itemChecked"
              aria-label="event-item-checkbox"
              className={`list-input_e${this.props.listId} item-checkbox`}
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
              callbackFromParent={this.props.callbackFromParent}
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
    let className = this.props.pathName === '/elist/:id' ? 'add-item-button-individual' : 'add-item-button';

    if(this.state.addClicked) {
      return (
        <div className="item-form-div" aria-live="polite">
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
            className={className}
            aria-live="polite"
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
    let className = this.props.pathName === '/elist/:id' ? 'items-div-individual-event' : 'items-div';
    return (
      <div className={className} aria-live="polite">
        {this.context.eventItemsForUser.map(item => this.renderItems(item))}
        {this.renderItemForm()}
      </div>
    )
  }
}