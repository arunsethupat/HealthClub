const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  membership_start_date: {
    type: Date,
    required: true
  },
  membership_end_date: {
    type: Date,
    required: true
  },
  classes_enrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'class'
  }],
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'activity'
  }],
  created_date: {
    type: Date,
    default: Date.now
  }
});

const AdminSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  });

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  schedule: {
    type: String,
    required: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'location',
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'instructor',
    required: true
  },
  max_capacity: {
    type: Number,
    required: true
  },
  enrolled_members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member'
  }],
  created_date: {
    type: Date,
    default: Date.now
  }
});

const ActivitySchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member',
    required: true
  },
  activity_type: {
    type: String,
    enum: ['Treadmill', 'Cycling', 'Stair machine', 'Weight training'],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

const InstructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  Member: mongoose.model('member', MemberSchema),
  Admin: mongoose.model('admin', AdminSchema),
  Class: mongoose.model('class', ClassSchema),
  Activity: mongoose.model('activity', ActivitySchema),
  Location: mongoose.model('location', LocationSchema),
  Instructor: mongoose.model('instructor', InstructorSchema)
};
