
import React, { useState, useMemo } from 'react';
import { Employee, UserRole, ConfirmationStatus, Recommendation, FinalDecision, FormData } from './types';
import { INITIAL_EMPLOYEES } from './constants';
import RoleSwitcher from './components/RoleSwitcher';
import Dashboard from './components/Dashboard';
import ConfirmationForm from './components/ConfirmationForm';

const App: React.FC = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ReportingManager);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseForm = () => {
    setSelectedEmployee(null);
  };

  const handleSubmitForm = (employeeId: number, formData: FormData) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => {
        if (emp.id !== employeeId) {
          return emp;
        }

        const updatedEmp = { ...emp };
        const currentDate = new Date().toISOString().split('T')[0];

        switch (currentUserRole) {
          case UserRole.ReportingManager:
            updatedEmp.reportingManagerFeedback = {
              strengths: formData.strengths,
              weaknesses: formData.weaknesses,
              recommendation: formData.recommendation,
              remarks: formData.reportingManagerRemarks,
              date: currentDate,
            };
            updatedEmp.status = ConfirmationStatus.PendingDeptHead;
            break;

          case UserRole.DeptHead:
            updatedEmp.deptHeadFeedback = {
              decision: formData.deptHeadDecision,
              remarks: formData.deptHeadRemarks,
              date: currentDate,
            };
            updatedEmp.status = ConfirmationStatus.PendingHRHead;
            break;

          case UserRole.HRHead:
            updatedEmp.hrHeadFeedback = {
              decision: formData.hrHeadDecision,
              remarks: formData.hrHeadRemarks,
              date: currentDate,
            };
            // Finalize status
            const rmRec = updatedEmp.reportingManagerFeedback?.recommendation;
            const dhDecision = updatedEmp.deptHeadFeedback?.decision;
            const hrDecision = formData.hrHeadDecision;

            if (rmRec === Recommendation.Terminate || dhDecision === FinalDecision.Reject || hrDecision === FinalDecision.Reject) {
                updatedEmp.status = ConfirmationStatus.Terminated;
            } else if (rmRec === Recommendation.Extend) {
                updatedEmp.status = ConfirmationStatus.ProbationExtended;
            } else {
                updatedEmp.status = ConfirmationStatus.Confirmed;
            }
            break;
        }
        return updatedEmp;
      })
    );
    handleCloseForm();
  };

  const dashboardTitle = useMemo(() => {
    switch(currentUserRole) {
      case UserRole.ReportingManager: return "Reporting Manager Dashboard";
      case UserRole.DeptHead: return "Department Head Dashboard";
      case UserRole.HRHead: return "HR Head Dashboard";
      default: return "Dashboard";
    }
  }, [currentUserRole]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-sky-700">Employee Confirmation Portal</h1>
            <RoleSwitcher 
              currentUserRole={currentUserRole} 
              setCurrentUserRole={setCurrentUserRole} 
            />
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-semibold text-slate-700 mb-6">{dashboardTitle}</h2>
        <Dashboard 
          employees={employees}
          role={currentUserRole}
          onSelectEmployee={handleSelectEmployee}
        />
      </main>
      {selectedEmployee && (
        <ConfirmationForm
          employee={selectedEmployee}
          role={currentUserRole}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
        />
      )}
    </div>
  );
};

export default App;
