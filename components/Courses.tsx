
import React, { useState } from 'react';
import { Course, Teacher } from '../types';
import { Icons } from '../constants';
import { generateCourseDescription } from '../services/geminiService';

interface CoursesProps {
  courses: Course[];
  teachers: Teacher[];
  onAdd: (course: Omit<Course, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Course>) => void;
  onDelete: (id: string) => void;
}

const Courses: React.FC<CoursesProps> = ({ courses, teachers, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', teacherId: '', studentsCount: 0 });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', teacherId: '', studentsCount: 0 });
    setModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingId(course.id);
    setFormData({ 
      title: course.title, 
      description: course.description, 
      teacherId: course.teacherId, 
      studentsCount: course.studentsCount 
    });
    setModalOpen(true);
  };

  const handleGenerateDescription = async () => {
    if (!formData.title) return;
    setIsGenerating(true);
    const desc = await generateCourseDescription(formData.title);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }
    setModalOpen(false);
    setFormData({ title: '', description: '', teacherId: '', studentsCount: 0 });
  };

  const handleRemove = () => {
    if (editingId && window.confirm(`Are you sure you want to delete the course "${formData.title}"? This cannot be undone.`)) {
      onDelete(editingId);
      setModalOpen(false);
    }
  };

  const getTeacherName = (id: string) => teachers.find(t => t.id === id)?.name || 'Unassigned';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Courses</h1>
          <p className="text-gray-500">Curriculum management system</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Icons.Add />
          Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group relative">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Course</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{course.description}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 overflow-hidden">
                  {getTeacherName(course.teacherId).charAt(0)}
                </div>
                <div className="text-xs">
                  <p className="text-gray-400">Instructor</p>
                  <p className="font-bold text-gray-900">{getTeacherName(course.teacherId)}</p>
                </div>
              </div>
              <button 
                onClick={() => handleOpenEdit(course)}
                className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Edit Syllabus
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Course Curriculum' : 'Launch New Course'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Advanced Calculus"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Course Summary</label>
                  {!editingId && (
                    <button 
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating || !formData.title}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                    >
                      <Icons.Sparkles />
                      {isGenerating ? 'Drafting...' : 'AI Generate'}
                    </button>
                  )}
                </div>
                <textarea 
                  required rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Briefly describe what students will learn..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Instructor</label>
                <select 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.teacherId}
                  onChange={e => setFormData({...formData, teacherId: e.target.value})}
                >
                  <option value="">Select a teacher</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-3 pt-6">
                <div className="flex gap-3">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 text-gray-600 font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200">
                    {editingId ? 'Save Changes' : 'Launch Course'}
                  </button>
                </div>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleRemove}
                    className="w-full px-4 py-2 text-red-600 font-bold text-sm border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete Course
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
