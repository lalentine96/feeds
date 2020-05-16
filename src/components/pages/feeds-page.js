import React from 'react';
import FeedsList from '../feeds-list';
import SearchTagsPanel from '../search-tags-panel';
import FeedsButtonPanel from '../feeds-button-panel';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { withFeedsService } from '../hoc';
import { logout } from '../../actions';

const FeedsPage = ({ logout, isDemo, feedsService, history }) => {
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
            <FeedsButtonPanel>
                {buttons}
            </FeedsButtonPanel>
            <SearchTagsPanel />
            <FeedsList />
        </div>
    );
};

const mapStateToProps = ({ isDemo }) => ({ isDemo });

const mapDispatchToProps = (dispatch, { feedsService }) => {
    return {
        logout: logout(feedsService, dispatch),
        //reset: reset(feedsService, dispatch),
    };
};

export default withFeedsService()(
                    connect(mapStateToProps, mapDispatchToProps)(
                        withRouter(FeedsPage)));