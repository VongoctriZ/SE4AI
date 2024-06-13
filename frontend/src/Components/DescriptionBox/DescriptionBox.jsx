import React, { useState } from 'react';
import './DescriptionBox.css';

const DescriptionBox = ({ description, displayFlag }) => {
    const [showDescription, setShowDescription] = useState(displayFlag === 'description');
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const shrinkLength = 1000; // Adjust the length as needed
    const content = expanded ? description : description.slice(0, shrinkLength);

    return (
        <div className="description-box">
            {showDescription && (
                <>
                    {parseDescriptionContent(content)}
                    {description.length > shrinkLength && (
                        <span onClick={toggleExpand} className="show-more">
                            {expanded ? ' Show less' : '... Show more'}
                        </span>
                    )}
                </>
            )}
        </div>
    );
};

// Function to parse and render the description content
const parseDescriptionContent = (content) => {
    // Split the content into paragraphs
    const paragraphs = content.split('</p>').filter(Boolean);
    return paragraphs.map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph + '</p>' }} />
    ));
};

export default DescriptionBox;
