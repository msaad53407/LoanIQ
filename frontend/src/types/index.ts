export enum LoanPurpose {
  HOME = 'HOME',
  CAR = 'CAR',
  BUSINESS = 'BUSINESS',
  EDUCATION = 'EDUCATION',
  PERSONAL = 'PERSONAL'
}

export type DecisionStatus = 'APPROVED' | 'REJECTED' | 'CONDITIONAL_APPROVAL' | 'REVIEW';

export interface LoanApplication {
  applicantName: string;
  age: number;
  annualIncome: number;
  monthlyDebt: number;
  loanAmount: number;
  loanPurpose: LoanPurpose;
  employmentYears: number;
  creditScore: number;
  hasCollateral: boolean;
  collateralValue: number;
}

export interface LoanDecision {
  applicationId: number;
  decision: DecisionStatus;
  confidenceScore: number;
  interestRate: number;
  maxEligible: number;
  explanation: string;
  explanationChain: string[];
  rulesFired: string[];
  timestamp: string;
}

export interface ApplicationRecord extends LoanApplication {
  id: number;
  decision?: DecisionStatus;
  createdAt: string;
  result?: LoanDecision;
}

export interface RejectionReason {
  reason: string;
  count: number;
}

export interface Stats {
  totalApplications: number;
  approvalRate: number;
  avgCreditScore: number;
  avgLoanAmount: number;
  rejectionReasons: RejectionReason[];
}
