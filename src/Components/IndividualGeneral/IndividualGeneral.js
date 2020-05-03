/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import List from '../List/List';
import GeneralService from '../../Utils/general-service';
import ListContext from '../../Context/ListContext';
import './IndividualGeneral.css';

class IndividualGeneral extends Component {
  static contextType = ListContext;
  
  constructor(props) {
    super(props)
  
    this.state = {
       list: {},
    }
  }

  componentDidMount() {
    let id = parseInt(this.props.match.params.id);

    GeneralService.getLists()
      .then(data => {
        this.context.setGeneralLists(data);
      })
      .catch(res => {
        this.context.setError(res.error);
      })
    
    GeneralService.getSpecificList(id)
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
    let generalLists = [...this.context.generalLists];
    
    return (
      <div id="individual-general">

        {this.renderLink()}

        {generalLists.map(list => {
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

export default withRouter(IndividualGeneral);