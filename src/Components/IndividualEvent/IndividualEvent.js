/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import List from '../List/List';
import EventService from '../../Utils/event-service'; 
import ListContext from '../../Context/ListContext';
import './IndividualEvent.css';

class IndividualEvent extends Component {
  static contextType = ListContext;
  
  constructor(props) {
    super(props)
  
    this.state = {
       list: {},
    }
  }

  componentDidMount() {
    let id = parseInt(this.props.match.params.id);

    EventService.getLists()
      .then(data => {
        this.context.setEventLists(data);
      })
      .catch(res => {
        this.context.setError(res.error);
      })
    
    EventService.getSpecificList(id)
      .then(data => {
        this.setState({
          list: data
        })
      })
      .catch(res => {
        this.context.setError(res.error);
      })
  }

  renderLink = () => {
    return (
      <Link 
        to="/home"
      >
        <h4 className="search-h4">← Back to home</h4>
      </Link>
    )
  }
  
  render() {
    let eventLists = [...this.context.eventLists];
    
    return (
      <div id="individual-event">

        {this.renderLink()}

        {eventLists.map(list => {
          if(list.id === this.state.list.id) {
            return (
              <List
                key={list.id}
                list={list}
              />
            )
          }
        })}

      </div>
    )
  }
}

export default withRouter(IndividualEvent);