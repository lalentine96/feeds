import React from 'react';

import Tag from '../tag';

const Tags = ({ tags, onDeleteTag = null, onTagClick = () => {} }) => {

    return (
        <div className="d-flex">
            {
                Array.from(tags).map((tag) => {
                    return (
                        <Tag 
                            key={tag} 
                            tag={tag}
                            onDeleteTag={onDeleteTag ? () => onDeleteTag(tag) : null}
                            onClick={() => onTagClick(tag)} />);
                    })
            }
        </div>
    );
};

export default Tags;