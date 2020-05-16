import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';

import { loadFeeds } from '../../actions';
import FeedsListItem from '../feeds-list-item';
import { withFeedsService } from '../hoc';
import { isPageBottom } from '../../utils';

import './feeds-list.css';
import PostRemoveAlert from '../post-remove-alert/post-remove-alert';

const FeedsListContainer = ({ feeds }) => {
    
    return (
        <ul className="feeds-list list-unstyled">
            {
                feeds.map((post) => {
                    return (
                        <li key={post.id}>
                            {
                                post.deleteTimer === -1 ?
                                <FeedsListItem {...post} /> :
                                <PostRemoveAlert id={post.id}/>
                            }
                        </li>
                    );
                })
            }
        </ul>
    );
};

class FeedsList extends Component {
    _isMounted = false;

    componentDidMount() {     
        this._isMounted = true;

        this.unregisterHistoryListener = this.props.history.listen((location) => {
            if (location.pathname !== '/feeds') return;
            
            this.updatePosts(null, location);
        });

        if (!this.props.loading && this.props.login) {
            this.updatePosts();
        }

        window.onscroll = debounce(() => {

            const { loading, hasMore, error, feeds } = this.props;
            if (loading || !hasMore || error || !this._isMounted) return;

            if (isPageBottom()) {
                this.updatePosts(feeds[feeds.length - 1].id);
            } 
        }, 100);
    }

    updatePosts = (id, location = this.props.location) => {
        const { search } = location;
        const tags = queryString.parse(search).tags;
        this.props.loadFeeds(id, tags ? tags.split(',') : []);
    }

    componentWillUnmount() {
        this.unregisterHistoryListener();
        this._isMounted = false;
    }
    
    render() {
        const { feeds, loading, hasMore } = this.props;

        //console.log(this.props.loading, this.props.login);

        return (
            <>
                <FeedsListContainer feeds={feeds} />
                {
                    loading &&
                    <div className="alert alert-primary">
                        <div className="spinner-border spinner-border-sm text-primary"></div>
                        <span className="align-middle ml-2">
                            New posts are loading...
                        </span>
                    </div>
                }
                {
                    !hasMore &&
                    <div className="alert alert-primary">
                        You read all posts, time to relax
                    </div>
                }
            </>
        );
    } 
}

const mapStateToProps = (state) => ({...state});

const mapDispatchToProps = (dispatch, { feedsService }) => {
    return {
        loadFeeds: loadFeeds(feedsService, dispatch)
    };
};

export default withFeedsService()(
    connect(mapStateToProps, mapDispatchToProps)(
        withRouter(
            FeedsList)));