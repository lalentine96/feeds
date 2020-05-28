import React from 'react';
import { connect } from 'react-redux';
import { deletePost } from '../../actions';
import { withFeedsService } from '../hoc';

import './feeds-list-item-header.css';

const HeaderDate = ({ date }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const postDate = new Date(Number(date * 1000));
  
    const addZero = (str) => {
      return ('0' + str).slice(-2);
    }
  
    return (
        <span className="date feeds-item-header-date">
        {months[postDate.getMonth()]}{' '}
        {addZero(postDate.getDate())}{', '} 
        {postDate.getFullYear()}{' '}
        {addZero(postDate.getHours())}:{addZero(postDate.getMinutes())}
        </span>
    );
}

const FeedsListItemHeader = ({ author, author_link: authorLink, subreddit, date, id, deletePost }) => {
    return (
        <div className="card-header d-flex feeds-item-header">
            <div className="mr-auto author">
                by <a 
                    href={authorLink} 
                    className="text-dark">{author}</a>
                    { 
                        !!subreddit &&
                        <>
                            {' in '}
                            <a 
                                href={`https://www.reddit.com/${subreddit}`}
                                className="text-dark" >
                                {subreddit}
                            </a>
                        </>
                    }
            </div>
            <HeaderDate date={date} />
            <button 
                className="feeds-item-delete-button btn btn-outline-secondary"
                onClick={() => deletePost(id)} >
                <i className="fa fa-trash-o"></i>
            </button>
        </div>
    );
};

const mapDispatchToProps = (dispatch, { feedsService }) => {
    return {
        deletePost: deletePost(feedsService, dispatch)
    }
}

export default withFeedsService()(
        connect(null, mapDispatchToProps)(
            FeedsListItemHeader));