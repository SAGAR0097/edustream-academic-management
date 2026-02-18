
import { useState, useEffect, useCallback } from 'react';
import { Student, Teacher, Course, Activity, AppState } from '../types';
import * as api from '../services/api';

const STORAGE_KEY = 'edustream_local_db';

const INITIAL_DATA: AppState = {
  students: [
    { id: 's1', name: 'Alice Thompson', email: 'alice.t@example.com', level: 'Intermediate', status: 'Active' },
    { id: 's2', name: 'Marcus Chen', email: 'm.chen@example.com', level: 'Beginner', status: 'Active' },
  ],
  teachers: [
    { 
      id: 't1', 
      name: 'Dr. Robert Wilson', 
      email: 'r.wilson@edustream.edu',
      department: 'Computer Science',
      expertise: 'Quantum Computing & AI Ethics'
    },
    { 
      id: 't2', 
      name: 'Sarah Jenkins', 
      email: 's.jenkins@edustream.edu',
      department: 'Mathematics',
      expertise: 'Abstract Algebra & Topology'
    },
  ],
  courses: [
    { id: 'c1', title: 'Advanced React Patterns', description: 'Deep dive into modern web development with hooks and context.', teacherId: 't1', studentsCount: 24 },
    { id: 'c2', title: 'Calculus III', description: 'Multivariable calculus and vector analysis for engineering students.', teacherId: 't2', studentsCount: 18 },
  ],
  activities: [
    { id: 'a1', message: 'Academic portal initialized successfully', timestamp: 'Just now' },
  ]
};

export const useDatabase = () => {
  const [db, setDb] = useState<AppState>({
    students: [],
    teachers: [],
    courses: [],
    activities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const loadData = useCallback(async () => {
    if (isDemoMode) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setDb(JSON.parse(saved));
      } else {
        setDb(INITIAL_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
      }
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [isDemoMode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveToLocal = (newDb: AppState) => {
    setDb(newDb);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDb));
  };

  const addActivity = (dbState: AppState, message: string) => {
    return {
      ...dbState,
      activities: [
        { id: Date.now().toString(), message, timestamp: 'Just now' },
        ...dbState.activities.slice(0, 9)
      ]
    };
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Math.random().toString(36).substr(2, 9) };
    const nextDb = {
      ...db,
      students: [...db.students, newStudent as Student]
    };
    saveToLocal(addActivity(nextDb, `New student ${student.name} registered`));
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    const newStudents = db.students.map(s => s.id === id ? { ...s, ...data } : s);
    const nextDb = { ...db, students: newStudents };
    saveToLocal(addActivity(nextDb, `Student profile updated`));
  };

  const deleteStudent = async (id: string) => {
    const student = db.students.find(s => s.id === id);
    const nextDb = {
      ...db,
      students: db.students.filter(s => s.id !== id)
    };
    saveToLocal(addActivity(nextDb, `Student ${student?.name} removed`));
  };

  const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = { ...teacher, id: Math.random().toString(36).substr(2, 9) };
    const nextDb = {
      ...db,
      teachers: [...db.teachers, newTeacher as Teacher]
    };
    saveToLocal(addActivity(nextDb, `New teacher ${teacher.name} joined the faculty`));
  };

  const updateTeacher = async (id: string, data: Partial<Teacher>) => {
    const newTeachers = db.teachers.map(t => t.id === id ? { ...t, ...data } : t);
    const nextDb = { ...db, teachers: newTeachers };
    saveToLocal(addActivity(nextDb, `Teacher profile updated`));
  };

  const deleteTeacher = async (id: string) => {
    const teacher = db.teachers.find(t => t.id === id);
    const nextDb = {
      ...db,
      teachers: db.teachers.filter(t => t.id !== id)
    };
    saveToLocal(addActivity(nextDb, `Teacher ${teacher?.name} removed from faculty`));
  };

  const addCourse = async (course: Omit<Course, 'id'>) => {
    const newCourse = { ...course, id: Math.random().toString(36).substr(2, 9) };
    const nextDb = {
      ...db,
      courses: [...db.courses, newCourse as Course]
    };
    saveToLocal(addActivity(nextDb, `New course "${course.title}" created`));
  };

  const updateCourse = async (id: string, data: Partial<Course>) => {
    const newCourses = db.courses.map(c => c.id === id ? { ...c, ...data } : c);
    const nextDb = { ...db, courses: newCourses };
    saveToLocal(addActivity(nextDb, `Course updated`));
  };

  const deleteCourse = async (id: string) => {
    const nextDb = {
      ...db,
      courses: db.courses.filter(c => c.id !== id)
    };
    saveToLocal(addActivity(nextDb, `Course archived`));
  };

  const retry = () => {
    loadData();
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    setError(null);
  };

  return { 
    db, loading, error, isDemoMode,
    addStudent, updateStudent, deleteStudent,
    addTeacher, updateTeacher, deleteTeacher,
    addCourse, updateCourse, deleteCourse, retry, enterDemoMode 
  };
};
