import React, { Component } from 'react';
import { connect } from 'react-redux';

import { login } from '../../actions';
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
        this.props.login(currentLogin, currentPassword);

        this.setState({
            currentLogin: '',
            currentPassword: ''
        });
    };

    render() {
        const { currentLogin, currentPassword } = this.state;

        return (
            <form 
                className="login-form"
                onSubmit={this.onLogin}>
                <div className="form-group">
                    <label htmlFor="login">
                        Username
                    </label>
                    <input 
                        id="login"
                        type="text" 
                        className="form-control mb-2"
                        onChange={(e) => this.onChangeValue(e, 'currentLogin')}
                        value={currentLogin} />
                    <label htmlFor="password">
                        Password
                    </label>
                    <input 
                        id="password"
                        type="password" 
                        className="form-control"
                        onChange={(e) => this.onChangeValue(e, 'currentPassword')}
                        value={currentPassword} />
                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn btn-outline-dark mt-3">
                            Log in
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

const mapMethodsToProps = (dispatch, { feedsService }) => {
    return {
        login: login(feedsService, dispatch)
    };
};

export default withFeedsService()(
    connect(null, mapMethodsToProps)(
        LoginForm));