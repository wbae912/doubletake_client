import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import GeneralService from '../../Utils/general-service';
import EventService from '../../Utils/event-service';
import ListContext from '../../Context/ListContext';
import GeneralEditForm from '../GeneralEditForm/GeneralEditForm';
import EventEditForm from '../EventEditForm/EventEditForm';
import Items from '../Items/Items';
import EventItems from '../EventItems/EventItems';
import GeneralItemsService from '../../Utils/generalItems-service';
import EventItemsService from '../../Utils/eventItems-service';
import Weather from '../Weather/Weather';
import './List.css';

class List extends Component {
  static contextType = ListContext;
  
  constructor(props) {
    super(props)
  
    this.state = {
       deleteClicked: false,
       editClicked: false,
       generalItems: [],
       eventItems: []
    }
    // "ref" was created in order to access methods from child components (Items + EventItems). Typically, not best practice/design, but good to know/practice.
    this.child = React.createRef();
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

  renderItems = () => {
    if(this.props.match.path === '/general' || this.props.match.path === '/generalSearch') {
      return (
        <Items 
          userId={this.props.list.user_id}
          listId={this.props.list.id}
          // Created this callback method and passed down to child component. Child will then "call" the callback prop to pass data from child to parent.
          callbackFromParent={this.callbackGeneralItems}
          ref={this.child}
        />
      )
    } else if(this.props.match.path === '/event' || this.props.match.path === '/eventSearch') {
      return (
        <EventItems 
          userId={this.props.list.user_id}
          listId={this.props.list.id}
          // Created this callback method and passed down to child component. Child will then "call" the callback prop to pass data from child to parent.
          callbackFromParent={this.callbackEventItems}
          ref={this.child}
        />
      )
    }
  }

  callbackGeneralItems = (generalItems) => {
    this.setState({
      generalItems
    })
  }

  callbackEventItems = (eventItems) => {
    this.setState({
      eventItems
    })
  }

  resetItems = (listId) => {
    if(this.props.match.path === '/general') {
      const generalItems = [...this.state.generalItems];
      
      const revertList = generalItems.filter(item => item.list_id === listId);

      revertList.map(async item => {
        item.checked = false;
    
        await GeneralItemsService.editItem(listId, item.id, item);
        
        for(let i = 0; i < generalItems.length; i++) {
          for(let j = 0; j < revertList.length; j++) {
            if(generalItems[i].id === revertList[j].id) {
              generalItems[i] = revertList[j];
            }
          }
        }
        this.child.current.updateGeneralItems(generalItems);
        this.revertCheckboxOnDOM(listId);
      });
    } else if(this.props.match.path === '/event') {
      const eventItems = [...this.state.eventItems];

      const revertList = eventItems.filter(item => item.list_id === listId);

      revertList.map(async item => {
        item.checked = false;

        await EventItemsService.editItem(listId, item.id, item);

        for(let i = 0; i < eventItems.length; i++) {
          for(let j = 0; j < revertList.length; j++) {
            if(eventItems[i].id === revertList[j].id) {
              eventItems[i] = revertList[j];
            }
          }
        }
        this.child.current.updateEventItems(eventItems);
        this.revertCheckboxOnDOM(listId);
      })
    }
  }

  // This method was added specifically to change the checkbox input elements to show as "unchecked" in the DOM.
  // Previously, resetItems would work and un-strikethrough all items in a list, but the checkboxes would not uncheck because the component did not re-render
  // Therefore, this method is implemented to ensure that the checkboxes are unchecked as well after the reset button is clicked
  revertCheckboxOnDOM = (listId) => {
    if(this.props.match.path === '/general') {
      let checkboxes = document.getElementsByClassName(`list-input_g${listId}`);
      for(let i = 0; i < checkboxes.length; i++) {
        if(checkboxes[i].type === 'checkbox') {
          checkboxes[i].checked = false;
        }
      }
    } else if(this.props.match.path === '/event') {
      let checkboxes = document.getElementsByClassName(`list-input_e${listId}`);
      for(let i = 0; i < checkboxes.length; i++) {
        if(checkboxes[i].type === 'checkbox') {
          checkboxes[i].checked = false;
        }
      }
    }
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

        {this.props.list.hasOwnProperty('date_of_event') && <Weather 
          list={this.props.list}
        />}

        {this.renderItems()}

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
          <button
            type="button"
            className="reset-button"
            onClick={() => this.resetItems(this.props.list.id)}
          >
          Reset</button>
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

export default withRouter(List);