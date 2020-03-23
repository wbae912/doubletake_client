import React, { Component } from 'react';
import GeneralService from '../../Utils/general-service';
import EventService from '../../Utils/event-service';
import ListContext from '../../Context/ListContext';
import GeneralEditForm from '../GeneralEditForm/GeneralEditForm';
import EventEditForm from '../EventEditForm/EventEditForm';
import Items from '../Items/Items';
import './List.css';

export default class List extends Component {
  static contextType = ListContext;
  
  constructor(props) {
    super(props)
  
    this.state = {
       deleteClicked: false,
       editClicked: false,
    }
  }
  
  toggleButton = e => {
    this.setState({
      [e.target.name]: true
    })
  }
  
  yesClicked = () => {
    if(!this.props.list.date_of_event) {
      GeneralService.deleteList(this.props.list.id)
        .then(() => {
          this.setState({
            deleteClicked: false
          })

          /* The steps below trigger the page to re-render when a list is successfully deleted. Otherwise, you would need to refresh the page to see that the list was 
            deleted, which is not what is intended.

            ADDITIONAL NOTES: setState for deleteClicked and yesClicked have to come BEFORE "resetting" the generalLists in context. Otherwise, a warning is received
            that setState is being called on an unmounted component (which can lead to performance issues). If we reset the generalLists with the removed list and call setState 
            afterwards, the component has already been deleted/unmounted, which is why setState needs to come before
          */
          const generalLists = [...this.context.generalLists];
          const filteredGeneralList = generalLists.filter(list => list.id !== this.props.list.id);
          this.context.setGeneralLists(filteredGeneralList);
        })
        .catch(res => {
          this.context.setError(res.error);
        })
      } else {
        EventService.deleteList(this.props.list.id)
          .then(() => {
            this.setState({
              deleteClicked: false
            })

            const eventLists = [...this.context.eventLists];
            const filteredEventList = eventLists.filter(list => list.id !== this.props.list.id);
            this.context.setEventLists(filteredEventList);
          })
          .catch(res => {
            this.context.setError(res.error);
          })
    }
  }

  noClicked = () => {
    this.setState({
      deleteClicked: false
    })
  }
  
  renderDeleteConfirmMessage = () => {
    if(this.state.deleteClicked) {
      return (
        <div className="delete-confirm">
          <h3 className="delete-h3">Are you sure you want to delete this list?</h3>
          <div className="delete-confirm-buttons">
            <button 
              type="button" 
              className="yes-button"
              onClick={this.yesClicked}
            >
            Yes</button>
            <button 
              type="button" 
              className="no-button"
              onClick={this.noClicked}
            >
            No</button>
          </div>
        </div>
      )
    }
  }

  handleCancel = e => {
    this.setState({
      editClicked: false
    })
  }

  renderEditForm = () => {
    if(this.state.editClicked && !this.props.list.date_of_event) {
      return(
        <GeneralEditForm 
          key={this.props.list.id}
          list={this.props.list}
          handleCancel={this.handleCancel}
        />
      )} else if(this.state.editClicked && this.props.list.date_of_event) {
        return (
          <EventEditForm 
            key={this.props.list.id}
            list={this.props.list}
            handleCancel={this.handleCancel}
          />
        )}
  }

  render() {
    let date = new Date(this.props.list.date_of_event).toLocaleString();
    let dateArray = date.split(',');

    return (
      <div className="list-entry">
        <h2 className="list-h2">{this.props.list.title}</h2>

        {(this.props.list.hasOwnProperty('date_of_event') 
          ? <h3 className="list-date">{dateArray[0]}</h3>
          : null
        )}

        <Items 
          userId={this.props.list.user_id}
          listId={this.props.list.id}
        />

        <div className="list-buttons">
          <button
            type="button"
            className="delete-button"
            name="deleteClicked"
            onClick={this.toggleButton}
          >
          Delete</button>
          <button
            type="button"
            className="edit-button"
            name="editClicked"
            onClick={this.toggleButton}
          >
          Edit</button>
        </div>

        {/* {this.state.editClicked && <GeneralEditForm 
           key={this.props.list.id}
           list={this.props.list}
           handleCancel={this.handleCancel}
         />} */}

         {this.renderEditForm()}

        {this.renderDeleteConfirmMessage()}
      </div>
    )
  }
}
