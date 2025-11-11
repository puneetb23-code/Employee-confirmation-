import React, { useState, useMemo } from 'react';
import { Employee, UserRole, ConfirmationStatus } from '../types';
import EmployeeCard from './EmployeeCard';

interface DashboardProps {
  employees: Employee[];
  role: UserRole;
  onSelectEmployee: (employee: Employee) => void;
}

type Tab = 'pending' | 'completed';

const Dashboard: React.FC<DashboardProps> = ({ employees, role, onSelectEmployee }) => {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [sortKey, setSortKey] = useState('dueDateAsc');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [designationFilter, setDesignationFilter] = useState('');

  const departments = useMemo(() => {
    const allDepartments = employees.map(emp => emp.department);
    return ['All', ...Array.from(new Set(allDepartments)).sort()];
  }, [employees]);

  const { pending, completed } = useMemo(() => {
    const pending: Employee[] = [];
    const completed: Employee[] = [];

    const processedEmployees = employees
      .filter(emp => {
        const departmentMatch = departmentFilter === 'All' || emp.department === departmentFilter;
        const designationMatch = designationFilter === '' || emp.designation.toLowerCase().includes(designationFilter.toLowerCase());
        return departmentMatch && designationMatch;
      })
      .sort((a, b) => {
        switch (sortKey) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'dueDateDesc':
            return new Date(b.confirmationDueDate).getTime() - new Date(a.confirmationDueDate).getTime();
          case 'dueDateAsc':
            return new Date(a.confirmationDueDate).getTime() - new Date(b.confirmationDueDate).getTime();
          case 'status':
            return a.status.localeCompare(b.status);
          default:
            return 0;
        }
      });

    processedEmployees.forEach(emp => {
      let isPendingForRole = false;
      switch (role) {
        case UserRole.ReportingManager:
          isPendingForRole = emp.status === ConfirmationStatus.PendingReportingManager;
          break;
        case UserRole.DeptHead:
          isPendingForRole = emp.status === ConfirmationStatus.PendingDeptHead;
          break;
        case UserRole.HRHead:
          isPendingForRole = emp.status === ConfirmationStatus.PendingHRHead;
          break;
      }
      
      if (isPendingForRole) {
        pending.push(emp);
      } else {
        completed.push(emp);
      }
    });

    return { pending, completed };
  }, [employees, role, sortKey, departmentFilter, designationFilter]);
  
  const handleClearFilters = () => {
    setSortKey('dueDateAsc');
    setDepartmentFilter('All');
    setDesignationFilter('');
  };

  const displayedEmployees = activeTab === 'pending' ? pending : completed;
  
  return (
    <div>
       <div className="bg-white p-4 rounded-lg shadow mb-6 border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-slate-700">Sort by</label>
            <select id="sort" value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md">
              <option value="dueDateAsc">Due Date (Oldest)</option>
              <option value="dueDateDesc">Due Date (Newest)</option>
              <option value="name">Name (A-Z)</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-slate-700">Department</label>
            <select id="department" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md">
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-slate-700">Designation</label>
            <input type="text" id="designation" value={designationFilter} onChange={(e) => setDesignationFilter(e.target.value)} placeholder="e.g., Engineer" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
          </div>
          <div className="self-end">
            <button onClick={handleClearFilters} className="w-full bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200">
                Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('pending')}
            className={`${
              activeTab === 'pending'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            Pending Actions
            {pending.length > 0 && (
                 <span className="ml-2 inline-block py-0.5 px-2 rounded-full text-xs font-medium bg-sky-100 text-sky-600">{pending.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`${
              activeTab === 'completed'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Completed
          </button>
        </nav>
      </div>

      {displayedEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEmployees.map(employee => (
            <EmployeeCard key={employee.id} employee={employee} onSelectEmployee={onSelectEmployee} role={role} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-slate-900">No matching employees found.</h3>
            <p className="mt-1 text-sm text-slate-500">
                Try adjusting your filters or check back later.
            </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;