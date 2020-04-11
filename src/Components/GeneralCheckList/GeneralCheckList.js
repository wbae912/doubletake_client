import React, { Component } from 'react';
import List from '../../Components/List/List';
import GeneralListForm from '../../Components/GeneralListForm/GeneralListForm';
import SearchBar from '../SearchBar/SearchBar';
import GeneralService from '../../Utils/general-service';
import ListContext from '../../Context/ListContext';

export default class GeneralCheckList extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       formClicked: false
    }
  }

  componentDidMount() {
    GeneralService.getLists()
      .then(data => {
        this.context.setGeneralLists(data);
      })
      .catch(res => {
        return this.context.setError(res.error);
      })
  }

  toggleButton = e => {
    this.setState({
      formClicked: true
    })
  }

  handleCancel = e => {
    this.setState({
      formClicked: false
    })
  }

  renderForm = () => {
    if(!this.state.formClicked) {
      return (
        <div className="list-form-div">
          <p className="list-form-p">Create New List</p>
          <button
            type="button" 
            className="list-form-button"
            onClick={this.toggleButton}
          >
          +</button>
        </div>
      )} else {
        return (
          <GeneralListForm 
            handleCancel={this.handleCancel}
          />
        )}
  }

  render() {
    return (
      <div className="general-lists">
        <p>This will render the general lists on the page</p>
        <SearchBar />

        {this.context.generalLists.map(list => 
          <List 
            key={list.id}
            list={list}
          />
        )}

        {this.renderForm()}
        
      </div>
    )
  }
}