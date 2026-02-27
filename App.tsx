
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Icons } from './constants';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Teachers from './components/Teachers';
import Courses from './components/Courses';
import { useDatabase } from './hooks/useDatabase';

const Sidebar = ({ isDemo, isOpen, onClose }: { isDemo: boolean; isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to}
      onClick={onClose}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
        isActive(to)
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icons.Logo />
            <span className="text-xl font-bold text-gray-800">EduStream</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-6">
          <div>
            <NavItem to="/" icon={Icons.Dashboard} label="Dashboard" />
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">Management</h3>
            <div className="space-y-1">
              <NavItem to="/students" icon={Icons.Students} label="Students" />
              <NavItem to="/teachers" icon={Icons.Teachers} label="Teachers" />
              <NavItem to="/courses" icon={Icons.Courses} label="Courses" />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

const ErrorScreen = ({ onRetry, onDemo, errorMsg }: { onRetry: () => void; onDemo: () => void; errorMsg: string | null }) => {
  const isHttps = window.location.protocol === 'https:';

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center animate-fadeIn">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Failed</h2>
        
        {isHttps ? (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-left">
            <h4 className="text-amber-800 font-bold text-sm mb-1 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Security Restriction (Mixed Content)
            </h4>
            <p className="text-amber-700 text-xs leading-relaxed">
              You are accessing this page via <strong>HTTPS</strong>, but your backend is running on <strong>HTTP</strong>. Browsers block these requests for security.
              <br/><br/>
              <strong>Fix:</strong> Access the frontend via <code className="bg-amber-100 px-1 rounded">http://</code> instead of <code className="bg-amber-100 px-1 rounded">https://</code> during local development.
            </p>
          </div>
        ) : (
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            The application couldn't reach the server at <code className="bg-gray-100 px-1 rounded text-pink-600 font-mono">127.0.0.1:5000</code>.
          </p>
        )}

        {!isHttps && (
          <div className="text-left bg-slate-900 rounded-xl p-4 mb-8 font-mono text-xs text-blue-300">
            <p className="text-gray-500 mb-2">// 1. Ensure dependencies are installed:</p>
            <p className="mb-2">npm install express mongoose cors @google/genai</p>
            <p className="text-gray-500 mb-2">// 2. Start the server:</p>
            <p>node server.js</p>
          </div>
        )}

        <div className="space-y-3">
          <button 
            onClick={onRetry}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Retry Connection
          </button>
          <button 
            onClick={onDemo}
            className="w-full bg-white text-gray-600 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            Launch Academic Portal
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Error Debug Code</p>
          <p className="text-xs font-mono text-gray-400">{errorMsg || 'UNKNOWN_FETCH_ERROR'}</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { 
    db, loading, error, retry, enterDemoMode, isDemoMode,
    addStudent, updateStudent, deleteStudent,
    addTeacher, updateTeacher, deleteTeacher,
    addCourse, updateCourse, deleteCourse
  } = useDatabase();

  if (error) {
    return <ErrorScreen onRetry={retry} onDemo={enterDemoMode} errorMsg={error} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin text-blue-600"><Icons.Logo /></div>
          <p className="text-gray-500 font-medium">Connecting to Database...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar isDemo={isDemoMode} isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <Icons.Logo />
              <span className="text-lg font-bold text-gray-800">EduStream</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </header>

          <main className="flex-1 lg:ml-64 p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard db={db} />} />
              <Route 
                path="/students" 
                element={<Students students={db.students} onAdd={addStudent} onUpdate={updateStudent} onDelete={deleteStudent} />} 
              />
              <Route 
                path="/teachers" 
                element={<Teachers teachers={db.teachers} onAdd={addTeacher} onUpdate={updateTeacher} onDelete={deleteTeacher} />} 
              />
              <Route 
                path="/courses" 
                element={<Courses courses={db.courses} teachers={db.teachers} onAdd={addCourse} onUpdate={updateCourse} onDelete={deleteCourse} />} 
              />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
