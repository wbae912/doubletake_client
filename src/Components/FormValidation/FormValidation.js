import React from 'react';
import PropTypes from 'prop-types';
import './FormValidation.css';

function FormValidation (props) {
    if (props.message) {
        return (
            <div className="error-message" aria-live="polite">
                {props.message}
            </div>
        );
    }
    return <></>
}

export default FormValidation;

FormValidation.propTypes = {
    message: PropTypes.string
}