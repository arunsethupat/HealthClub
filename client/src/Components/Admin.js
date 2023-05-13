import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { useNavigate } from 'react-router';



const Home = () => {
  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [enrolledMembers, setEnrolledMembers] = useState([]);
  const [showEnrolledMembers, setShowEnrolledMembers] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showRegisterForm, setShowRegisterMembers] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [membershipStartDate, setMembershipStartDate] = useState('');
  const [membershipEndDate, setMembershipEndDate] = useState('');
  const navigate = useNavigate(); 
    

  // useEffect(() => {
  //   fetch('http://localhost:8082/members')
  //     .then(response => response.json())
  //     .then(data => setMembers(data))
  //     .catch(error => console.error(error));
  // }, []);

  const toggleClassMembersVisibility = (classId) => {
    console.log(classId);
    setShowEnrolledMembers(!showEnrolledMembers);
    fetch(`http://localhost:8082/classes2/${classId}`)
      .then(response => response.json())
      .then(data => setEnrolledMembers(data.enrolled_members))
      .catch(error => console.error(error));
  };



  const toggleMembersVisibility = () => {
          setShowMembers(!showMembers);
          
            fetch('http://localhost:8082/members')
              .then(response => response.json())
              .then(data => setMembers(data))
              .catch(error => console.error(error));
          
        };
  const toggleEnrollFormVisibility = () => {
          setShowRegisterMembers(!showRegisterForm);
        };
  const toggleListClassesVisibility = () => {
          setShowClasses(!showClasses);
          fetch('http://localhost:8082/classes')
              .then(response => response.json())
              .then(data => setClasses(data))
              .catch(error => console.error(error));
        };
   
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
            .then((data) => alert("Member added successfully"))
            .catch((error) => alert(error));
            //navigate('/login');
      
        };
  // return (
  //   <div>
  //     <h1>Welcome Admin</h1>
  //     <p>View information about our gym and memberships available, and class schedules.</p>
  //     <nav>
  //       <ul>
  //         <li><Link to="/login">List Classs</Link></li>
  //         <li><Link to="/register">Register</Link></li>
  //       </ul>
  //     </nav>
  //   </div>
  
    return (
      <div>
        <button onClick={toggleMembersVisibility}>{showMembers ? 'Hide Members' : 'Show Members'}</button>
        <button onClick={toggleEnrollFormVisibility}>{showRegisterForm ? 'Hide Enroll Form' : 'Enroll Form'}</button>
        <button onClick={toggleListClassesVisibility}>{showClasses ? 'Hide Classes' : 'List Classes'}</button>
        
      
        {showMembers && (
          <div class = "col-md-1" >
          <table class="table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Membership Start Date</th>
                <th>Membership End Date</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member._id}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.membership_start_date}</td>
                  <td>{member.membership_end_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
{showClasses && (
  <>
<div>
      <h2>List of Classes</h2>
      {classes.map((classItem) => (
        <div key={classItem._id}>
          <h3>{classItem.name}</h3>
          <p>{classItem.description}</p>
          <p>{classItem.schedule}</p>
          <p>{classItem.location}</p>
          <p>{classItem.instructor}</p>
          <p>Enrolled Members: {classItem.enrolled_members.length}</p>
          <p>Show Signed up members: <button onClick={() => toggleClassMembersVisibility(classItem._id)}>View</button></p>
        </div>

      ))}
      
    </div>
    {showEnrolledMembers &&(<table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Membership Start Date</th>
            <th>Membership End Date</th>
          </tr>
        </thead>
        <tbody>
              {enrolledMembers.map(enrolledMembers => (
                <tr key={enrolledMembers._id}>
                  <td>{enrolledMembers.name}</td>
                  <td>{enrolledMembers.email}</td>
                  <td>{enrolledMembers.membership_start_date}</td>
                  <td>{enrolledMembers.membership_end_date}</td>
                </tr>
              ))}
            </tbody>
      </table>)}
    </>
)}

{showRegisterForm && (
<form onSubmit={handleSubmit}>
      <h2>Enroll Form</h2>
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
      <button type="submit">Sign Up</button>
    </form>
    )}
      </div>
    );
  }



export default Home;