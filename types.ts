
export enum UserRole {
  ReportingManager = "Reporting Manager",
  DeptHead = "Department Head",
  HRHead = "HR Head",
}

export enum ConfirmationStatus {
  PendingReportingManager = "Pending Reporting Manager",
  PendingDeptHead = "Pending Dept. Head",
  PendingHRHead = "Pending HR Head",
  Confirmed = "Confirmed",
  ProbationExtended = "Probation Extended",
  Terminated = "Terminated",
}

export enum Recommendation {
  Confirm = "Confirm",
  Extend = "Extend Probation",
  Terminate = "Terminate",
}

export enum FinalDecision {
  Approve = "Approve",
  Reject = "Reject",
}

export interface Feedback {
  remarks: string;
  date: string;
}

export interface ReportingManagerFeedback extends Feedback {
  strengths: string;
  weaknesses: string;
  recommendation: Recommendation;
}

export interface DeptHeadFeedback extends Feedback {
  decision: FinalDecision;
}

export interface HRHeadFeedback extends Feedback {
  decision: FinalDecision;
}

export interface Employee {
  id: number;
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  joiningDate: string;
  reportingManagerName: string;
  confirmationDueDate: string;
  status: ConfirmationStatus;
  reportingManagerFeedback: ReportingManagerFeedback | null;
  deptHeadFeedback: DeptHeadFeedback | null;
  hrHeadFeedback: HRHeadFeedback | null;
}

export type FormData = {
    strengths: string;
    weaknesses: string;
    recommendation: Recommendation;
    reportingManagerRemarks: string;
    deptHeadDecision: FinalDecision;
    deptHeadRemarks: string;
    hrHeadDecision: FinalDecision;
    hrHeadRemarks: string;
};
