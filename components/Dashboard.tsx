
import React from 'react';
import { Icons } from '../constants';
import { AppState } from '../types';

interface DashboardProps {
  db: AppState;
}

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ db }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Academic Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back to EduStream management portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={Icons.Students} 
          label="Total Students" 
          value={db.students.length} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          icon={Icons.Teachers} 
          label="Total Teachers" 
          value={db.teachers.length} 
          color="bg-purple-50 text-purple-600" 
        />
        <StatCard 
          icon={Icons.Courses} 
          label="Active Courses" 
          value={db.courses.length} 
          color="bg-emerald-50 text-emerald-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <Icons.Clock />
          </div>
          <div className="space-y-4">
            {db.activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default Dashboard;
