import React, { Component } from 'react';
import Modal from 'react-modal';
import GeneralService from '../../Utils/general-service';
import ListContext from '../../Context/ListContext';
import './GeneralEditForm.css';

Modal.setAppElement('#root');

export default class GeneralEditForm extends Component {
  static contextType = ListContext;

  constructor(props) {
    super(props)
  
    this.state = {
       id: null,
       title: ''
    }
  }
  
  componentDidMount() {
    const listId = this.props.list.id;
    GeneralService.getSpecificList(listId)
      .then(data => {
        this.setState({
          id: data.id,
          title: data.title
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
        const generalLists = [...this.context.generalLists];
        const updatedLists = generalLists.map(list => (list.id === editList.id) ? editList : list);
        this.context.setGeneralLists(updatedLists);

        this.props.handleCancel(e)
      })
      .catch(res => {
        this.context.setError(res.error);
      })
  }

  render() {
    return (
      <Modal // By default, clicking outside the modal will close it
        isOpen={this.props.editClicked} // Modal will open if editClicked is "true"
        onRequestClose={(e) => this.props.handleCancel(e)} // Pressing "Esc" key will exit modal
        style={{
          overlay: {
            backdropFilter: 'blur(3px)' 
          },
          content: {
            margin: 0,
            width: '310px',
            position: 'relative',
            top: '35%',
            left: '50%',
            bottom: '45%',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        <div className="general-edit">
          <form className="edit-form" onSubmit={this.handleSubmit}>
            <div className="general-labels-inputs">
                <label className="title-label" htmlFor="list-title">Edit List Name</label>
                <input 
                  type="text"
                  name="title"
                  className="list-title"
                  id="list-title"
                  placeholder="Enter a name"
                  required
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </div>
              <div className="general-buttons">
                <button type="submit" className="submit-button" id="submit-list-edit">Submit</button>
                <button type="button" className="cancel-button" id="cancel-list-edit" onClick={this.props.handleCancel}>Cancel</button>
              </div>
          </form>        
        </div>
      </Modal>
    )
  }
}