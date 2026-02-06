
import React, { useState, useEffect } from 'react';
import { User, WorkTask, TaskStatus } from '../types';
import { mockApi } from '../services/mockApi';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import UpdateModal from './UpdateModal';
import HistoryPanel from './HistoryPanel';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<WorkTask | undefined>();
  const [selectedTaskForUpdate, setSelectedTaskForUpdate] = useState<WorkTask | null>(null);
  const [selectedTaskForHistory, setSelectedTaskForHistory] = useState<WorkTask | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getTasks(user.id);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user.id]);

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    avgProgress: tasks.length ? Math.round(tasks.reduce((acc, t) => acc + t.currentProgress, 0) / tasks.length) : 0
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return task.status === TaskStatus.PENDING;
    if (activeTab === 'active') return task.status === TaskStatus.IN_PROGRESS;
    if (activeTab === 'completed') return task.status === TaskStatus.COMPLETED;
    return true;
  });

  const handleCreateOrUpdateTask = async (taskData: Partial<WorkTask>) => {
    if (editingTask) {
      await mockApi.updateTask(editingTask.id, taskData);
    } else {
      await mockApi.createTask(taskData, user.id);
    }
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
    fetchTasks();
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this work entry?')) {
      await mockApi.deleteTask(id);
      fetchTasks();
    }
  };

  const handleAddUpdate = async (percentage: number, timeSpent: number, note: string) => {
    if (selectedTaskForUpdate) {
      await mockApi.addWorkUpdate(selectedTaskForUpdate.id, { percentage, timeSpent, note });
      setSelectedTaskForUpdate(null);
      fetchTasks();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <span className="font-bold text-xl text-slate-800">WorkSync</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('all')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            <span className="font-medium">All Activities</span>
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'active' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span className="font-medium">In Progress</span>
            </div>
            <span className="text-xs bg-indigo-100 px-2 py-0.5 rounded-full">{stats.active}</span>
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeTab === 'completed' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="font-medium">Completed</span>
            </div>
            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">{stats.completed}</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-white shadow-sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Activity Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your daily work progress and history.</p>
          </div>
          <button 
            onClick={() => { setEditingTask(undefined); setIsTaskModalOpen(true); }}
            className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-100 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            <span>New Task</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Tasks" value={stats.total} icon="📋" color="bg-blue-50 text-blue-600" />
          <StatCard title="In Progress" value={stats.active} icon="⚡" color="bg-amber-50 text-amber-600" />
          <StatCard title="Finished" value={stats.completed} icon="✅" color="bg-emerald-50 text-emerald-600" />
          <StatCard title="Avg. Progress" value={`${stats.avgProgress}%`} icon="📈" color="bg-indigo-50 text-indigo-600" />
        </div>

        {/* List Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Your Activities</h3>
            <span className="text-sm text-slate-500">{filteredTasks.length} entries found</span>
          </div>
          <TaskList 
            tasks={filteredTasks} 
            loading={loading}
            onEdit={(task) => { setEditingTask(task); setIsTaskModalOpen(true); }}
            onDelete={handleDeleteTask}
            onUpdateProgress={(task) => setSelectedTaskForUpdate(task)}
            onShowHistory={(task) => setSelectedTaskForHistory(task)}
          />
        </div>
      </main>

      {/* Modals */}
      {isTaskModalOpen && (
        <TaskModal 
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleCreateOrUpdateTask}
          initialData={editingTask}
        />
      )}

      {selectedTaskForUpdate && (
        <UpdateModal
          task={selectedTaskForUpdate}
          onClose={() => setSelectedTaskForUpdate(null)}
          onSave={handleAddUpdate}
        />
      )}

      {selectedTaskForHistory && (
        <HistoryPanel
          task={selectedTaskForHistory}
          onClose={() => setSelectedTaskForHistory(null)}
        />
      )}
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
  </div>
);

export default Dashboard;
