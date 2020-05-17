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
        e.target.closest('.login-form').classList.remove('was-validated');
        e.target.classList.remove('is-invalid');

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

    onInvalid = (e) => {
        e.preventDefault();
        e.target.classList.add('is-invalid');
        e.target.closest('.login-form').classList.add('was-validated');
    }

    render() {
        const { currentLogin, currentPassword } = this.state;
        const { id, btnLabel } = this.props;

        return (
            <form 
                className='login-form'
                onSubmit={this.onLogin}
                >
                <div className="form-group text-left">
                    <label htmlFor={id + "-login"}>
                        Username
                    </label>
                    <input 
                        id={id + "-login"}
                        type="text" 
                        pattern="^[A-Za-z][a-zA-z0-9]*$"
                        required
                        className="form-control mb-2"
                        onChange={(e) => this.onChangeValue(e, 'currentLogin')}
                        value={currentLogin} 
                        onInvalid={this.onInvalid}/>
                    <div className="invalid-feedback">
                        The login field is required and must contain only letters and numbers
                    </div>
                </div>
                <div className="form-group text-left">
                    <label htmlFor={id + "-password"}>
                        Password
                    </label>
                    <input 
                        id={id + "-password"}
                        required
                        type="password" 
                        className="form-control"
                        onChange={(e) => this.onChangeValue(e, 'currentPassword')}
                        value={currentPassword}
                        onInvalid={this.onInvalid} />
                    <div className="invalid-feedback">
                        The password field is required
                    </div>
                </div>
                <button
                    type="submit"
                    className="btn btn-outline-dark">
                    {btnLabel}
                </button>
                
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