import React, { Component } from 'react';
import GeneralService from '../../Utils/general-service';
import ListContext from '../../Context/ListContext';

export default class GeneralListForm extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       title: ''
    }
  }
  
  handleChange = e => {
    this.setState({
      title: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault();

    // Spread operator to copy state into new object
    const newList = {...this.state};

    GeneralService.postList(newList)
      .then(data => {
        this.context.setNewGeneralList(data);
        
        /* This step is performed so that an immediate re-render is triggered when a new list is POSTed. Without this, the re-render and new list would not appear on page
           until a page refresh is performed. */
        const newGeneralList = [...this.context.generalLists];
        newGeneralList.push(data);
        this.context.setGeneralLists(newGeneralList);

        this.props.handleCancel(e);
      })
      .catch(res => {
        this.context.setError(res.error);
      })
    
    // Resets the values of the input fields after Submit
    e.target.title.value = '';
  }

  render() {
    return (
      <div className="general-form-div">
        <h2 className="general-form-h2">Create List</h2>
        <form 
          className="general-form"
          onSubmit={this.handleSubmit}
        >
          <div className="general-labels-inputs">
            <label className="title-label" htmlFor="list-title">List Name</label>
            <input 
              type="text"
              name="title"
              className="list-title"
              id="list-title"
              required
              onChange={this.handleChange}
            />
            {/* <label className="items-label" htmlFor="items-text">Items</label>
            <p className="items-p">Please enter each item on a new line.</p>
            <textarea 
              name="items"
              className="items-text"
              id="items-text"
              required
              onChange={this.handleChange}
            /> */}
          </div>
          <div className="general-buttons">
            <button type="submit" className="submit-button">Submit</button>
            <button 
              type="button" 
              className="cancel-button"
            >
            Cancel</button>
          </div>
        </form>
      </div>
    )
  }
}
