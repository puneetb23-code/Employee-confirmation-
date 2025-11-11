
import React from 'react';
import { Employee, ConfirmationStatus, UserRole } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  role: UserRole;
  onSelectEmployee: (employee: Employee) => void;
}

const getStatusColor = (status: ConfirmationStatus) => {
  switch (status) {
    case ConfirmationStatus.PendingReportingManager:
    case ConfirmationStatus.PendingDeptHead:
    case ConfirmationStatus.PendingHRHead:
      return 'bg-amber-100 text-amber-800';
    case ConfirmationStatus.Confirmed:
      return 'bg-emerald-100 text-emerald-800';
    case ConfirmationStatus.ProbationExtended:
      return 'bg-sky-100 text-sky-800';
    case ConfirmationStatus.Terminated:
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onSelectEmployee, role }) => {
    
  const isActionable = (employee.status === ConfirmationStatus.PendingReportingManager && role === UserRole.ReportingManager) ||
                       (employee.status === ConfirmationStatus.PendingDeptHead && role === UserRole.DeptHead) ||
                       (employee.status === ConfirmationStatus.PendingHRHead && role === UserRole.HRHead);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-800">{employee.name}</h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                {employee.status}
            </span>
        </div>
        <p className="text-sm text-slate-500">{employee.designation}</p>
        <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Employee ID</span>
                <span className="text-slate-700 font-mono">{employee.employeeId}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Department</span>
                <span className="text-slate-700">{employee.department}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Due Date</span>
                <span className="text-slate-700 font-semibold">{employee.confirmationDueDate}</span>
            </div>
        </div>
      </div>
      <div className="bg-slate-50 p-4 border-t border-slate-200">
        <button
          onClick={() => onSelectEmployee(employee)}
          className="w-full bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200"
        >
          {isActionable ? 'Review Form' : 'View Details'}
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
