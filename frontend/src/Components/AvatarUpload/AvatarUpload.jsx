import React, { useState } from 'react';
import "./AvatarUpload.css"; 

const AvatarUpload = ({ defaultAvatar, onSave }) => {
    const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarPreview(reader.result); // Update avatar preview immediately
                setSelectedFile(file); // Store the selected file for saving later
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!selectedFile) {
            alert("Please select another avatar first.");
            return;
        }

        // Upload avatar to server -- chưa update api bên backend
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            const response = await fetch("http://localhost:4000/user/upload-avatar", {
                method: "POST",
                headers: {  
                    "auth-token": localStorage.getItem("auth-token"),
                },
                body: formData,
            });

            const responseData = await response.json();
            if (responseData.avatarUrl) {
                onSave(responseData.avatarUrl); // Update parent component with new avatar URL
                alert("Avatar uploaded successfully");
            } else {
                alert("Failed to upload avatar");
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert("Error uploading avatar. Please try again.");
        }
    };

    return (
        <section className="avatar-upload-container">
            <div className="avatar-wrapper">
                <img src={avatarPreview} alt="Avatar Preview" className="avatar" />
                <div className='button-group'>
                    <input type="file" id="avatarInput" accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange} 
                    />
                    <button className="upload-button" type="button"
                            onClick={() => document.getElementById('avatarInput').click()}>
                    Load avatar
                    </button>
                    <button onClick={handleSave} className="upload-button">Save</button>
                </div>
            </div>
        </section>
    );
};

export default AvatarUpload;
