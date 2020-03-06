import React, { Component } from 'react';
import ItemContext from '../../Context/ItemContext';
import GeneralItemsService from '../../Utils/generalItems-service';

export default class ItemForm extends Component {
  static contextType = ItemContext;
  constructor(props) {
    super(props)
  
    this.state = {
       item: ''
    }
  }

  handleChange = e => {
    this.setState({
      item: e.target.value
    })
  }

  addItem = e => {
    e.preventDefault();

    const newItem = {...this.state};

    GeneralItemsService.postItem(newItem, this.props.listId)
    .then(data => {
      this.context.setNewGeneralItem(data);

      const newGeneralItems = [...this.context.generalItemsForUser];
      newGeneralItems.push(data);
      this.context.setGeneralItems(newGeneralItems);

      this.props.handleAddClicked(e);
    })
    .catch(res => {
      this.context.setError(res.error);
    })

    e.target.item.value = '';
  }
    
  render() {
    return (
      <form 
        className="item-form"
        onSubmit={(e) => this.addItem(e)}
      >
        <input 
          type="text" 
          className="input-item"
          name="item"
          onChange={this.handleChange}
        />
        <button type="submit" className="add-button">+</button>
        <button 
          type="button" 
          className="cancel-button"
          name="addClicked"
          onClick={this.props.handleCancel}
        >  
        X</button>
      </form>
    )
  }
}