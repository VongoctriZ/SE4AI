// CommentBox.js

import React, { useState } from 'react';
import './CommentBox.css';

const CommentBox = ({ comments, displayFlag }) => {
  const [showComments, setShowComments] = useState(displayFlag === 'comments');


  console.log("comments: ",comments);

  comments.array.forEach(e => {
    console.log(e.key);
  });

  return (
    <div className="comment-box">
      {showComments &&
        comments.map((comment, index) => (
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