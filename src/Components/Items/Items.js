import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import ItemForm from '../ItemForm/ItemForm';
import EditItemForm from '../EditItemForm/EditItemForm';
import ItemQuantity from '../ItemQuantity/ItemQuantity';
import GeneralItemsService from '../../Utils/generalItems-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import './Items.css'

export default class Items extends Component {
  static contextType = ItemContext;

  constructor(props) {
    super(props)
  
    this.state = {
       addClicked: false,
       editClicked: null,
       generalItems: [],
       quantity: null,
       error: null
    }
  }
  
  componentDidMount() {
    GeneralItemsService.getItems()
      .then(data => {
        this.context.setGeneralItems(data);
        this.setState({
          generalItems: data
        })
        // Callback method sent from "List" component. This is a trick for Child components to send generalItems to Parent component...Needs to be used on all HTTP requests
        this.props.callbackFromParent(data);
      })
      .catch(res => {
        this.setState({
          error: res.error
        })
      })
  }

  renderItems = item => {
    if(item.list_id === this.props.listId && !item.checked) {
      return (  
        <div className="item-div" key={item.id} aria-live="polite">
          <input
            type="checkbox"
            name="itemChecked"
            aria-label="item-checkbox"
            className={`list-input_g${this.props.listId} item-checkbox`}
            id={`item - ${item.id}`}
            onClick={() => this.toggleChecked(item)}
          />
          <label htmlFor={`item - ${item.id}`}></label>
          
          <EditItemForm
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
            /* 
              Previous issue was that onClick event handler was firing when page rendered. The solution is to use .bind(), where the first argument we pass through is "this"
              Bind makes it so that the method is triggered only when I click the item.

              Reference this: https://stackoverflow.com/questions/32937365/button-onclick-triggered-when-init-in-react-application

              Alternatively, it would work by using this: onClick={() => this.deleteItem(item.id)}
              This is because if we don't do this, we are performing a function call as the value, when instead we should be PASSING the function as a value

              Reference this: https://stackoverflow.com/questions/33846682/react-onclick-function-fires-on-render
            */
            onClick={this.deleteItem.bind(this, item.id)}
          />
        </div>
      )} else if(item.list_id === this.props.listId && item.checked) {
        return (
          <div className="item-div" key={item.id} aria-live="polite">
            <input
              type="checkbox"
              name="itemChecked"
              aria-label="item-checkbox"
              className={`list-input_g${this.props.listId} item-checkbox`}
              id={`item - ${item.id}`}
              onChange={() => this.toggleChecked(item)}
              defaultChecked
            />
            <label htmlFor={`item - ${item.id}`}></label>
            
            <EditItemForm 
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
    let className = this.props.pathName === '/glist/:id' ? 'add-item-button-individual' : 'add-item-button';

    if(this.state.addClicked) {
      return (
        <div className="item-form-div" aria-live="polite">
          <ItemForm 
            handleAddCancel={this.handleAddCancel}
            listId={this.props.listId}
            callbackFromParent={this.props.callbackFromParent}
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

  deleteItem = (itemId) => {
    const listId = this.props.listId;

    GeneralItemsService.deleteItem(listId, itemId)
    .then(() => {
      const generalItems = [...this.context.generalItemsForUser];

      const filteredGeneralItems = generalItems.filter(item => item.id !== itemId);
      this.context.setGeneralItems(filteredGeneralItems);
      // Callback method sent from "List" component. This is a trick for Child components to send generalItems to Parent component...Needs to be used on all HTTP requests
      this.props.callbackFromParent(filteredGeneralItems);
    })
    .catch(res => {
      this.setState({
        error: res.error
      })
    })
  }

  toggleChecked = (item) => {
    item.checked = !item.checked;

    const editItem = {...item};

    const listId = item.list_id;
    const itemId = item.id;
    
    GeneralItemsService.editItem(listId, itemId, editItem)
    .then(() => {
      const generalItems = [...this.context.generalItemsForUser];
      
      const updatedGeneralItems = generalItems.map(item => (item.id === editItem.id) ? editItem : item);
      this.context.setGeneralItems(updatedGeneralItems);
      // Callback method sent from "List" component. This is a trick for Child components to send generalItems to Parent component...Needs to be used on all HTTP requests
      this.props.callbackFromParent(updatedGeneralItems);
    })
    .catch(res => {
      this.setState({
        error: res.error
      })
    })
  }

  // This was the "ref" created in List component so that it could access the following method in child (Items) component. In List component, this refers to (this.child.current.updateGeneralItems)
  updateGeneralItems = (items) => {
    this.context.setGeneralItems(items);
  }

  decrementQuantity = item => {
    item.quantity--;

    const editItem = {...item};

    const listId = item.list_id;
    const itemId = item.id;

    GeneralItemsService.editItem(listId, itemId, editItem)
    .then(() => {
      const generalItems = [...this.context.generalItemsForUser];
      
      const updatedGeneralItems = generalItems.map(item => (item.id === editItem.id) ? editItem : item);
      this.context.setGeneralItems(updatedGeneralItems);
      // Callback method sent from "List" component. This is a trick for Child components to send generalItems to Parent component...Needs to be used on all HTTP requests
      this.props.callbackFromParent(updatedGeneralItems);
    })
    .catch(res => {
      this.setState({
        error: res.error
      })
    })
  }

  incrementQuantity = item => {
    item.quantity++;

    const editItem = {...item};

    const listId = item.list_id;
    const itemId = item.id;

    GeneralItemsService.editItem(listId, itemId, editItem)
    .then(() => {
      const generalItems = [...this.context.generalItemsForUser];
      
      const updatedGeneralItems = generalItems.map(item => (item.id === editItem.id) ? editItem : item);
      this.context.setGeneralItems(updatedGeneralItems);
      // Callback method sent from "List" component. This is a trick for Child components to send generalItems to Parent component...Needs to be used on all HTTP requests
      this.props.callbackFromParent(updatedGeneralItems);
    })
    .catch(res => {
      this.setState({
        error: res.error
      })
    })
  }
  
  render() {
    let className = this.props.pathName === '/glist/:id' ? 'items-div-individual' : 'items-div';
    return (
      <div className={className} aria-live="polite">
        
        {this.context.generalItemsForUser.map(item => this.renderItems(item))}

        {this.renderItemForm()}
      </div>
    )
  }
}