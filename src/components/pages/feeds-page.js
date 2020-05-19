import React from 'react';
import FeedsList from '../feeds-list';
import SearchTagsPanel from '../search-tags-panel';
import FeedsButtonPanel from '../feeds-button-panel';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { withFeedsService } from '../hoc';
import { logout } from '../../actions';

const FeedsPage = ({ logout, isDemo, login, feedsService, history }) => {
    const onReset = () => {
        feedsService.reset()
            .then(() => history.push('feeds'))
            .catch((err) => console.log(err));
    }

    let buttons = [ {label: 'Log out', onClick: logout} ];

    if (isDemo) {
        buttons.push({ label: 'Reset', onClick: onReset });
    }

    return (
        <div className="page feeds-page">
            <div className="greeting">
                <h2>Hello {login}!</h2>
                {
                    isDemo &&
                    <h5>You work with demo of the project</h5>
                }
            </div>
            <FeedsButtonPanel>
                {buttons}
            </FeedsButtonPanel>
            <SearchTagsPanel />
            <FeedsList />
        </div>
    );
};

const mapStateToProps = ({ isDemo, login }) => ({ isDemo, login });

const mapDispatchToProps = (dispatch, { feedsService }) => {
    return {
        logout: logout(feedsService, dispatch),
        //reset: reset(feedsService, dispatch),
    };
};

export default withFeedsService()(
                    connect(mapStateToProps, mapDispatchToProps)(
                        withRouter(FeedsPage)));