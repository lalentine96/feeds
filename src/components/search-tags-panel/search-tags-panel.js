import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import Tags from '../tags';
import { suggestTags } from '../../actions';
import { withFeedsService } from '../hoc';
import { changeTag } from '../../utils';

import './search-tags-panel.css';

class SearchTagsPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prefix: '',
            tags: new Set()
        };
    }

    initialState = (location) => {
        const { tags } = queryString.parse(location.search);

        return {
            prefix: '',
            tags: new Set(tags ? tags.split(',') : [])
        };
    }

    componentDidMount() {
        this.setState(this.initialState(this.props.location));

        this.unregisterHistoryListener = this.props.history.listen((location) => {
            if (location.pathname !== '/feeds') return;
            
            this.setState(this.initialState(location));
        });
    }

    componentWillUnmount() {
        this.unregisterHistoryListener();
    }

    onChangePrefix = (e) => {

        const value = e.target.value.trim();

        if (value !== '') this.props.suggestTags(value);

        this.setState({
            prefix: value,
        });
    };

    onChangeFilterTag = (tag, action) => {
        const newState = changeTag(this.state, tag, action);

        const queryObj = {
            tags: Array.from(newState.tags).join(',')
        };

        const queryStr = queryObj.tags ? `?${queryString.stringify(queryObj)}` : '';

        this.props.history.push(`feeds${queryStr}`);

    };

    render() {
        const { suggestedTags } = this.props;
        const { prefix, tags } = this.state;
        const filteredSuggest = suggestedTags.filter(tag => !tags.has(tag))

        return (
                <div className="form-group search-tags-panel mb-2">
                    <input 
                        type="text"
                        className="form-control"
                        placeholder="Enter the tag you want to search by"
                        value={prefix}
                        onChange={this.onChangePrefix} />
                    {
                        tags.size !== 0 &&
                        <div className="container px-0 pt-2 filter-tags">
                            <Tags 
                                tags={tags}
                                onDeleteTag={tag => this.onChangeFilterTag(tag, 'delete')} />
                        </div>
                    }
                    {
                        !!filteredSuggest.length && prefix !== '' &&
                        <div className="container bg-light py-3 suggested-tags">
                            <Tags 
                                tags={filteredSuggest}
                                onTagClick={tag => this.onChangeFilterTag(tag, 'add')} />
                        </div>
                    }
                </div> 
        );
    }
}

const mapStateToProps = ({ suggestedTags }) => ({ suggestedTags });

const mapMethodsToProps = (dispatch, { feedsService }) => {
    return {
        suggestTags: suggestTags(feedsService, dispatch)
    };
};

export default withRouter(
    withFeedsService()(
        connect(mapStateToProps, mapMethodsToProps)(
            SearchTagsPanel)));