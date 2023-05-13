import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [membershipStartDate, setMembershipStartDate] = useState('');
  const [membershipEndDate, setMembershipEndDate] = useState('');
  const [membershipPackage, setMembershipPackage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      name,
      email,
      password,
      phone,
      membership_start_date: membershipStartDate,
      membership_end_date: membershipEndDate
    };
    fetch('http://localhost:8082/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then((data) => alert("Registration Successful"))
      .catch((error) => alert(error));
      navigate('/login');

  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Member Sign Up</h2>
      <label>
        <span>Name:</span>
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label>
        <span>Email:</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label>
        <span>Password:</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      <label>
        <span>Phone:</span>
        <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
      </label>
      <label>
        <span>Membership Start Date:</span>
        <input type="date" value={membershipStartDate} onChange={(event) => setMembershipStartDate(event.target.value)} required />
      </label>
      <label>
        <span>Membership End Date:</span>
        <input type="date" value={membershipEndDate} onChange={(event) => setMembershipEndDate(event.target.value)} required />
      </label>
      <label>
    <span>Membership Package:</span>
    <select value={membershipPackage} onChange={(event) => setMembershipPackage(event.target.value)}>
      <option value="Free trial">Free trial</option>
      <option value="Elite Package">Elite Package</option>
      <option value="Pro Package">Pro Package</option>
      <option value="Home Package">Home Package</option>
    </select>
  </label>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Register;