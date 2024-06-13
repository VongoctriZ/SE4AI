import React, { useState } from 'react';
import './DescriptionBox.css';

const DescriptionBox = ({ description, displayFlag }) => {
    const [showDescription, setShowDescription] = useState(displayFlag === 'description');

    const toggleDescription = () => {
        setShowDescription('description');
    };

    return (
        <div className="description-box">
            <div className="description-box-description">
                {showDescription && parseDescriptionContent(description)}
            </div>
        </div>
    );
};

// Function to parse and render the description content
const parseDescriptionContent = (content) => {
    // Split the content into paragraphs
    const paragraphs = content.split('</p>').filter(Boolean);
    return paragraphs.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
    ));
};

export default DescriptionBox;