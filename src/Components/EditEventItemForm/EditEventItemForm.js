import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import EventItemsService from '../../Utils/eventItems-service';

export default class EditEventItemForm extends Component {
  static contextType = ItemContext;

  constructor(props) {
    super(props)
  
    this.state = {
       item: '',
       itemObject: {},
       editClicked: false
    }
  }

  async componentDidMount() {
    const listId = this.props.listId;
    const itemId = this.props.itemId;

    try {
      let itemObject = await EventItemsService.getSpecificItem(listId, itemId);
      // NOTE: this.setState needed to be called IMMEDIATELY after the "await". Previously, the line below was above the setState, but that caused setState to not work.
      this.setState({ // setState is async, but having an "await" does not make a difference.
        item: itemObject.item,
        itemObject
      })
      
      this.context.setSpecificEventItem(itemObject); 
    } catch(res) {
      this.context.setError(res.error);
    }
  }

  handleChange = e => {
    this.setState({
      item: e.target.value
    })
  }

  editItem = async e => {
    e.preventDefault();

    const listId = this.props.listId;
    const itemId = this.props.itemId;

    const item = this.state.item;
    const editItem = {...this.state.itemObject, item};

    try {
      await EventItemsService.editItem(listId, itemId, editItem);

      const eventItems = [...this.context.eventItemsForUser];
      const updatedEventItems = eventItems.map(item => (item.id === editItem.id) ? editItem : item);
      this.context.setEventItems(updatedEventItems);
      // Callback method sent from "List" component. This is a trick for Child components to send generalItems to Parent component...Needs to be used on all HTTP requests
      this.props.callbackFromParent(updatedEventItems);

      this.props.handleEditCancel(e);
    } catch(res) {
      this.context.setError(res.error);
    }
  }

  handleKeyPress = e => {
    if(e.key === 'Enter') {
      const listId = this.props.listId;
      const itemId = this.props.itemId;

      const item = this.state.item;
      const editItem = {...this.state.itemObject, item};
  
      EventItemsService.editItem(listId, itemId, editItem)
      .then(() => {
        const eventItems = [...this.context.eventItemsForUser];
        
        const updatedEventItems = eventItems.map(item => (item.id === editItem.id) ? editItem : item);
        this.context.setEventItems(updatedEventItems);

        this.props.callbackFromParent(updatedEventItems);
        this.handleEditCancel(e);
      })
      .catch(res => {
        this.context.setError(res.error);
      })
      // After the user presses "Enter" key, we do not want to focus on the input element anymore. That is why we use the "blur()" method to remove focus
      let inputElement = document.getElementById(`edit-item-input-e${this.props.itemId}`);
      inputElement.blur();
    } 
  }

  handleBlur = e => {    
    const listId = this.props.listId;
    const itemId = this.props.itemId;

    const item = this.state.item;
    const editItem = {...this.state.itemObject, item};

    EventItemsService.editItem(listId, itemId, editItem)
    .then(() => {
      const eventItems = [...this.context.eventItemsForUser];
      
      const updatedEventItems = eventItems.map(item => (item.id === editItem.id) ? editItem : item);
      this.context.setEventItems(updatedEventItems);

      this.props.callbackFromParent(updatedEventItems);
      this.handleEditCancel(e);
    })
    .catch(res => {
      this.context.setError(res.error);
    })
  }

  handleEditToggle = e => {
    this.setState({
      editClicked: true
    })
  }

  handleEditCancel = e => {
    this.setState({
      editClicked: false
    })
  }

  renderInput = () => {
    if(this.state.editClicked) {
      return (
        <input
          type="text"
          aria-live="polite"
          aria-label="edit-input__event"
          className={`input-item-checked-${this.props.item.checked}`}
          id={`edit-item-input-e${this.props.itemId}`}
          name="itemName"
          placeholder="Enter an item"
          aria-required="true"
          required
          value={this.state.item}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          onBlur={this.handleBlur}
        />
      )
    } else {
      return (
        <input
          type="text"
          aria-live="polite"
          aria-label="item-input__read-only"
          className={`input-item-checked-${this.props.item.checked} read-only`}
          id={`edit-item-input-e${this.props.itemId}`}
          name="itemName"
          value={this.state.item}
          readOnly={true}
          onClick={this.handleEditToggle}
        />
      )
    }
  }
  
  render() {
    return (
      <form 
        className="edit-item-form"
        autoComplete="off"
        onSubmit={e => {this.editItem(e)}}
      >
        {this.renderInput()} 
      </form>
    )
  }
}