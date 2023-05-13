import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [perUserClasses, setPerUserClasses] = useState([]);
  const [enrolledMembers, setEnrolledMembers] = useState([]);
  const [loggedInMember, setLoggedInMember] = useState({});
  const [showEnrolledMembers, setShowEnrolledMembers] = useState(false);
  const [showMemberSchedule, setshowMemberSchedule] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
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

  const location = useLocation();
  const memberEmail = new URLSearchParams(location.search).get('email');

  // window.onload = function(){
  //   console.log("Rahul");
  //   fetch(`http://localhost:8082/findMemberId/${memberEmail}`)
  //     .then(response => response.json())
  //     .then(data => setLoggedInMember(data))
  //     .catch(error => console.error(error));
  // }




  const toggleEnrollMembersVisibility = (classId) => {
    console.log(classId);
    fetch(`http://localhost:8082/findMemberId/${memberEmail}`)
      .then(response => response.json())
      .then(data => {
        alert("You have successfully enrolled! Good job!");
        const formData = {
          activityId: classId,
        }
        fetch(`http://localhost:8082/${data}/enroll/${classId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
          .then(response => response.json())
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  };

  const toggleMembersVisibility = () => {
    setshowMemberSchedule(!showMemberSchedule);
    fetch(`http://localhost:8082/findMemberId/${memberEmail}`)
      .then(response => response.json())
      .then(data => {
        fetch(`http://localhost:8082/listPerMember/${data}`)
          .then(response => response.json())
          .then(data => setPerUserClasses(data))
          .catch(error => console.error(error));
      })
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

  const toggleShowProfile = () => {
    setShowProfile(!showProfile);
    console.log("muhahaahahaha");

    fetch(`http://localhost:8082/memberProfile/${memberEmail}`)
      .then(response => response.json())
      .then(data => setLoggedInMember(data))
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
      <button onClick={toggleMembersVisibility}>{showMemberSchedule ? 'Hide Class Schedule' : 'Show Class Schedule'}</button>
      <button onClick={toggleEnrollFormVisibility}>{showRegisterForm ? 'Hide Enroll Form' : 'Enroll Form'}</button>
      <button onClick={toggleListClassesVisibility}>{showClasses ? 'Hide Classes' : 'List Classes'}</button>
      <button onClick={toggleShowProfile}>{showProfile ? 'Hide Profile' : 'Show Profile'}</button>


      <div id="myDiv"></div>

      {showProfile && (<div>
        <p>Name: {loggedInMember.name}</p>
        <p>Email: {loggedInMember.email}</p>
        <p>Membership Start Date: {loggedInMember.membership_start_date}</p>
        <p>Membership End Date: {loggedInMember.membership_end_date}</p>
      </div>

      )}


      {/* {showMemberSchedule && (
        <div>
  <h2>List of Classes</h2>
  {perUserClasses.map((classItem) => (
    <div key={classItem._id}>
      <h3>{classItem.name}</h3>
      <p>{classItem.description}</p>
      <p>{classItem.schedule}</p>
      <p>{classItem.location}</p>
      <p>{classItem.instructor}</p>
    </div>
  ))}
</div>

      )} */}

{showMemberSchedule && (
  <div>
    <h2>List of Classes</h2>
    
    <h2>Upcoming Classes</h2>
    {/* Filter events that are going to happen in the future */}
    {perUserClasses.filter((classItem) => new Date(classItem.schedule) >= new Date()).map((classItem) => (
      <div key={classItem._id}>
        <h3>{classItem.name}</h3>
        <p>{classItem.description}</p>
        <p>{classItem.schedule}</p>
        <p>{classItem.location}</p>
        <p>{classItem.instructor}</p>
      </div>
    ))}
    <h2>Past Classes</h2>
    {/* Filter events that happened before today */}
    {perUserClasses.filter((classItem) => new Date(classItem.schedule) < new Date()).map((classItem) => (
      <div key={classItem._id}>
        <h3>{classItem.name}</h3>
        <p>{classItem.description}</p>
        <p>{classItem.schedule}</p>
        <p>{classItem.location}</p>
        <p>{classItem.instructor}</p>
      </div>
    ))}
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
                <p>Do you feel like enrolling in this?: <button onClick={() => toggleEnrollMembersVisibility(classItem._id)}>Enroll</button></p>
              </div>

            ))}

          </div>
          {showEnrolledMembers && (<table>
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
                  <td>{memberEmail}</td>
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