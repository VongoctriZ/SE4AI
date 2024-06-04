import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login Function Executed!", formData);
    let responseData;

    await fetch('http://localhost:4000/user/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
    })
      .then((response) => response.json())
      .then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user));
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {
    console.log("Sign Up Function Executed!", formData);


    // if(formData.confirmPassword.length < 8){
    //   return alert("Password must be at")
    // }
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }


    let responseData;

    await fetch('http://localhost:4000/user/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        address: formData.address,
      }),
    }).then((response) => response.json()).then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user));
      window.location.replace("/");

    } else {
      alert(responseData.errors);
    }
  };

  const resetPassword = async () => {


    console.log("Implement later, this task need interact with real e-mail");
    // console.log("Reset Password Function Executed!", formData);
    // let responseData;

    // await fetch('http://localhost:4000/user/reset-password', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email: formData.email,
    //     password: formData.password
    //   }),
    // }).then((response) => response.json()).then((data) => responseData = data);

    // if (responseData.success) {
    //   localStorage.setItem('auth-token', responseData.token);
    //   localStorage.setItem('user', JSON.stringify(responseData.user));
    //   window.location.replace("/");
    // } else {
    //   alert(responseData.errors);
    // }
  };

  return (
    <div className="login-signup">
      <div className="login-signup-container">
        <h1>{state}</h1>
        <div className="login-signup-fields">
          {state === "Sign Up" && (
            <>
              <input
                name='fullName'
                value={formData.fullName}
                onChange={changeHandler}
                type="text"
                placeholder='Full Name'
              />
              <input
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={changeHandler}
                type="text"
                placeholder='Phone Number'
              />
              <input
                name='address'
                value={formData.address}
                onChange={changeHandler}
                type="text"
                placeholder='Address'
              />

            </>
          )}

          {state !== "Forgot Password" && (
            <>
              <input
                name='email'
                value={formData.email}
                onChange={changeHandler}
                type="email"
                placeholder='Email Address'
              />
              <input
                name='password'
                value={formData.password}
                onChange={changeHandler}
                type="password"
                placeholder='Password'
              />
            </>)}
          {state === "Sign Up" && (
            <input
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={changeHandler}
              type="password"
              placeholder='Confirm Password'
            />
          )}
          {state === "Forgot Password" && (
            <input
              name='email'
              value={formData.email}
              onChange={changeHandler}
              type="email"
              placeholder='Enter your email to reset password'
            />
          )}
        </div>

        {state !== "Forgot Password"
          ? (<button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>)
          : (<button onClick={resetPassword}>Reset Password</button>)
        }
        {state === "Sign Up"
          ? (
            <>
              <p className="login-signup-login">
                Already have an account? <span onClick={() => { setState("Login") }}>Login here</span>
              </p>
              <div className="login-signup-agree">
                <input type="checkbox" />
                <p>By continuing, I agree to the terms of use & privacy policy.</p>
              </div>
            </>
          ) : state === "Login" ? (
            <>
              <p className="login-signup-login">
                Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span>
              </p>
              <p className="login-signup-login">
                Forgot your password? <span onClick={() => { setState("Forgot Password") }}>Reset here</span>
              </p>
            </>
          ) : (
            <p className="login-signup-login">
              Remembered your password? <span onClick={() => { setState("Login") }}>Login here</span>
            </p>
          )}


      </div>
    </div>
  );
}

export default LoginSignup;
