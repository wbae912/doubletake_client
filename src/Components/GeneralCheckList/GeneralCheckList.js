import React, { Component } from 'react';
import List from '../../Components/List/List';
import GeneralListForm from '../../Components/GeneralListForm/GeneralListForm';

export default class GeneralCheckList extends Component {
  render() {
    return (
      <div className="general-lists">
        <p>This will render the general lists on the page</p>
        <List />
        <GeneralListForm />
      </div>
    )
  }
}
