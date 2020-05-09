import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Loader from 'react-loader-spinner';

class LoaderSpinner extends Component { 
  render() {
    let color = '';
    if(this.props.match.path === '/event' || this.props.match.path === '/elist/:id') {
      color = '#A346A3';
    } else {
      color = "#392061";
    }
    return(
     <Loader
        type="ThreeDots"
        color={color}
        height={100}
        width={100}
     />
    );
   }
}

export default withRouter(LoaderSpinner);