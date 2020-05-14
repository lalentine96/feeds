import React from 'react';
import LoginForm from '../login-form';

const LoginPage = () => {
    return (
        <div className="container login-page">
            <div className="text-center">
                <h2>
                    Sign in
                </h2>
            </div>
            <LoginForm />
        </div>
        
    );
};

export default LoginPage;