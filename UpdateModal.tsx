
import React, { useState } from 'react';
import { WorkTask } from '../types';

interface UpdateModalProps {
  task: WorkTask;
  onClose: () => void;
  onSave: (percentage: number, timeSpent: number, note: string) => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ task, onClose, onSave }) => {
  const [percentage, setPercentage] = useState(task.currentProgress);
  const [timeSpent, setTimeSpent] = useState(30);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(percentage, timeSpent, note);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-amber-50/30">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Log Progress</h2>
            <p className="text-xs text-slate-500">Updating: {task.title}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-700">Completion</label>
              <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={percentage}
              onChange={(e) => setPercentage(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Time Spent this session (Minutes)</label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={timeSpent}
              onChange={(e) => setTimeSpent(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Note (Optional)</label>
            <textarea
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              rows={2}
              placeholder="What did you work on?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-100 transition-all"
            >
              Add Work Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
