import React, { useState } from 'react';
import { PlatformNotification } from '../../types/career.ts';
import { X, Send, Megaphone, CheckCircle2 } from 'lucide-react';

interface CreateContentNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendNotification: (notif: Omit<PlatformNotification, 'id' | 'createdAt' | 'readCount'>) => void;
}

export const CreateContentNotificationModal: React.FC<CreateContentNotificationModalProps> = ({
  isOpen,
  onClose,
  onSendNotification,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<PlatformNotification['category']>('System Announcement');
  const [targetAudience, setTargetAudience] = useState<PlatformNotification['targetAudience']>('All Users');
  const [priority, setPriority] = useState<PlatformNotification['priority']>('Normal');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onSendNotification({
      title: title.trim(),
      message: message.trim(),
      category,
      targetAudience,
      priority,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="bg-[#0B1B36] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Create & Broadcast Notification</h3>
              <p className="text-slate-400 text-xs mt-0.5">Send alerts, announcements, or policy updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Notification Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scheduled System Upgrade on Sunday"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PlatformNotification['category'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="System Announcement">System Announcement</option>
                <option value="Employer Update">Employer Update</option>
                <option value="Job Alert">Job Alert</option>
                <option value="Security">Security & Policy</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PlatformNotification['priority'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as PlatformNotification['targetAudience'])}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="All Users">All Registered Users (Candidates + Employers)</option>
              <option value="Candidates">Job Seekers Only</option>
              <option value="Employers">Corporate Employers Only</option>
              <option value="Staff">Platform Staff & Recruiters Only</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Notification Content / Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the full notification message to be broadcasted..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Notification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
