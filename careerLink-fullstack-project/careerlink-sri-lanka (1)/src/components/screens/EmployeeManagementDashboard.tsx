import React from 'react';
import { CandidateManagementDashboard, CandidateManagementDashboardProps } from './CandidateManagementDashboard';

export interface EmployeeManagementDashboardProps extends CandidateManagementDashboardProps {}

export const EmployeeManagementDashboard: React.FC<EmployeeManagementDashboardProps> = (props) => {
  return <CandidateManagementDashboard {...props} />;
};
