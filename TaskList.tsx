
import React from 'react';
import { WorkTask, TaskStatus } from '../types';

interface TaskListProps {
  tasks: WorkTask[];
  loading: boolean;
  onEdit: (task: WorkTask) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (task: WorkTask) => void;
  onShowHistory: (task: WorkTask) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading, onEdit, onDelete, onUpdateProgress, onShowHistory }) => {
  if (loading) {
    return (
      <div className="p-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500">Loading activities...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-20 text-center flex flex-col items-center">
        <div className="text-6xl mb-4">🏜️</div>
        <h4 className="text-lg font-bold text-slate-800">No activities found</h4>
        <p className="text-slate-500">Start by adding your first work entry!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Activity</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Start / Est. Duration</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-6 py-5">
                <div className="max-w-xs">
                  <p className="font-bold text-slate-900 mb-0.5">{task.title}</p>
                  <p className="text-sm text-slate-500 truncate">{task.description}</p>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="text-sm text-slate-700">
                   <p className="font-medium">{new Date(task.startTime).toLocaleDateString()}</p>
                   <p className="text-slate-400 text-xs">{task.expectedDuration} mins expected</p>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="w-full max-w-[120px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">{task.currentProgress}%</span>
                    <span className="text-[10px] text-slate-400">{task.totalTimeSpent}m used</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${task.currentProgress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${task.currentProgress}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  task.status === TaskStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' :
                  task.status === TaskStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-5 text-right">
                <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onShowHistory(task)}
                    title="View History"
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </button>
                  <button 
                    onClick={() => onUpdateProgress(task)}
                    title="Update Progress"
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  </button>
                  <button 
                    onClick={() => onEdit(task)}
                    title="Edit Task"
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button 
                    onClick={() => onDelete(task.id)}
                    title="Delete Task"
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
