import React, { Component } from 'react';
import { connect } from 'react-redux';

import { restorePost } from '../../actions';
import { withFeedsService } from '../hoc';

class PostRemoveAlert extends Component {
    state = {
        secondsToDelete: 3
    };

    timerId = -1;

    componentDidMount() {   
        this.timerID = setInterval(
            () => {
                this.setState(({ secondsToDelete }) => {
                    return {
                        secondsToDelete: secondsToDelete - 1
                    };
            })}, 1000); 
        //console.log(this.timerID); 
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        const { secondsToDelete } = this.state;
        const { restorePost, id } = this.props;

        return (
            <div className="alert alert-warning alert-dismissible">
                {/* <button type="button" className="close" data-dismiss="alert">&times;</button> */}
                The post will be deleted in {secondsToDelete} seconds. <span 
                    onClick={() => {restorePost(id)}}
                    className="alert-link">To restore</span>
            </div>
        );
    }

}

const mapDispatchToProps = (dispatch, { feedsService }) => {
    return {
        restorePost: restorePost(feedsService, dispatch)
    };
};

export default withFeedsService()(
    connect(null, mapDispatchToProps)(
        PostRemoveAlert));