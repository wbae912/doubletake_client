import React, { Component } from 'react';
import Modal from 'react-modal';
import GeneralService from '../../Utils/general-service';
import ListContext from '../../Context/ListContext';
import './GeneralListForm.css';

Modal.setAppElement('#root');

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

    const newList = {...this.state};

    GeneralService.postList(newList)
      .then(data => {
        this.context.setNewGeneralList(data);
        
        /* This step is performed so that an immediate re-render is triggered when a new list is POSTed. Without this, the re-render and new list would not appear on page
           until a page refresh is performed. */
        const newGeneralList = [...this.context.generalLists];
        newGeneralList.unshift(data);
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
      <Modal
        isOpen={this.props.formClicked}
        onRequestClose={(e) => this.props.handleCancel(e)}
        style={{
          overlay: {
            backdropFilter: 'blur(3px)' 
          },
          content: {
            width: '310px',
            margin: 0,
            position: 'relative',
            top: '35%',
            bottom: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        <div className="general-form-div">
          <form 
            className="general-form"
            autoComplete="off"
            onSubmit={this.handleSubmit}
          >
            <div className="general-labels-inputs">
              <label className="title-label" htmlFor="list-title">List Name</label>
              <input 
                type="text"
                name="title"
                className="list-title"
                id="general-title-input"
                placeholder="Enter a name"
                aria-required="true"
                required
                onChange={this.handleChange}
              />
            </div>
            <div className="general-buttons">
              <button type="submit" className="submit-button" id="general-submit">Submit</button>
              <button 
                type="button" 
                className="cancel-button"
                id="general-cancel"
                onClick={this.props.handleCancel}
              >
              Cancel</button>
            </div>
          </form>
        </div>
      </Modal>
    )
  }
}
