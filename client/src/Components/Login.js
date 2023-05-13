import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router';
import { Alert } from "react-bootstrap";


function Login() {
  const [showMemberLogin, setShowMemberLogin] = useState(false);
  const navigate = useNavigate(); 
  const [showAlert, setShowAlert] = useState(false);

  const toggleLoginForm = (isMember) => {
    setShowMemberLogin(isMember);
  };

  
   
  const handleLoginSubmit = (event) => {
    //alert("cancel submitting");
    console.log("Here");
    event.preventDefault(); // prevent default form submission behavior
  
    // get the values of the email and password inputs
    const email = event.target.email.value;
    const password = event.target.password.value;
  
    // create an object with the login data
    const loginData = {
      email: email,
      password: password
    };
  
    // make a POST request to the server with the login data
    fetch('http://localhost:8082/login', {
      method: 'POST', // specify the method as POST
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
      .then(response => {
        if (!response.ok) {
          setShowAlert(true);
          throw new Error('Failed to login');
        }
        console.log("Successful");
        navigate(`/memberPage?email=${email}`);
        // handle successful login here, e.g. redirect to a dashboard page
      })
      .catch(error => {
        // handle login error here, e.g. display an error message
        console.error(error);
      });
  };
  
  const handleLoginSubmitAdmin = (event) => {
    //alert("cancel submitting");
    console.log("Here");
    event.preventDefault(); // prevent default form submission behavior
  
    // get the values of the email and password inputs
    const email = event.target.email.value;
    const password = event.target.password.value;
  
    // create an object with the login data
    const loginData = {
      email: email,
      password: password
    };

    //send login data to members page	
    function sendLogin(){	
      var b = document.getElementById('name').value,	
          url = 'http://localhost:3000/MemberPage?name=' + encodeURIComponent(b);	
      document.location.href = url;	
  }
    // make a POST request to the server with the login data
    fetch('http://localhost:8082/loginAdmin', {
      method: 'POST', // specify the method as POST
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
      .then(response => {
        if (!response.ok) {
          setShowAlert(true);
          throw new Error('Failed to login');
        }
        console.log("Successful");
        navigate('/adminPage');
        // handle successful login here, e.g. redirect to a dashboard page
      })
      .catch(error => {
        // handle login error here, e.g. display an error message
        console.error(error);
      });
  };

  const memberLoginForm = (
    
    <div className="login-form">
      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          Invalid credentials
        </Alert>
      )}
      <h2>Member Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" >Login</button>
      </form>
    </div>
  
  );

  const adminLoginForm = (
    <div className="login-form">
      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
          Invalid credentials
        </Alert>
      )}
      <h2>Admin Login</h2>
      <form onSubmit={handleLoginSubmitAdmin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" >Login</button>
      </form>
    </div>
  );

  

  return (
    <div className="login-page">
      <div className="login-tab">
        <button className={showMemberLogin ? 'active' : ''} onClick={() => toggleLoginForm(true)}>
          Member Login
        </button>
        <button className={!showMemberLogin ? 'active' : ''} onClick={() => toggleLoginForm(false)}>
          Admin Login
        </button>
      </div>
      {showMemberLogin ? memberLoginForm : adminLoginForm}
    </div>
  );
}

export default Login;
