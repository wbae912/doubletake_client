import React, { Component } from 'react';
import GeneralService from '../../Utils/general-service';
import ListContext from '../../Context/ListContext';

export default class GeneralEditForm extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       id: null,
       title: '',
       items: ''
    }
  }
  
  componentDidMount() {
    const listId = this.props.list.id;
    GeneralService.getSpecificList(listId)
      .then(data => {
        this.setState({
          id: data.id,
          title: data.title,
          items: data.items
        })
      })
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault();

    const editList = {...this.state};
    GeneralService.editList(this.props.list.id, editList)
      .then(() => {
        const updatedLists = this.context.generalLists.map(list => (list.id === editList.id) ? editList : list);
        this.context.setGeneralLists(updatedLists);

        this.props.handleCancel(e)
      })
      .catch(res => {
        this.context.setError(res.error);
      })
  }

  render() {
    return (
      <div className="general-edit">
        <form className="edit-form" onSubmit={this.handleSubmit}>
          <div className="general-labels-inputs">
              <label className="title-label" htmlFor="list-title">List Name</label>
              <input 
                type="text"
                name="title"
                className="list-title"
                id="list-title"
                required
                value={this.state.title}
                onChange={this.handleChange}
              />
              <label className="items-label" htmlFor="items-text">Items</label>
              <p className="items-p">Please enter each item on a new line.</p>
              <textarea 
                name="items"
                className="items-text"
                id="items-text"
                required
                value={this.state.items}
                onChange={this.handleChange}
              />
            </div>
            <div className="general-buttons">
              <button type="submit" className="submit-button">Submit</button>
              <button type="button" className="cancel-button" onClick={this.props.handleCancel}>Cancel</button>
            </div>
        </form>        
      </div>
    )
  }
}
