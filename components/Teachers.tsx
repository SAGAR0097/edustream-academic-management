
import React, { useState } from 'react';
import { Teacher } from '../types';
import { Icons } from '../constants';

interface TeachersProps {
  teachers: Teacher[];
  onAdd: (teacher: Omit<Teacher, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Teacher>) => void;
  onDelete: (id: string) => void;
}

const Teachers: React.FC<TeachersProps> = ({ teachers, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    department: '', 
    expertise: '' 
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', department: '', expertise: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setFormData({ 
      name: teacher.name, 
      email: teacher.email, 
      department: teacher.department, 
      expertise: teacher.expertise 
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }
    setModalOpen(false);
  };

  const handleRemove = () => {
    if (editingId && window.confirm(`Are you sure you want to remove ${formData.name} from the faculty list?`)) {
      onDelete(editingId);
      setModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-gray-500">View and manage educator profiles and expertise</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Icons.Add />
          Add Teacher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                {teacher.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 pr-4 truncate">{teacher.name}</h3>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-tight">{teacher.department}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-0.5 tracking-wider">Expertise</p>
                <p className="text-sm text-gray-700 font-medium line-clamp-2">{teacher.expertise}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-0.5 tracking-wider">Email</p>
                <p className="text-sm text-gray-600 truncate">{teacher.email}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-center">
              <button 
                onClick={() => handleOpenEdit(teacher)}
                className="text-blue-600 font-bold text-sm hover:underline py-1 px-4 hover:bg-blue-50 rounded-full transition-colors"
              >
                Edit Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Faculty Profile' : 'Add Faculty Member'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Dr. Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="j.smith@edustream.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  placeholder="e.g. Faculty of Engineering"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expertise / Specialization</label>
                <textarea 
                  required rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={formData.expertise}
                  onChange={e => setFormData({...formData, expertise: e.target.value})}
                  placeholder="Describe areas of core expertise..."
                />
              </div>
              
              <div className="space-y-3 pt-6">
                <div className="flex gap-3">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 text-gray-600 font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200">
                    {editingId ? 'Save Changes' : 'Add Teacher'}
                  </button>
                </div>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleRemove}
                    className="w-full px-4 py-2 text-red-600 font-bold text-sm border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove Teacher from Faculty
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

export default Teachers;
