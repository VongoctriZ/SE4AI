// import React, { useState } from 'react'
// // import { defer } from 'react-router-dom'
// import './CSS/LoginSignup.css'

// const LoginSignup = () => {

//   const [state, setState] = useState("Login");
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     email: ""
//   })

//   const changeHandler = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }
//   const login = async () => {
//     console.log("Login Function Executed!", formData)
//     let responseData;

//     await fetch('http://localhost:4000/user/login', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/form-data',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     }).then((response) => response.json()).then((data) => responseData = data)

//     if (responseData.success) {
//       localStorage.setItem('auth-token', responseData.token);
//       window.location.replace("/");
//     }else{
//       alert(responseData.errors)
//     }


//   }
//   const signup = async () => {
//     console.log("Sign Up Function Executed!", formData);
//     let responseData;

//     await fetch('http://localhost:4000/user/signup', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/form-data',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     }).then((response) => response.json()).then((data) => responseData = data)

//     if (responseData.success) {
//       localStorage.setItem('auth-token', responseData.token);
//       window.location.replace("/");
//     }else{
//       alert(responseData.errors)
//     }
//   }
//   return (
//     <div className="login-signup">
//       <div className="login-signup-container">
//         <h1>{state}</h1>
//         <div className="login-signup-fields">
//           {state === "Sign Up" ? <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' /> : <></>}
//           <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
//           <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
//         </div>
//         <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
//         {state === "Sign Up"
//           ? <p className="login-signup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p>
//           : <p className="login-signup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>
//         }
//         <div className="login-signup-agree">
//           <input type="checkbox" name='' id='' />
//           <p>By continue, I agree to the terms of use & privacy policy.</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginSignup;


import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
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
        emailAddress: formData.emailAddress,
        password: formData.password
      }),
    }).then((response) => response.json()).then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {
    console.log("Sign Up Function Executed!", formData);
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
        emailAddress: formData.emailAddress,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }),
    }).then((response) => response.json()).then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
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
            </>
          )}
          <input
            name='emailAddress'
            value={formData.emailAddress}
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
          {state === "Sign Up" && (
            <input
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={changeHandler}
              type="password"
              placeholder='Confirm Password'
            />
          )}
        </div>
        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
        {state === "Sign Up"
          ? <p className="login-signup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p>
          : <p className="login-signup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>
        }
        <div className="login-signup-agree">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
