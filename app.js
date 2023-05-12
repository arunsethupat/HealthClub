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


const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));