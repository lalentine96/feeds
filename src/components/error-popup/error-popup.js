import React from 'react';

import './error-popup.css';

class ErrorPopup extends React.Component {
    state = {
        shown: true
    };
    
    onHide = () => this.setState({ shown: false });

    render() {
        const { err } = this.props;

        return (
            this.state.shown &&
            <div className="error-popup">
                <div 
                    className="show modal-backdrop"
                    onClick={this.onHide}></div>
                <div className="modal show">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Oops! Something goes wrong</h5>
                            </div>
                            <div className="modal-body">
                                {
                                    err === 'wrong login' ?
                                    'Wrong login or password. Please try again' :
                                    err === 'user exists' ?
                                    'User with this login already exists. Please change it' :
                                    `Sorry, we can't ${err} :(`
                                }
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-danger"
                                    onClick={this.onHide}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
}

export default ErrorPopup;