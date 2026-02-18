
export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledDate: string;
  status: 'Active' | 'Inactive';
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  expertise: string;
  joinDate: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  studentsCount: number;
}

export interface Activity {
  id: string;
  message: string;
  timestamp: string;
}

export interface AppState {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  activities: Activity[];
}
