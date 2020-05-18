import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeTag } from '../../actions';
import Tags from '../tags';
import { withFeedsService } from '../hoc';

import './add-tag-form.css';

class AddTagForm extends Component {
    state = {
        currentTag: ''
    };

    onChangeCurrentTag = (e) => {
        this.setState({
            currentTag: e.target.value
        });
    };

    onAddTag = (e) => {
        e.preventDefault();
        const { changeTag, id } = this.props;
        const { currentTag } = this.state;

        if (!currentTag.trim()) return;
        
        changeTag(id, false, currentTag.trim());
        this.setState({
            currentTag: ''
        });
    }

    render() {
        const { tags, id, changeTag } = this.props;
        const { currentTag } = this.state;

        return (
            <>
                <Tags 
                    tags={tags} 
                    onDeleteTag={tag => changeTag(id, true, tag)}/>
                <form
                    className="form-inline"
                    onSubmit={this.onAddTag }>
                    <input 
                        type="text" 
                        className="form-control mt-2 add-tag-input"
                        placeholder="Put new tag here"
                        value={currentTag}
                        onChange={this.onChangeCurrentTag} />
                    <button
                        type="submit"
                        className="add-tag-submit btn btn-outline-secondary mt-2"
                        >
                        Add
                    </button>
                </form>
            </>
        );
    }
}

const mapMethodsToProps = (dispatch, { feedsService }) => {
    return {
        changeTag: changeTag(feedsService, dispatch),
    };
};

export default withFeedsService()(
    connect(null, mapMethodsToProps)(
        AddTagForm));