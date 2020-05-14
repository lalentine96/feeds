import React from 'react';

import './feeds-list-item.css';
import FeedsListItemHeader from '../feeds-list-item-header';
import FeedsListItemContent from '../feeds-list-item-content';
import FeedsListItemFooter from '../feeds-list-item-footer';

const FeedsListItem = (props) => {
    return (
        <div className="card feeds-list-item">
            <FeedsListItemHeader {...props} />
            <FeedsListItemContent {...props} />
            <FeedsListItemFooter {...props}/>
        </div>
    );
}

export default FeedsListItem;