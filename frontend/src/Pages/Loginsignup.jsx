import React, { useState } from 'react';
import "./CSS/LoginSignup.css";

const Loginsignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [errors, setErrors] = useState({});

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const { email, password, username } = formData;

    if (state === "Sign Up" && !username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email address";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async () => {
    if (!validateForm()) return;
    
    console.log("Login Function Executed", formData);
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then((response) => response.json())
    .then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {
    if (!validateForm()) return;
    
    console.log("Signup Function Executed", formData);
    let responseData;
    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then((response) => response.json())
    .then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && 
            <input 
              name="username" 
              value={formData.username} 
              onChange={changeHandler} 
              type="text" 
              placeholder='Your Name'
            />
          }
          {errors.username && <p className="error">{errors.username}</p>}
          
          <input 
            name="email" 
            value={formData.email} 
            onChange={changeHandler} 
            type='email' 
            placeholder='Email Address'
          />
          {errors.email && <p className="error">{errors.email}</p>}
          
          <input 
            name="password" 
            value={formData.password} 
            onChange={changeHandler} 
            type="password" 
            placeholder="Password"
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        
        <button onClick={() => state === "Login" ? login() : signup()}>
          Continue
        </button>
        
        {state === "Sign Up" 
          ? <p className='loginsignup-login'>
              Already have an account? <span onClick={() => setState("Login")}>Login Here</span>
            </p>
          : <p className='loginsignup-login'>
              Create an account? <span onClick={() => setState("Sign Up")}>Click Here</span>
            </p>
        }

        <div className="loginsignup-agree">
          <input type='checkbox' name="" id="" />
          <p> By Continuing, I agree to the terms of use & privacy policy. </p>
        </div>
      </div>
    </div>
  );
};

export default Loginsignup;
