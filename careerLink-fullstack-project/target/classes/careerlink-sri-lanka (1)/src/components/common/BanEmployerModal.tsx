import React, { useState } from 'react';
import { EmployerRequest } from '../../types/career.ts';
import { CompanyLogo } from './CompanyLogo.tsx';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react';

interface BanEmployerModalProps {
  isOpen: boolean;
  employer: EmployerRequest | null;
  onClose: () => void;
  onConfirmBan: (id: string, reason: string) => void;
}

export const BanEmployerModal: React.FC<BanEmployerModalProps> = ({
  isOpen,
  employer,
  onClose,
  onConfirmBan,
}) => {
  const [selectedReason, setSelectedReason] = useState(
    'Violating terms: charging candidate upfront registration or interview fees'
  );
  const [customReason, setCustomReason] = useState('');

  if (!isOpen || !employer) return null;

  const presetReasons = [
    'Violating terms: charging candidate upfront registration or interview fees',
    'Posting deceptive work-from-home or fraudulent MLM vacancies',
    'Unregistered business entity / forged Business Registration (BR) certificate',
    'Spamming candidate contacts or unsolicited commercial messages',
    'Multiple verified candidate harassment or unfair dismissal complaints',
    'Other (specified below)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason =
      selectedReason === 'Other (specified below)' && customReason.trim()
        ? customReason.trim()
        : selectedReason;

    onConfirmBan(employer.id, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Ban Employer Account</h3>
              <p className="text-rose-100 text-xs mt-0.5">Restrict platform access & suspend active postings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-rose-200 hover:text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Target Employer Info */}
          <div className="flex items-center gap-3 bg-rose-50 p-3 rounded-xl border border-rose-200">
            <CompanyLogo name={employer.companyName} size="md" />
            <div>
              <div className="font-bold text-slate-900 text-sm">{employer.companyName}</div>
              <div className="text-[11px] text-slate-500">{employer.industry}</div>
              <div className="text-[10px] text-slate-400">{employer.location} &middot; {employer.contactEmail}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Banning this employer will immediately <strong>delist all their active job postings</strong> from public search and revoke recruitment console access.
            </p>
          </div>

          {/* Reason Select */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Reason for Enforcement Action <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-1.5">
              {presetReasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-colors text-[11px] ${
                    selectedReason === reason
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-medium'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="banReason"
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === 'Other (specified below)' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Custom Violation Details
              </label>
              <textarea
                required
                rows={2}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Explain the specific violation or investigation details..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
              />
            </div>
          )}

          {/* Actions */}
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
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Confirm Ban Employer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
