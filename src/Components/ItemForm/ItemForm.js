import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ItemContext from '../../Context/ItemContext';
import GeneralItemsService from '../../Utils/generalItems-service';
import EventItemsService from '../../Utils/eventItems-service';
import './ItemForm.css';

class ItemForm extends Component {
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

  addItem = async e => {
    e.preventDefault();

    const newItem = {...this.state};

    if(this.props.match.path === '/general') {
      GeneralItemsService.postItem(newItem, this.props.listId)
      .then(data => {
        this.context.setNewGeneralItem(data);

        const newGeneralItems = [...this.context.generalItemsForUser];
        newGeneralItems.push(data);
        this.context.setGeneralItems(newGeneralItems);
        // Callback method sent from "List" component. This is a trick for Child components to send generalItems to Parent component...Needs to be used on all HTTP requests
        this.props.callbackFromParent(newGeneralItems);

        this.props.handleAddCancel(e);
      })
      .catch(res => {
        this.context.setError(res.error);
      })
    } else if(this.props.match.path === '/event') {
      try {
        let newEventItem = await EventItemsService.postItem(newItem, this.props.listId);
        this.context.setNewEventItem(newEventItem);

        const newEventItems = [...this.context.eventItemsForUser];
        newEventItems.push(newEventItem);
        this.context.setEventItems(newEventItems);
        // Callback method sent from "List" component. This is a trick for Child components to send generalItems to Parent component...Needs to be used on all HTTP requests
        this.props.callbackFromParentEvent(newEventItems);

        this.props.handleAddCancel(e);
      } catch(res) {
        this.context.setError(res.error);
      }
    }
    // e.target.item.value = '';
  }
    
  render() {
    return (
      <form 
        className="item-form"
        autoComplete="off"
        onSubmit={(e) => this.addItem(e)}
      >
        <input 
          type="text" 
          className="input-item"
          name="item"
          autoComplete="off"
          placeholder="Enter an item"
          onChange={this.handleChange}
        />
        <button type="submit" className="add-button">Add</button>
        <button 
          type="button" 
          className="cancel-button"
          name="addClicked"
          onClick={this.props.handleAddCancel}
        >  
        Back</button>
      </form>
    )
  }
}

export default withRouter(ItemForm);