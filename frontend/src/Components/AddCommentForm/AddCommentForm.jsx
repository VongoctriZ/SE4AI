// import React, { useState } from 'react';
// import './AddCommentForm.css';
// import { FaStar } from 'react-icons/fa';

// const AddCommentForm = ({ productId, onCommentAdded }) => {
//   const [rating, setRating] = useState(0);
//   const [content, setContent] = useState('');
//   const [images, setImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages(files);

//     const filePreviews = files.map(file => URL.createObjectURL(file));
//     setImagePreviews(filePreviews);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const created_by = {
//       // Replace with the actual user data
//       id: 'user-id',
//       full_name: 'User Full Name',
//     };

//     const formData = new FormData();
//     formData.append('product_id', productId);
//     formData.append('rating', rating);
//     formData.append('created_by', JSON.stringify(created_by));
//     formData.append('content', content);
//     images.forEach((image, index) => {
//       formData.append('images', image);
//     });

//     try {
//       const response = await fetch('/api/comments', {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();
//       if (response.ok) {
//         onCommentAdded(result.comment);
//         setRating(0);
//         setContent('');
//         setImages([]);
//         setImagePreviews([]);
//       } else {
//         console.error('Error adding comment:', result.errors);
//       }
//     } catch (error) {
//       console.error('Error adding comment:', error);
//     }
//   };

//   return (
//     <form className="add-comment-form" onSubmit={handleSubmit}>
//       <h2>Add a Comment</h2>
//       <div className="rating">
//         {[...Array(5)].map((_, i) => (
//           <FaStar
//             key={i}
//             size={24}
//             color={i < rating ? '#ffc107' : '#e4e5e9'}
//             onClick={() => setRating(i + 1)}
//           />
//         ))}
//       </div>
//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Write your comment..."
//         required
//       />
//       <input type="file" multiple accept="image/*" onChange={handleImageChange} />
//       <div className="image-previews">
//         {imagePreviews.map((preview, index) => (
//           <img key={index} src={preview} alt={`preview-${index}`} />
//         ))}
//       </div>
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default AddCommentForm;
