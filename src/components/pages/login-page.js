import React from 'react';
import LoginForm from '../login-form';
import Registration from '../registration';


export default class LoginPage extends React.Component {
    state = {
        showRegistration: false
    };

    toggleShowRegistration = () => {
        this.setState(({ showRegistration }) => {
            return { showRegistration: !showRegistration }
        });
    };

    render() {
        return (
            <div className="page container login-page text-center">
                {
                    this.state.showRegistration &&
                    <Registration onClose={this.toggleShowRegistration}/>
                }
                <div className="text-center">
                    <h2>
                        Sign in
                    </h2>
                </div>
                <LoginForm action={'login'} id='sign-in' btnLabel='Log in'/>
                <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={this.toggleShowRegistration}>
                    Sign up
                </button>
            </div>
            
        );
    }
}
