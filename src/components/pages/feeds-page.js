import React from 'react';
import FeedsList from '../feeds-list';
import SearchTagsPanel from '../search-tags-panel';
import FeedsButtonPanel from '../feeds-button-panel';

import { connect } from 'react-redux';
import { withFeedsService } from '../hoc';
import { logout } from '../../actions';

const FeedsPage = ({ logout }) => {
    return (
        <div className="feeds-page">
            <FeedsButtonPanel>
                {[
                    {label: 'Log out', onClick: logout}, 
                    {label: 'Reset'}
                ]}
            </FeedsButtonPanel>
            <SearchTagsPanel />
            <FeedsList />
        </div>
    );
};

const mapDispatchToProps = (dispatch, { feedsService }) => {
    return {
        logout: logout(feedsService, dispatch)
    };
};


export default withFeedsService()(
    connect(null, mapDispatchToProps)(FeedsPage));