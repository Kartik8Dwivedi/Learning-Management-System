import {model, schema} from 'mongoose';

const CourseSchema = new schema({
  title: {
    type: String,
    required: [true, 'Please enter course title'],
    trim: true,
    maxlength: [50, 'Course title cannot exceed 50 characters'],
    minlength: [3, 'Course title must be at least 3 characters long'],
  },
  description: {
    type: String,
    required: [true, 'Please enter course description'],
    trim: true,
    maxlength: [2000, 'Course description cannot exceed 2000 characters'],
    minlength: [10, 'Course description must be at least 10 characters long'],
  },
  category: {
    type: String,
    required: [true, 'Please enter course category'],
    trim: true,
    maxlength: 50,
  },
  thumbnail: {
    public_id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    }
  },
  lectures: [{
    title: String,
    description: String,
    lecture: {
        public_id:{
            type: String,
            required: true,
        },
        secure_url:{
            type: String,
            required: true,
        },
    }
  }],
  numberoOfLectures: {
    type: Number,
    default: 0,
    },
    createdBy: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
}, {timestamps: true});

const Course = new model('Course', CourseSchema);
export default Course;