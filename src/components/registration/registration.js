import React from 'react';

import LoginForm from '../login-form';

import './registration.css';

const Registration = ({ onClose }) => {

    return (
        <div className="registration">
            <div 
                className="show modal-backdrop"
                onClick={onClose}
            ></div>
            <div className="modal show">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Sign up</h5>
                            <button type="button" className="close" onClick={onClose}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <LoginForm 
                                action='register' 
                                id='sign-up' 
                                btnLabel='Sign up and log in'/>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    );
}

export default Registration;