import React, { Component } from 'react';
import List from '../../Components/List/List';
import GeneralListForm from '../../Components/GeneralListForm/GeneralListForm';
import GeneralService from '../../Utils/general-service';
import ListContext from '../../Context/ListContext';

export default class GeneralCheckList extends Component {
  static contextType = ListContext;

  componentDidMount() {
    GeneralService.getLists()
      .then(data => {
        this.context.setGeneralLists(data);
      })
      .catch(res => {
        return this.context.setError(res.error);
      })
  }

  render() {
    return (
      <div className="general-lists">
        <p>This will render the general lists on the page</p>
        
        {this.context.generalLists.map(list => 
          <List 
            key={list.id}
            list={list}
          />
        )}

        <GeneralListForm />
      </div>
    )
  }
}