
import React from 'react';
import { WorkTask } from '../types';

interface HistoryPanelProps {
  task: WorkTask;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ task, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={onClose}></div>
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Activity History</h2>
            <p className="text-sm text-slate-500 truncate w-64">{task.title}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {task.updates.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-60">
              <div className="text-4xl mb-4">⌛</div>
              <p className="text-slate-500">No updates logged yet for this activity.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-indigo-100 ml-3 py-2 space-y-8">
              {task.updates.slice().reverse().map((update, idx) => (
                <div key={update.id} className="relative pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-indigo-500"></div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {update.percentage}% Completed
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {update.note && (
                      <p className="text-sm text-slate-700 italic mb-2">"{update.note}"</p>
                    )}
                    <div className="flex items-center text-[10px] text-slate-500 font-medium">
                       <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                       Logged {update.timeSpent} mins
                    </div>
                  </div>
                  <div className="mt-1 ml-2 text-[10px] text-slate-400 font-medium">
                    {new Date(update.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Total Progress</span>
            <span className="text-sm font-bold text-slate-900">{task.currentProgress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-4">
             <div 
               className="h-full bg-indigo-600 transition-all duration-1000" 
               style={{ width: `${task.currentProgress}%` }}
             ></div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 uppercase font-bold">Time Spent</p>
              <p className="text-lg font-bold text-slate-900">{task.totalTimeSpent}m</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 uppercase font-bold">Total Sessions</p>
              <p className="text-lg font-bold text-slate-900">{task.updates.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
