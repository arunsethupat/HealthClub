import type1 from "../assets/type1.jpg"
import type2 from "../assets/type2.jpg"
import type3 from "../assets/type3.jpg"
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {"cat":"ELITE","bg":type1,"items":["At-center group classes","All ELITE & PRO gyms","All pro gyms"]},
    {"cat":"PRO","bg":type2,"items":["All pro gyms","2 sessions/m at ELITE and PRO gyms","At-center group classes"]},
    {"cat":"HOME","bg":type3,"items":["At home workouts","Celebrity workouts","2 sessions/m at ELITE and PRO gyms"]}
  ]
  return (
    <>
      <div className="main-container">
        <div className="main-content">
          <h1>Welcome to the Gym</h1>
          <p>View information about our gym and memberships available, and class schedules.</p>
          <nav>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/register" className="nav-button">Register</Link>
          </nav>
        </div>
        <div className="cards-container">
          {features.map((feature, index) => (
            <div className="card" key={index}>
              <div className="card-header">
                <img src={feature.bg} alt={feature.cat} className="card-image" />
                <h2>{feature.cat}</h2>
              </div>
              <div className="card-body">
                <ul>
                  {feature.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <button className="card-button">View Membership Options</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
