import React, { useState } from 'react';
import { Download, X, FileText, CheckCircle } from 'lucide-react';
import { Job } from '../../types/career.ts';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'hr' | 'platform';
  jobs: Job[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  reportType,
  jobs,
}) => {
  if (!isOpen) return null;

  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    let content = '';
    let fileName = '';

    if (reportType === 'hr') {
      fileName = `CareerLink_HR_Report_${new Date().toISOString().slice(0, 10)}.csv`;
      content = 'Requisition ID,Job Title,Department,Hiring Manager,Open Date,Status,Applicants\n' +
        jobs.map(j => `"${j.id}","${j.title}","${j.department || 'N/A'}","${j.hiringManager || 'N/A'}","${j.postedDate}","${j.status}",${j.applicantsCount}`).join('\n');
    } else {
      fileName = `CareerLink_Platform_Metrics_${new Date().toISOString().slice(0, 10)}.csv`;
      content = 'Metric,Value,Period,Growth\n' +
        'Total Users,28495,Active,+14.2%\n' +
        'Active Employers,1480,Active,+8.6%\n' +
        'Total Job Postings,12345,Lifetime,+22.1%\n' +
        'Pending Verifications,45,Current,-12.5%\n' +
        '\nJob ID,Title,Employer,Date,Status\n' +
        jobs.map(j => `"${j.id}","${j.title}","${j.company}","${j.postedDate}","${j.status}"`).join('\n');
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Export {reportType === 'hr' ? 'HR Recruitment' : 'Platform Overview'} Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600">
            Download the consolidated operational dataset covering metrics, requisitions, and application trends in CSV format.
          </p>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center gap-3">
            <FileText className="w-6 h-6 text-slate-500" />
            <div className="text-xs">
              <span className="font-semibold text-slate-800 block">
                {reportType === 'hr' ? 'HR_Overview_Consolidated.csv' : 'Platform_Overview_Data.csv'}
              </span>
              <span className="text-slate-500 text-[11px] tabular-nums">
                Includes {jobs.length} requisition records and pipeline telemetry
              </span>
            </div>
          </div>

          {downloaded ? (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Download initiated successfully!
            </div>
          ) : (
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download Report (.CSV)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
