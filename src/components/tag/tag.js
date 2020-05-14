import React from 'react';

import './tag.css';

const Tag = ({ tag, onClick, onDeleteTag = null }) => {

    return (
        <div
            className="col-sm-4-2 border border-secondary rounded mx-1 px-1"
            onClick={onClick}>
            {tag}
            {
                onDeleteTag &&
                <button 
                    className="ml-1 p-0 tag-close text-dark"
                    onClick={onDeleteTag} >
                    <i className="fa fa-times"></i>
                </button>
            }
        </div>
    );
};

export default Tag;