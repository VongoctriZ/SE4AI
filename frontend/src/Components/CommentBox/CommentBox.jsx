import { useState, useContext } from 'react';
import { FaStar } from 'react-icons/fa';
import './CommentBox.css';
import { format } from 'date-fns';
import { ShopContext } from '../../Context/ShopContext';
import insertPicture from '../Assets/insertPicture.png';

const CommentBox = ({ comments, displayFlag, product_id }) => {
  const [showComments, setShowComments] = useState(displayFlag === 'comments');
  const [expandedComments, setExpandedComments] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);
  const { user } = useContext(ShopContext);

  // State for new comment
  const [newComment, setNewComment] = useState({
    rating: 0,
    content: '',
    product_id: product_id,
    created_by: user ? { id: user.Id, full_name: user.fullName } : { id: null, full_name: '' },
    create_at: new Date().toISOString(),
  });

  // Function to handle rating change
  const handleRatingChange = (rating) => {
    setNewComment({ ...newComment, rating });
  };

  // Function to handle content change
  const handleContentChange = (e) => {
    setNewComment({ ...newComment, content: e.target.value });
  };

  // Function to toggle expand/collapse of comments
  const toggleExpand = (index) => {
    setExpandedComments((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  // Sort comments by rating, then by creation time
  const sortedComments = [...comments].sort((a, b) => {
    if (b.rating === a.rating) {
      return new Date(b.create_at) - new Date(a.create_at);
    }
    return b.rating - a.rating;
  });

  // Display only a subset of comments based on showAllComments state
  const displayedComments = showAllComments ? sortedComments : sortedComments.slice(0, 5);

  // Function to toggle show all comments
  const toggleShowAllComments = () => {
    setShowAllComments((prevShowAll) => !prevShowAll);
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return ''; // Handle empty dateString gracefully

      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }

      return format(date, 'yyyy-MM-dd HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return ''; // Return empty string or handle error as per your application's requirement
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call API to create comment
      const response = await fetch('http://localhost:4000/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
      });
      const data = await response.json();

      if (data.success) {
        console.log('Comment created successfully:', data.comment);
        setNewComment({
          rating: 0,
          content: '',
          product_id: product_id,
          created_by: user ? { id: user.Id, full_name: user.fullName } : { id: null, full_name: '' },
          create_at: new Date().toISOString(),
        }); // Reset form
      } else {
        throw new Error('Failed to create comment');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      // Handle error as needed
    }
  };

  return (
    <div className="comment-box">
      <div className="new-comment-form">
        <h3>Leave a Comment</h3>
        <form onSubmit={handleSubmit}>
          <div className="rating">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                color={i < newComment.rating ? '#ffc107' : '#e4e5e9'}
                onClick={() => handleRatingChange(i + 1)}
              />
            ))}
          </div>
          <textarea
            value={newComment.content}
            onChange={handleContentChange}
            placeholder="Write your comment here..."
            required
          />
          <button type="submit">
            Add Comment
          </button>
        </form>
      </div>

      {/* Displaying comments */}
      {showComments &&
        displayedComments.map((comment, index) => {
          const isExpanded = expandedComments[index];
          const content = isExpanded ? comment.content : comment.content.slice(0, 500);

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
                  {comment.content.length > 500 && (
                    <span onClick={() => toggleExpand(index)} className="show-more">
                      {isExpanded ? ' Show less' : '... Show more'}
                    </span>
                  )}
                </p>
              </div>
              {/* Removed image display */}
            </div>
          );
        })}

      {/* Toggle show all comments button */}
      {sortedComments.length > 5 && (
        <button onClick={toggleShowAllComments} className="toggle-comments-btn">
          {showAllComments ? 'Show Less' : 'Show All Comments'}
        </button>
      )}
    </div>
  );
};

export default CommentBox;
