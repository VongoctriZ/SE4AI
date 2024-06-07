import React from 'react';
import './DescriptionBox.css';

const DescriptionBox = (props) => {
    const { description, review_counts } = props;

    return (
        <div className="description-box">
            <div className="description-box-navigator">
                <div className="description-box-nav-box">Description</div>
                <div className="description-box-nav-box fade">Reviews ({review_counts})</div>
            </div>
            <div className="description-box-description">
                <p>{description}</p>
            </div>
        </div>
    );
}

export default DescriptionBox;