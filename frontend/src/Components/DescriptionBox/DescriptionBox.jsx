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
                {/* Parse and render the description content */}
                {parseDescriptionContent(description)}
            </div>
        </div>
    );
}

// Function to parse and render the description content
const parseDescriptionContent = (content) => {
    // Split the content into paragraphs
    const paragraphs = content.split('</p>').filter(Boolean);
    return paragraphs.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
    ));
}

export default DescriptionBox;
