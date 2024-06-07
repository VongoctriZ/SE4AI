import React, { useContext, useEffect, useState } from "react";
import "./ProfileInfo.css";
import profile from "../../Components/Assets/Image_Header/profile.jpg";
import { ShopContext } from "../../Context/ShopContext";

// import Button from "@mui/material/Button";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";

function EditForm({ user, handleChange, handleBirthdayChange, handleSubmit}) {
  return (
    <section className="column">
      <form className="input-container">
        <div className="flex-row">
          <label className="input-label" htmlFor="name">
            Name
          </label>
          <input
            className="input-field"
            type="text"
            id="name"
            name="name"
            aria-label="Name"
            value="Full Name"
            // value={user.name}
            // onChange={handleChange}
          />
        </div>
        <div className="flex-row">
          <label className="input-label" htmlFor="email">
            Email
          </label>
          <input
            className="input-field"
            type="email"
            id="email"
            name="email"
            aria-label="Email"
            value="Email"
            // value={user.email}
            // onChange={handleChange}
          />
        </div>
        <div className="flex-row">
          <label className="input-label" htmlFor="password">
            Password
          </label>
          <input
            className="input-field"
            type="password"
            id="password"
            name="password"
            aria-label="Password"
            value="Password"
            // value={user.password}
            // onChange={handleChange}
          />
        </div>
        <div className="flex-row">
          <label className="input-label" htmlFor="phone">
            Phone number
          </label>
          <input
            className="input-field"
            type="tel"
            id="phone"
            name="phone"
            aria-label="Phone number"
            value="Phone number"
            // value={user.phone}
            // onChange={handleChange}
          />
        </div>
        <div className="flex-row">
          <label className="input-label" htmlFor="address">
            Address
          </label>
          <input
            className="input-field"
            type="text"
            id="address"
            name="address"
            aria-label="Address"
            value="Address"
            // value={user.address}
            // onChange={handleChange}
          />
        </div>
        <div className="flex-row">
          <label className="input-label" htmlFor="gender">
            Gender
          </label>
          <input
            className="input-field"
            type="text"
            id="gender"
            name="gender"
            aria-label="Gender"
            value="Gender"
            // value={user.address}
            // onChange={handleChange}
          />
        </div>  
        <div className="action-buttons">
          <div>
            {/* <label className="form-label birthday-label" htmlFor="birthday">
              Birthday
            </label> */}
            <div className="flex-row">
              <div className="flex-row">
                <label className="input-label" htmlFor="birthday">
                  Birthday
                </label>
                <br/>
              </div>
              <div className="flex-row">
                <label className="input-label" htmlFor="day">
                  Day
                </label>
                <input
                  className="birthday-input-field"
                  type="text"
                  id="day"
                  name="day"
                  aria-label="Day"
                  // value={user.birthday.day}
                  // onChange={(e) => handleBirthdayChange({ ...e, target: { ...e.target, name: 'day' } })}
                />
              </div>
              <div className="flex-row">
                <label className="input-label" htmlFor="month">
                  Month
                </label>
                <input
                  className="birthday-input-field"
                  type="text"
                  id="month"
                  name="month"
                  aria-label="Month"
                  // value={user.birthday.month}
                  // onChange={(e) => handleBirthdayChange({ ...e, target: { ...e.target, name: 'month' } })}
                />
              </div>
              <div className="flex-row">
                <label className="input-label" htmlFor="year">
                  Year
                </label>
                <input
                  className="birthday-input-field"
                  type="text"
                  id="year"
                  name="year"
                  aria-label="Year"
                  // value={user.birthday.year}
                  // onChange={(e) => handleBirthdayChange({ ...e, target: { ...e.target, name: 'year' } })}
                />
              </div>
            </div>
          </div>
        </div>
        <button className="submit-button" type="submit" onClick={handleSubmit}>
          Save Change
        </button>
      </form>
    </section>
  );
}

const AvatarUpload = () => {
  return (
    <section className="avatar-upload-container">
      <div className="avatar-wrapper">
        <img loading="lazy" src={profile} className="avatar" alt="User avatar" />
        <button className="upload-button" type="button">
          Load avatar
        </button>
      </div>
    </section>
  );
}

const ProfileInfo = () => {
  const { user } = useContext(ShopContext)

  const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      password: '',
      address: '',
      phoneNumber: '',
      gender: '',
      birthday: {day: '', month: '', year: '',},
  });

  useEffect(() => {
      console.log(user)

      if (user) {
          setFormData({
              fullName: user.fullName,
              email: user.email,
              password: ''
          })
      }
  }, [user])

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
          ...formData,
          [name]: value,
      });
  };

  const handleBirthdayChange = (e) => {
    const { name, value } = e.target;
    const [birthdayPart] = name.split('.'); // assuming name attributes like 'birthday.day'
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      birthday: {
        ...prevFormData.birthday,
        [birthdayPart]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Form data submitted:', formData);

      let responseData;
      // You can add form submission logic here
      await fetch('http://localhost:4000/user/update', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'auth-token': `${localStorage.getItem('auth-token')}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: formData.email,
              fullName: formData.fullName,
              password: formData.password,
              address: formData.address,
          }),
      }).then((response) => response.json()).then((data) => responseData = data);

      if (responseData.user) {
          console.log(responseData.user)
          localStorage.setItem('user', JSON.stringify(responseData.user));
          alert("Change success");
      }
  };

  return (
    <div className="container">
      <header className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <hr className="divider" />
      </header>
      <main className="form-wrapper">
        <section className="form-container">
          <EditForm user={user} handleChange={handleChange} handleBirthdayChange={handleBirthdayChange} handleSubmit={handleSubmit} />
          <AvatarUpload />
        </section>
      </main>
    </div>
  );
}

export default ProfileInfo;
