import React from 'react';
import { X, Bell, CheckCircle, Briefcase, UserPlus } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'job' | 'applicant' | 'approval';
  read: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, onClearAll }) => {
  if (!isOpen) return null;

  const notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      title: 'Virtusa opened requisition for Senior Software Engineer (Colombo)',
      time: '10m ago',
      type: 'job',
      read: false,
    },
    {
      id: 'notif-2',
      title: '14 new applicants screened for UI/UX Designer - WSO2',
      time: '1h ago',
      type: 'applicant',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Sysco LABS Sri Lanka submitted employer onboarding verification',
      time: '3h ago',
      type: 'approval',
      read: false,
    },
    {
      id: 'notif-4',
      title: 'Monthly recruiting pipeline report for August ready for export',
      time: '1d ago',
      type: 'applicant',
      read: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-xs">Platform Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="text-[11px] text-slate-500 hover:text-slate-800"
            >
              Clear
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <div key={n.id} className="p-3.5 hover:bg-slate-50 flex items-start gap-3 transition-colors">
              <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                {n.type === 'job' && <Briefcase className="w-3.5 h-3.5" />}
                {n.type === 'applicant' && <UserPlus className="w-3.5 h-3.5" />}
                {n.type === 'approval' && <CheckCircle className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-800 font-medium leading-snug">{n.title}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
