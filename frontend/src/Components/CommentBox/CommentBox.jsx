import React from 'react';

const CommentBox = ({ comments }) => {
  return (
    <div className="comment-box">
      <h2>Comments</h2>
      {comments.map((comment, index) => (
        <div key={index} className="comment">
          <div className="user-info">
            <p>{comment.created_by.full_name}</p>
            {/* You can add more user info if needed */}
          </div>
          <div className="content">
            <p>{comment.content}</p>
            {/* You can render images here if needed */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentBox;
