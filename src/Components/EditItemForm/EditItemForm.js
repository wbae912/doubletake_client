import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import GeneralItemsService from '../../Utils/generalItems-service';

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

    GeneralItemsService.getSpecificItem(listId, itemId)
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

    GeneralItemsService.editItem(listId, itemId, editItem)
    .then(() => {
      const generalItems = [...this.context.generalItemsForUser];

      const updatedGeneralItems = generalItems.map(item => (item.id === editItem.id) ? editItem : item);
      this.context.setGeneralItems(updatedGeneralItems);
      // Callback method sent from "List" component. This is a trick for Child components to send generalItems to Parent component...Needs to be used on all HTTP requests
      this.props.callbackFromParent(updatedGeneralItems);

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