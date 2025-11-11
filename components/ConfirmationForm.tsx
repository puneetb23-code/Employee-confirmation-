import React, { useState } from 'react';
import { Employee, UserRole, ConfirmationStatus, Recommendation, FinalDecision, FormData } from '../types';

interface ConfirmationFormProps {
  employee: Employee;
  role: UserRole;
  onClose: () => void;
  onSubmit: (employeeId: number, formData: FormData) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">{title}</h3>
        {children}
    </div>
);

const Detail: React.FC<{ label: string; value: string | undefined | null }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-4 py-1">
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="text-sm text-slate-900 col-span-2">{value || '-'}</dd>
    </div>
);

const ReadOnlyFeedback: React.FC<{ feedback: any, title: string }> = ({ feedback, title }) => (
    <Section title={title}>
        {feedback.strengths && <Detail label="Strengths" value={feedback.strengths} />}
        {feedback.weaknesses && <Detail label="Areas of Improvement" value={feedback.weaknesses} />}
        {feedback.recommendation && <Detail label="Recommendation" value={feedback.recommendation} />}
        {feedback.decision && <Detail label="Decision" value={feedback.decision} />}
        <Detail label="Remarks" value={feedback.remarks} />
        <Detail label="Date" value={feedback.date} />
    </Section>
);


const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ employee, role, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<FormData>({
        strengths: '',
        weaknesses: '',
        recommendation: Recommendation.Confirm,
        reportingManagerRemarks: '',
        deptHeadDecision: FinalDecision.Approve,
        deptHeadRemarks: '',
        hrHeadDecision: FinalDecision.Approve,
        hrHeadRemarks: '',
    });

    const isActionable = (employee.status === ConfirmationStatus.PendingReportingManager && role === UserRole.ReportingManager) ||
                       (employee.status === ConfirmationStatus.PendingDeptHead && role === UserRole.DeptHead) ||
                       (employee.status === ConfirmationStatus.PendingHRHead && role === UserRole.HRHead);


    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(employee.id, formData);
    };

    const renderReportingManagerForm = () => (
        <Section title="Reporting Manager's Review">
            <div className="space-y-4">
                <div>
                    <label htmlFor="strengths" className="block text-sm font-medium text-slate-700">Strengths</label>
                    <textarea id="strengths" rows={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" value={formData.strengths} onChange={e => setFormData({...formData, strengths: e.target.value})} required />
                </div>
                <div>
                    <label htmlFor="weaknesses" className="block text-sm font-medium text-slate-700">Areas for Improvement</label>
                    <textarea id="weaknesses" rows={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" value={formData.weaknesses} onChange={e => setFormData({...formData, weaknesses: e.target.value})} required/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Recommendation</label>
                    <div className="mt-2 space-y-2">
                        {Object.values(Recommendation).map(rec => (
                            <div key={rec} className="flex items-center">
                                <input id={rec} name="recommendation" type="radio" className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300" value={rec} checked={formData.recommendation === rec} onChange={e => setFormData({...formData, recommendation: e.target.value as Recommendation})} />
                                <label htmlFor={rec} className="ml-3 block text-sm font-medium text-slate-700">{rec}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="rm_remarks" className="block text-sm font-medium text-slate-700">Overall Remarks</label>
                    <textarea id="rm_remarks" rows={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" value={formData.reportingManagerRemarks} onChange={e => setFormData({...formData, reportingManagerRemarks: e.target.value})} required/>
                </div>
            </div>
        </Section>
    );

    const renderDeptHeadForm = () => (
        <Section title="Department Head's Review">
             <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Decision</label>
                    <div className="mt-2 flex space-x-4">
                         {Object.values(FinalDecision).map(dec => (
                            <div key={dec} className="flex items-center">
                                <input id={`dh_${dec}`} name="dh_decision" type="radio" className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300" value={dec} checked={formData.deptHeadDecision === dec} onChange={e => setFormData({...formData, deptHeadDecision: e.target.value as FinalDecision})} />
                                <label htmlFor={`dh_${dec}`} className="ml-3 block text-sm font-medium text-slate-700">{dec}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="dh_remarks" className="block text-sm font-medium text-slate-700">Remarks</label>
                    <textarea id="dh_remarks" rows={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" value={formData.deptHeadRemarks} onChange={e => setFormData({...formData, deptHeadRemarks: e.target.value})} required/>
                </div>
            </div>
        </Section>
    );

    const renderHRHeadForm = () => (
        <Section title="HR Head's Review">
            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Decision</label>
                    <div className="mt-2 flex space-x-4">
                         {Object.values(FinalDecision).map(dec => (
                            <div key={dec} className="flex items-center">
                                <input id={`hr_${dec}`} name="hr_decision" type="radio" className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300" value={dec} checked={formData.hrHeadDecision === dec} onChange={e => setFormData({...formData, hrHeadDecision: e.target.value as FinalDecision})} />
                                <label htmlFor={`hr_${dec}`} className="ml-3 block text-sm font-medium text-slate-700">{dec}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="hr_remarks" className="block text-sm font-medium text-slate-700">Remarks</label>
                    <textarea id="hr_remarks" rows={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" value={formData.hrHeadRemarks} onChange={e => setFormData({...formData, hrHeadRemarks: e.target.value})} required/>
                </div>
            </div>
        </Section>
    );

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-5 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">Confirmation Details</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div className="overflow-y-auto p-5 flex-grow min-h-0">
                    <form id="confirmation-form" onSubmit={handleFormSubmit}>
                        <Section title="Employee Information">
                            <dl className="space-y-1">
                                <Detail label="Name" value={employee.name} />
                                <Detail label="Employee ID" value={employee.employeeId} />
                                <Detail label="Designation" value={employee.designation} />
                                <Detail label="Department" value={employee.department} />
                                <Detail label="Joining Date" value={employee.joiningDate} />
                                <Detail label="Reporting Manager" value={employee.reportingManagerName} />
                                <Detail label="Confirmation Due" value={employee.confirmationDueDate} />
                                <Detail label="Current Status" value={employee.status} />
                            </dl>
                        </Section>

                        {employee.reportingManagerFeedback && <ReadOnlyFeedback feedback={employee.reportingManagerFeedback} title="Reporting Manager's Review" />}
                        {employee.deptHeadFeedback && <ReadOnlyFeedback feedback={employee.deptHeadFeedback} title="Department Head's Review" />}
                        {employee.hrHeadFeedback && <ReadOnlyFeedback feedback={employee.hrHeadFeedback} title="HR Head's Review" />}

                        {role === UserRole.ReportingManager && employee.status === ConfirmationStatus.PendingReportingManager && renderReportingManagerForm()}
                        {role === UserRole.DeptHead && employee.status === ConfirmationStatus.PendingDeptHead && renderDeptHeadForm()}
                        {role === UserRole.HRHead && employee.status === ConfirmationStatus.PendingHRHead && renderHRHeadForm()}
                    </form>
                </div>
                
                {isActionable && (
                    <div className="p-5 border-t border-slate-200 flex justify-end space-x-3 flex-shrink-0">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-transparent rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                            Cancel
                        </button>
                        <button type="submit" form="confirmation-form" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                            Submit Review
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmationForm;