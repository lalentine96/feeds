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
        const { tags } = queryString.parse(props.location.search);

        this.state = {
            prefix: '',
            tags: new Set(tags ? tags.split(',') : [])
        };
    }

    onChangePrefix = (e) => {

        const value = e.target.value.trim();

        if (value !== '') this.props.suggestTags(value);

        this.setState({
            prefix: value,
        });
    };

    onChangeFilterTag = (tag, action) => {
        this.setState(state => {
            const newState = changeTag(state, tag, action);

            const queryObj = {
                tags: Array.from(newState.tags).join(',')
            };

            const queryStr = queryObj.tags ? `?${queryString.stringify(queryObj)}` : '';

            this.props.history.push(`feeds${queryStr}`)

            return {
                ...newState,
                prefix: ''
            };
        }); 
    };

    render() {
        const { suggestedTags } = this.props;

        return (
                <div className="form-group search-tags-panel">
                    <input 
                        type="text"
                        className="form-control"
                        placeholder="Enter the tag you want to search for posts by"
                        value={this.state.prefix}
                        onChange={this.onChangePrefix} />
                    {
                        this.state.tags.size !== 0 &&
                        <div className="container px-0 pt-2">
                            <Tags 
                                tags={this.state.tags}
                                onDeleteTag={tag => this.onChangeFilterTag(tag, 'delete')} />
                        </div>
                    }
                    {
                        suggestedTags.size !== 0 && this.state.prefix !== '' &&
                        <div className="container bg-light py-3 suggested-tags">
                            <Tags 
                                tags={suggestedTags}
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