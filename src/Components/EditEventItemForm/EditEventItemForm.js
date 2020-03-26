import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import EventItemsService from '../../Utils/eventItems-service';

export default class EditEventItemForm extends Component {
  static contextType = ItemContext;

  constructor(props) {
    super(props)
  
    this.state = {
       item: '',
       itemObject: {}
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