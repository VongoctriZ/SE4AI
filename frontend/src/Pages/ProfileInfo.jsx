import React, { useContext, useEffect, useState } from "react";
import "./CSS/ProfileInfo.css";
import avatar from "../Components/Assets/Image_Header/avatar.png";
import profile from "../Components/Assets/Image_Header/profile.jpg";
import AvatarUpload from "../Components/AvatarUpload/AvatarUpload";
import { ShopContext } from "../Context/ShopContext";

function EditForm({ user, formData, handleChange, handleBirthdayChange, handleSubmit }) {
  return (
    <section className="column">
      <form className="input-container" onSubmit={handleSubmit}>
        <div className="flex-row">
          <label className="input-label" htmlFor="fullName">Name</label>
          <input className="input-field" type="text" id="fullName" name="fullName" aria-label="Name" value={formData.fullName} onChange={handleChange} />
        </div>
        <div className="flex-row">
          <label className="input-label" htmlFor="email">Email</label>
          <input className="input-field" type="email" id="email" name="email" aria-label="Email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="flex-row">
          <label className="input-label" htmlFor="password">Password</label>
          <input className="input-field" type="password" id="password" name="password" aria-label="Password" value={formData.password} onChange={handleChange} />
        </div>
        <div className="flex-row">
          <label className="input-label" htmlFor="phoneNumber">Phone number</label>
          <input className="input-field" type="tel" id="phoneNumber" name="phoneNumber" aria-label="Phone number" value={formData.phoneNumber} onChange={handleChange} />
        </div>
        <div className="flex-row">
          <label className="input-label" htmlFor="address">Address</label>
          <input className="input-field" type="text" id="address" name="address" aria-label="Address" value={formData.address} onChange={handleChange} />
        </div>
        <div className="flex-row">
          <label className="input-label" htmlFor="gender">Gender</label>
          <input className="input-field" type="text" id="gender" name="gender" aria-label="Gender" value={formData.gender} onChange={handleChange} />
        </div>
        <div className="flex-row">
          <label className="input-label" htmlFor="day">Day</label>
          <input className="birthday-input-field" type="text" id="day" name="birthday.day" aria-label="Day" onChange={handleBirthdayChange} />
          <label className="input-label" htmlFor="month">Month</label>
          <input className="birthday-input-field" type="text" id="month" name="birthday.month" aria-label="Month" onChange={handleBirthdayChange} />
          <label className="input-label" htmlFor="year">Year</label>
          <input className="birthday-input-field" type="text" id="year" name="birthday.year" aria-label="Year" onChange={handleBirthdayChange} />
        </div>
        <button className="submit-button"
          type="submit"
          onClick={handleSubmit}>
          Save Changes
        </button>
      </form>
    </section>
  );
}

const ProfileInfo = () => {
  const { user } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    gender: "",
    birthday: { day: "", month: "", year: "" },
  });

  useEffect(() => {
    if (user) {
      const maskedPassword = user.password ? "*".repeat(user.password.length) : "";

      setFormData({
        fullName: user.fullName,
        email: user.email,
        password: maskedPassword,
        address: user.address,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        birthday: user.birthday,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBirthdayChange = (e) => {
    const { name, value } = e.target;
    const [key, subkey] = name.split(".");
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: {
        ...prevFormData[key],
        [subkey]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);

    const response = await fetch("http://localhost:4000/user/update", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseData = await response.json();

    if (responseData.user) {
      console.log(responseData.user);
      localStorage.setItem("user", JSON.stringify(responseData.user));
      alert("Change success");
    }
  };

  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem("auth-token") ? (avatar) : (profile));
  const handleSaveAvatar = (newAvatarUrl) => {
    setAvatarUrl(newAvatarUrl); // Update the avatar URL in the parent component's state
  };

  return (
    <div className="container">
      <header className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <hr className="divider" />
      </header>
      <main className="form-wrapper">
        <section className="form-container">
          <EditForm
            user={user}
            formData={formData}
            handleChange={handleChange}
            handleBirthdayChange={handleBirthdayChange}
            handleSubmit={handleSubmit}
          />
          <AvatarUpload
            defaultAvatar={avatarUrl}
            onSave={handleSaveAvatar}
          />
        </section>
      </main>
    </div>
  );
};

export default ProfileInfo;
