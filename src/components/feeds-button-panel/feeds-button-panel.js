import React from 'react';

import './feeds-button-panel.css';

const FeedsButtonPanel = ({ children }) => {
    return (
        <div className="feeds-button-panel">
            { children.map(({ label, onClick=() => {} }) => {
                return (
                    <button 
                        className="btn btn-outline-dark mr-2"
                        key={label}
                        onClick={onClick}>
                        {label}
                    </button>
                )
            }) }
        </div>
    );
};

export default FeedsButtonPanel;