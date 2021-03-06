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
       item: '',
       error: null
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

    if(this.props.match.path === '/general' || this.props.match.path === '/glist/:id') {
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
        this.setState({
          error: res.error
        })
      })
    } else if(this.props.match.path === '/event' || this.props.match.path === '/elist/:id') {
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
        this.setState({
          error: res.error
        })
      }
    }
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
          placeholder="Enter an item"
          aria-required="true"
          required
          onChange={this.handleChange}
        />
        <button type="submit" className="add-button">Add</button>
        <button 
          type="button" 
          className="cancel-button"
          name="addClicked"
          onClick={this.props.handleAddCancel}
        >  
        Cancel</button>
      </form>
    )
  }
}

export default withRouter(ItemForm);