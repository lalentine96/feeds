import React from 'react';

import Tags from '../tags';
import AddTagForm from '../add-tag-form';

import './feeds-list-item-footer.css';

const FeedsListItemFooter = ({ tags, original_url: url, source_type: sourceType, id }) => {
    return (
        <>
            <div className="card-footer">
                <AddTagForm  tags={tags} id={id}/>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    <a 
                        href={url} 
                        className={`source-link ${sourceType}`}>
                    </a>
                    <a 
                        href={url}
                        className="align-top ml-1 text-dark">
                        See with comments
                    </a>
                </li>
            </ul>
        </>

    );
};

export default FeedsListItemFooter;