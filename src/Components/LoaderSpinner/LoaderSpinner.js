import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Loader from 'react-loader-spinner';

class LoaderSpinner extends Component { 
  render() {
    return(
     <Loader
        type="ThreeDots"
        color="#392061"
        height={100}
        width={100}
     />
    );
   }
}

export default withRouter(LoaderSpinner);