import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import GeneralItemsService from '../../Utils/generalItems-service';
import './EditItemForm.css'

export default class EditItemForm extends Component {
  static contextType = ItemContext;

  constructor(props) {
    super(props)
  
    this.state = {
       item: '',
       itemObject: {},
       editClicked: false
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
      this.handleEditCancel(e);
    })
    .catch(res => {
      this.context.setError(res.error);
    })
  }

  handleKeyPress = e => {
    if(e.key === 'Enter') {
      const listId = this.props.listId;
      const itemId = this.props.itemId;

      const item = this.state.item;
      const editItem = {...this.state.itemObject, item};
  
      GeneralItemsService.editItem(listId, itemId, editItem)
      .then(() => {
        const generalItems = [...this.context.generalItemsForUser];
        
        const updatedGeneralItems = generalItems.map(item => (item.id === editItem.id) ? editItem : item);
        this.context.setGeneralItems(updatedGeneralItems);

        this.props.callbackFromParent(updatedGeneralItems);
        this.handleEditCancel(e);
      })
      .catch(res => {
        this.context.setError(res.error);
      })
      // After the user presses "Enter" key, we do not want to focus on the input element anymore. That is why we use the "blur()" method to remove focus
      let inputElement = document.getElementById(`edit-item-input-g${this.props.itemId}`);
      inputElement.blur();
    } 
  }

  handleBlur = e => {    
    const listId = this.props.listId;
    const itemId = this.props.itemId;

    const item = this.state.item;
    const editItem = {...this.state.itemObject, item};

    GeneralItemsService.editItem(listId, itemId, editItem)
    .then(() => {
      const generalItems = [...this.context.generalItemsForUser];
      
      const updatedGeneralItems = generalItems.map(item => (item.id === editItem.id) ? editItem : item);
      this.context.setGeneralItems(updatedGeneralItems);

      this.props.callbackFromParent(updatedGeneralItems);
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
          className={`input-item-checked-${this.props.item.checked}`}
          id={`edit-item-input-g${this.props.itemId}`}
          name="itemName"
          placeholder="Enter an item"
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
          className={`input-item-checked-${this.props.item.checked} read-only`}
          id={`edit-item-input-g${this.props.itemId}`}
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