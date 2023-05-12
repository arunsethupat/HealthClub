import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    console.log('Home component rendered!')
  return (
    <div>
      <h1>Welcome Member</h1>
      <p>View information about our gym and memberships available, and class schedules.</p>
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
