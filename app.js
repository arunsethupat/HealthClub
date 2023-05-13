const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const {Member} = require('./models/healthclub');
const {Admin} = require('./models/healthclub');
const {Class} = require('./models/healthclub');
const app = express();
const connectDB = require('./config/db');
const { Mongoose } = require('mongoose');

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello world3!'));

app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

  const requireLogin = (req, res, next) => {
    if (req.session.userId) {
      next();
    } else {
      res.status(401).json({ msg: 'Unauthorized' });
    }
  };

//login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Inside Login");
    console.log(req.body);
    try {
      // Check if member exists
      const member = await Member.findOne({ email });
      if (!member) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      // Check password
      //const isMatch = await bcrypt.compare(password, member.password);
      isMatch = password == member.password;
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      // Create JWT token
      const token = jwt.sign({ id: member.id }, 'mySecretKey', {
        expiresIn: '1h',
      });

      req.session.userId = member.id;
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  app.post('/loginAdmin', async (req, res) => {
    const { email, password } = req.body;
    console.log("Inside Login");
    console.log(req.body);
    try {
      // Check if member exists
      const member = await Admin.findOne({ email });
      if (!member) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      // Check password
      //const isMatch = await bcrypt.compare(password, member.password);
      isMatch = password == member.password;
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      // Create JWT token
      const token = jwt.sign({ id: member.id }, 'mySecretKey', {
        expiresIn: '1h',
      });

      req.session.userId = member.id;
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


//signup
app.post('/signup', async (req, res) => {
    try {
      // Create a new member document from the request body
      const member = new Member(req.body);
      // Save the member document to the database
      await member.save();
      // Send a success response
      res.status(201).json({ message: 'Member created successfully.' });
    } catch (error) {
      // Send an error response
      res.status(400).json({ message: error.message });
    }
  });

//logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      } else {
        res.redirect('/'); // redirect the user to the homepage or login page
      }
    });
  });

app.get('/members', async (req, res) => {
    try {
      const members = await Member.find();
      res.json(members);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
});

app.get('/classes', async (req, res) => {
    try {
      const classes = await Class.find();
      res.json(classes);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
});
//classes/${classId}/enrolled-members
app.get('/classes2/:classId', async (req, res) => {
    console.log("Inside this")
    try {
        const classId = req.params.classId;
        const classData = await Class.findById(classId).populate('enrolled_members');
        var isCheckedin = 0;
    
        const enrolledMembers = classData.enrolled_members;
        const memberIds = enrolledMembers.map((member) => member._id);
    
        const membersData = await Member.find({ _id: { $in: memberIds } });
    
        const enrolledMembersData = enrolledMembers.map((member) => {
          const memberData = membersData.find((data) => data._id.equals(member._id));
          const activities = memberData.activities;
          const isEnrolledInClass = activities.includes(classId);
          if (isEnrolledInClass) { isCheckedin = 1;}


          return {
            _id: memberData._id,
            name: memberData.name,
            email: memberData.email,
            phone: memberData.phone,
            membership_start_date: memberData.membership_start_date,
            membership_end_date: memberData.membership_end_date,
            isCheckedin: isCheckedin
            
          };
        });
    
        const classWithEnrolledMembers = {
          _id: classData._id,
          name: classData.name,
          description: classData.description,
          schedule: classData.schedule,
          location: classData.location,
          instructor: classData.instructor,
          max_capacity: classData.max_capacity,
          enrolled_members: enrolledMembersData,
          created_date: classData.created_date,
        };
        res.json(classWithEnrolledMembers);
      } catch (error) {
        console.error(error);
        res.status(500).send('Failed to get class with enrolled members.');
      }
});

//Add activity
app.post('/:memberId/activities/:activityId', async (req, res) => {
    try {
        console.log("Inside add activity");
      const memberId = req.params.memberId;
      const activityId = req.body.activityId;
  
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
  
      member.activities.push(activityId);
      await member.save();
  
      res.status(200).json(member);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  //delete activity
  app.delete('/:memberId/activities/:activityId', async (req, res) => {
    try {
      console.log("Inside remove activity");
      const memberId = req.params.memberId;
      const activityId = req.params.activityId;
  
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
  
      const index = member.activities.indexOf(activityId);
      if (index !== -1) {
        member.activities.splice(index, 1);
        await member.save();
        res.status(200).json(member);
      } else {
        return res.status(404).json({ message: 'Activity not found in member activities' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  

  //Add class_enrolled
app.post('/:memberId/enroll/:activityId', async (req, res) => {
    try {
        console.log("Inside add activity");
      const memberId = req.params.memberId;
      const activityId = req.body.activityId;
  
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
  
      member.classes_enrolled.push(activityId);
      await member.save();

      //class
      const className = await Class.findById(activityId);
      if (!className) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      className.enrolled_members.push(memberId);
      await className.save();
  
      res.status(200).json(member);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });



const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));