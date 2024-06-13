import React, { useState, useEffect } from 'react';
import './CommentBox.css';
import { FaStar } from 'react-icons/fa';
import { format } from 'date-fns';

const CommentBox = ({ comments, displayFlag }) => {
  const [showComments, setShowComments] = useState(displayFlag === 'comments');
  const [expandedComments, setExpandedComments] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);

  const shrinkLength = 150;
  const displayComments = 5;

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
  };

  const toggleExpand = (index) => {
    setExpandedComments((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  // Sort comments by rating in descending order
  const sortedComments = [...comments].sort((a, b) => b.rating - a.rating);

  // Determine which comments to display
  const displayedComments = showAllComments ? sortedComments : sortedComments.slice(0, displayComments);

  const toggleShowAllComments = () => {
    setShowAllComments((prevShowAll) => !prevShowAll);
  };

  return (
    <div className="comment-box">
      {showComments &&
        displayedComments.map((comment, index) => {
          const isExpanded = expandedComments[index];
          const content = isExpanded ? comment.content : comment.content.slice(0, shrinkLength);

          return (
            <div key={index} className={`comment ${isExpanded ? 'expanded' : ''}`}>
              <div className="user-info">
                <p>{comment.created_by.full_name}</p>
                <div className="rating">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar
                      key={i}
                      color={i < comment.rating ? '#ffc107' : '#e4e5e9'}
                    />
                  ))}
                </div>
              </div>
              <div className="created-at">
                <p>{formatDate(comment.create_at)}</p>
              </div>
              <div className="content">
                <p>
                  {content}
                  {comment.content.length > shrinkLength && (
                    <span onClick={() => toggleExpand(index)} className="show-more">
                      {isExpanded ? ' Show less' : '... Show more (xem thêm)'}
                    </span>
                  )}
                </p>
              </div>
              <div className="images">
                {comment.images && comment.images.length > 0 && (
                  <div>
                    {comment.images.map((image, i) => (
                      <img key={i} src={image} alt={`comment-${index}-image-${i}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

      {sortedComments.length > displayComments && (
        <button onClick={toggleShowAllComments} className="toggle-comments-btn">
          {showAllComments ? 'Show Less' : 'Show All Comments'}
        </button>
      )}
    </div>
  );
};

export default CommentBox;
