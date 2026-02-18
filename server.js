
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = 'mongodb://127.0.0.1:27017/edustream';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB via Compass (127.0.0.1:27017)'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Tip: Make sure MongoDB is installed and running on port 27017.');
  });

// Global Schema Options
const schemaOptions = {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
};

// Mongoose Models
const Student = mongoose.model('Student', new mongoose.Schema({
  name: String,
  email: String,
  enrolledDate: String,
  status: { type: String, default: 'Active' }
}, schemaOptions));

const Teacher = mongoose.model('Teacher', new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  expertise: String,
  joinDate: String
}, schemaOptions));

const Course = mongoose.model('Course', new mongoose.Schema({
  title: String,
  description: String,
  teacherId: String,
  studentsCount: { type: Number, default: 0 }
}, schemaOptions));

const Activity = mongoose.model('Activity', new mongoose.Schema({
  message: String,
  timestamp: { type: String, default: 'Just now' }
}, schemaOptions));

// API Routes
app.get('/api/data', async (req, res) => {
  try {
    const [students, teachers, courses, activities] = await Promise.all([
      Student.find(),
      Teacher.find(),
      Course.find(),
      Activity.find().sort({ _id: -1 }).limit(10)
    ]);
    res.json({ students, teachers, courses, activities });
  } catch (err) {
    res.status(500).json({ error: 'Database fetch failed' });
  }
});

// Student Endpoints
app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    await new Activity({ message: `New student ${student.name} registered` }).save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await new Activity({ message: `Student ${student.name} details updated` }).save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    await new Activity({ message: `Student ${student.name} removed from registry` }).save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Teacher Endpoints
app.post('/api/teachers', async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    await new Activity({ message: `New teacher ${teacher.name} joined the faculty` }).save();
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await new Activity({ message: `Teacher ${teacher.name} profile updated` }).save();
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    await new Activity({ message: `Teacher ${teacher.name} removed from faculty` }).save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Course Endpoints
app.post('/api/courses', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    await new Activity({ message: `New course "${course.title}" created` }).save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await new Activity({ message: `Course "${course.title}" curriculum updated` }).save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    await new Activity({ message: `Course "${course.title}" has been archived` }).save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI endpoint for courses remains
app.post('/api/ai/generate-course-description', async (req, res) => {
  const { title } = req.body;
  
  if (!process.env.API_KEY || process.env.API_KEY === 'your_api_key_here' || process.env.API_KEY.length < 5) {
    const templates = [
      `An intensive program exploring the fundamental concepts of ${title || 'the subject'}, focusing on practical application and theory.`,
      `Master the core principles of ${title || 'this field'} through hands-on learning and expert-led curriculum.`,
      `A comprehensive guide to ${title || 'the discipline'}, designed to provide students with a competitive edge in the modern industry.`
    ];
    const randomIndex = Math.floor(Math.random() * templates.length);
    return res.json({ text: templates[randomIndex] });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, professional academic course description for "${title}". Focus on learning outcomes. Maximum 20 words.`,
    });
    res.json({ text: response.text?.trim() });
  } catch (err) {
    res.json({ text: `A specialized academic program focused on developing deep expertise in ${title || 'this field'}.` });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  const aiStatus = (process.env.API_KEY && process.env.API_KEY.length > 5) ? 'ENABLED' : 'SIMULATED (No API Key)';
  console.log(`-----------------------------------------------`);
  console.log(`🚀 EduStream API Server is Running!`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api`);
  console.log(`🤖 AI Engine: ${aiStatus}`);
  console.log(`-----------------------------------------------`);
});
