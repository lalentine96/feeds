import React, { Component } from 'react';
import { connect } from 'react-redux';

import { auth } from '../../actions';
import { withFeedsService } from '../hoc';

import './login-form.css';

class LoginForm extends Component {
    state = {
        currentLogin: '',
        currentPassword: ''
    };

    onChangeValue = (e, field) => {
        const value = e.target.value;
        this.setState((state) => {
            let newState = {...state};
            newState[field] = value;
            return {...newState};
        });
    }

    onLogin = (e) => {
        e.preventDefault();

        const { currentLogin, currentPassword } = this.state;
        this.props.submit(currentLogin, currentPassword);

        this.setState({
            currentLogin: '',
            currentPassword: ''
        });
    };

    render() {
        const { currentLogin, currentPassword } = this.state;
        const { id, btnLabel } = this.props;

        return (
            <form 
                className="login-form"
                onSubmit={this.onLogin}>
                <div className="form-group">
                    <label htmlFor={id + "-login"}>
                        Username
                    </label>
                    <input 
                        id={id + "-login"}
                        type="text" 
                        className="form-control mb-2"
                        onChange={(e) => this.onChangeValue(e, 'currentLogin')}
                        value={currentLogin} />
                    <label htmlFor={id + "-password"}>
                        Password
                    </label>
                    <input 
                        id={id + "-password"}
                        type="password" 
                        className="form-control"
                        onChange={(e) => this.onChangeValue(e, 'currentPassword')}
                        value={currentPassword} />
                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn btn-outline-dark mt-3">
                            {btnLabel}
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

const mapMethodsToProps = (dispatch, { feedsService, action }) => {
    return {
        submit: auth(feedsService, dispatch, action)
    };
};


export default withFeedsService()(
    connect(null, mapMethodsToProps)(
        LoginForm));