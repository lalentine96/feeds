import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { FeedsPage, LoginPage } from '../pages';
import { withFeedsService } from '../hoc';
import { checkLogin } from '../../actions';

import './app.css';

class App extends Component {

    constructor(props) {
        super(props);
        props.checkLogin();
    }

    render() {

        return (
            <div className="app jumbotron mb-0 min-vh-100">

                <Route path="/feeds" component={FeedsPage} />;
                <Route path="/login" component={LoginPage} />

                {
                    !this.props.login ?
                    <Redirect to="/login" /> :
                    window.location.pathname !== '/feeds' &&
                    <Redirect to="/feeds" />
                }

            </div> 
        );
    }
};

const mapStateToProps = ({ login, loading, feeds }) => ({ login, loading, feeds });

const mapMethodsToProps = (dispatch, { feedsService }) => {
    return {
        checkLogin: checkLogin(feedsService, dispatch)
    };
};

export default withFeedsService()(
    connect(mapStateToProps, mapMethodsToProps)(
        App));