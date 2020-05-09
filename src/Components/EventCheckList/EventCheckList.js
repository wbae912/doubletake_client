import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import LoaderSpinner from '../LoaderSpinner/LoaderSpinner';
import List from '../../Components/List/List';
import EventListForm from '../../Components/EventListForm/EventListForm';
import SearchBar from '../SearchBar/SearchBar';
import SortOptions from '../SortOptions/SortOptions';
import EventService from '../../Utils/event-service';
import ListContext from '../../Context/ListContext';
import './EventCheckList.css';

class EventCheckList extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       formClicked: false,
       sortOption: '',
       loading: false
    }
  }

  componentDidMount() {
    this.setState({
      loading: true
    })

    EventService.getLists()
      .then(data => {
        this.context.setEventLists(data);
        this.setState({
          loading: false
        })
      })
      .catch(res => {
        this.context.setError(res.error);
        this.setState({
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
          <EventListForm
            formClicked={this.state.formClicked} 
            handleCancel={this.handleCancel}
          />
        )}
  }

  renderLink = () => {
    if(this.context.eventSearched) {
      return (
        <Link 
          to="/event"
          onClick={this.backToEventLists}  
        >
          <h4 className="search-h4">← Back to all lists</h4>
        </Link>
      )
    }
  }

  backToEventLists = async () => {
    try {
      let eventLists = await EventService.getLists();
      this.context.setEventLists(eventLists);
      this.context.setEventSearchedToFalse();
    } catch(res) {
      this.context.setError(res.error);
    }
  }

  renderNoResults = () => {
    if(this.context.eventSearched && this.context.eventLists.length === 0) {
      return (
      <p className="no-results-p" aria-live="polite">No results found for '{this.context.searchTerm}'</p>
      )
    }
  }

  handleSortChange = e => {
    this.setState({
      sortOption: e.target.value
    })
  }

  handleEvent = () => {
    if(this.props.match.path === '/event') {
      return;
    }
  }

  handleGeneral = () => {
    if(this.props.match.path === '/event') {
      this.props.history.push('/general');
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
    let eventLists = this.context.eventLists;

    //  1: Or positive => Elements go in DESC order
    // -1: Or negative => Elements go in ASC order
    //  0: Elements are equal
    if(this.state.sortOption === '1') {
      eventLists = eventLists.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
    }
    if(this.state.sortOption === '2') {
      eventLists = eventLists.sort((a,b) => (b.title > a.title) ? 1 : ((a.title > b.title) ? -1 : 0));
    }

    // Newer lists will have a higher ID, so we are sorting by ID in descending order
    // Additionally, we use default option 0 as Newest => Oldest because that is what the default order in which lists are returned when fetched from the database
    if(this.state.sortOption === '3' || this.state.sortOption === '0') {
      eventLists = eventLists.sort((a,b) => b.id - a.id);
    }
    // Older lists will have a lower ID, so we are sorting by ID in ascending order
    if(this.state.sortOption === '4') {
      eventLists = eventLists.sort((a,b) => a.id - b.id);
    }

    // Need to use new Date when sorting dates
    if(this.state.sortOption === '5') {
      eventLists = eventLists.sort((a,b) => new Date(a.date_of_event) - new Date(b.date_of_event));
    }
    if(this.state.sortOption === '6') {
      eventLists = eventLists.sort((a,b) => new Date(b.date_of_event) - new Date(a.date_of_event));
    }
  
    return (
      <div className="event-lists">
        <div className="list-direct">
          <p
            className="direct-general"
            onClick={this.handleGeneral}
          >General</p>
          <p
          className="direct-event"
            onClick={this.handleEvent}
          >Events</p>
        </div>

        {!this.context.eventSearched   
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
        {eventLists.map(list => 
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

export default withRouter(EventCheckList);