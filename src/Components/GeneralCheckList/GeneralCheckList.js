import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

  renderLink = () => {
    if(this.context.generalSearched) {
      return (
        <Link 
          to="/general"
          onClick={this.backToGeneralLists}  
        >
          <h4 className="search-h4">← Back to all lists</h4>
        </Link>
      )
    }
  }

  backToGeneralLists = async () => {
    try {
      let generalLists = await GeneralService.getLists();
      this.context.setGeneralLists(generalLists);
      this.context.setGeneralSearchedToFalse();
    } catch(res) {
      this.context.setError(res.error);
    }
  }

  renderNoResults = () => {
    if(this.context.generalSearched && this.context.generalLists.length === 0) {
      return (
      <p className="no-results-p">No results found for '{this.context.searchTerm}'</p>
      )
    }
  }

  render() {
    return (
      <div className="general-lists">
        <p>This will render the general lists on the page</p>
        <SearchBar />

        {this.renderLink()}
        {this.renderNoResults()}

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