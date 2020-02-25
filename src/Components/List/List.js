import React, { Component } from 'react';
import GeneralService from '../../Utils/general-service';
import ListContext from '../../Context/ListContext';

export default class List extends Component {
  static contextType = ListContext;
  
  constructor(props) {
    super(props)
  
    this.state = {
       deleteClicked: false,
       yesClicked: false,
       noClicked: false
    }
  }
  
  toggleButton = e => {
    this.setState({
      [e.target.name]: true
    })
  }
  
  yesClicked = () => {
    GeneralService.deleteList(this.props.list.id)
      .then(() => {
        this.setState({
          deleteClicked: false,
          yesClicked: false
        })

        /* The steps below trigger the page to re-render when a list is successfully deleted. Otherwise, you would need to refresh the page to see that the list was 
           deleted, which is not what is intended.

           ADDITIONAL NOTES: this.setState for deleteClicked and yesClicked have to come BEFORE the "resetting" the generalLists in context. Otherwise, a warning is received
           that setState is being called on an unmounted component (which can lead to performance issues). If we reset the generalLists with the removed list and call setState 
           afterwards, the component has already been deleted/unmounted, which is why the setState needs to come before
        */
        const filteredGeneralList = this.context.generalLists.filter(list => list.id !== this.props.list.id);
        this.context.setGeneralLists(filteredGeneralList);
      })
      .catch(res => {
        this.context.setError(res.error);
      })
  }

  noClicked = () => {
    this.setState({
      deleteClicked: false,
      noClicked: false
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
              name="yesClicked"
              onClick={this.yesClicked}
            >
            Yes</button>
            <button 
              type="button" 
              className="no-button"
              name="noClicked"
              onClick={this.noClicked}
            >
            No</button>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="list-entry">
        <h2 className="list-h2">{this.props.list.title}</h2>
        <input 
          type="checkbox"
          name="item"
          className="list-input"
          id="item"
        />
        <label className="list-input" htmlFor="item">{this.props.list.items}</label>
        <div className="list-buttons">
          <button 
            type="button"
            className="delete-button"
            name="deleteClicked"
            onClick={(e) => {this.toggleButton(e)}}
          >
          Delete</button>
        </div>
        {this.renderDeleteConfirmMessage()}
      </div>
    )
  }
}