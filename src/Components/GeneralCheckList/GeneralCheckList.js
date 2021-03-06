import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import LoaderSpinner from '../LoaderSpinner/LoaderSpinner';
import List from '../../Components/List/List';
import GeneralListForm from '../../Components/GeneralListForm/GeneralListForm';
import SearchBar from '../SearchBar/SearchBar';
import SortOptions from '../SortOptions/SortOptions';
import GeneralService from '../../Utils/general-service';
import ListContext from '../../Context/ListContext';
import './GeneralCheckList.css';

class GeneralCheckList extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       formClicked: false,
       sortOption: '',
       loading: false,
       error: null
    }
  }

  componentDidMount() {
    this.setState({
      loading: true
    })

    GeneralService.getLists()
      .then(data => {
        this.context.setGeneralLists(data);
        this.setState({
          loading: false
        })
      })
      .catch(res => {
        this.setState({
          error: res.error,
          loading: false
        })
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
        <div className="list-form-div" aria-live="polite">
          <button
            type="button" 
            className="list-form-button"
            id="create-list-button"
            onClick={this.toggleButton}
          >
          Create New List</button>
        </div>
      )} else {
        return (
          <GeneralListForm
            formClicked={this.state.formClicked}
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
      this.setState({
        error: res.error
      })    
    }
  }

  renderNoResults = () => {
    if(this.context.generalSearched && this.context.generalLists.length === 0) {
      return (
      <p className="no-results-p">No results found for '{this.context.searchTerm}'</p>
      )
    }
  }

  handleSortChange = e => {
    this.setState({
      sortOption: e.target.value
    })
  }

  handleGeneral = () => {
    if(this.props.match.path === '/general') {
      return;
    }
  }

  handleEvent = () => {
    if(this.props.match.path === '/general') {
      this.props.history.push('/event');
    }
  }

  renderLoader = () => {
    if(this.state.loading) {
      return (
        <div className="load-div">
          <Modal
            isOpen={this.state.loading}
            style={{
              overlay: {
                backdropFilter: 'blur(3px)' 
              },
              content: {
                margin: 0,
                backgroundColor: 'transparent',
                width: '100px',
                border: 'none',
                position: 'relative',
                top: '40%',
                bottom: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }
            }}
          >
            <LoaderSpinner />
          </Modal>
        </div>
      )
    }
  }

  render() {
    let generalLists = this.context.generalLists;

    //  1: Or positive => Elements go in DESC order
    // -1: Or negative => Elements go in ASC order
    //  0: Elements are equal
    if(this.state.sortOption === '1') {
      generalLists = generalLists.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
    }
    if(this.state.sortOption === '2') {
      generalLists = generalLists.sort((a,b) => (b.title > a.title) ? 1 : ((a.title > b.title) ? -1 : 0))
    }

    // Newer lists will have a higher ID, so we are sorting by ID in descending order
    // Additionally, we use default option 0 as Newest => Oldest because that is what the default order in which lists are returned when fetched from the database
    if(this.state.sortOption === '3' || this.state.sortOption === '0') {
      generalLists = generalLists.sort((a,b) => b.id - a.id)
    }
    // Older lists will have a lower ID, so we are sorting by ID in ascending order
    if(this.state.sortOption === '4') {
      generalLists = generalLists.sort((a,b) => a.id - b.id)
    }

    return (
      <div className="general-lists">
        <div className="list-direct">
          <p
            className="general-direct"
            onClick={this.handleGeneral}
          >General</p>
          <p
          className="event-direct"
            onClick={this.handleEvent}
          >Events</p>
        </div>

        {!this.context.generalSearched   
          ?
          <>    
            <SearchBar />
            <SortOptions 
              handleSortChange={this.handleSortChange}
            />
    
            {this.renderForm()}
          </>
          :
          <>
            <SearchBar />
          </>
        }

        {this.renderLink()}
        {this.renderNoResults()}

        <div className="list-render-div">
          {generalLists.map(list => 
            <List 
              key={list.id}
              list={list}
            />
          )}
        </div>

        {this.renderLoader()}
      </div>
    )
  }
}

export default withRouter(GeneralCheckList);