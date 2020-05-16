import React from 'react';

import './error-popup.css';

class ErrorPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shown: true
        };
    }

    onHide = () => this.setState({ shown: false });

    render() {
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
                                Sorry, we can't {this.props.err} :(
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