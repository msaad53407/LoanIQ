import axios from 'axios'
import { useState, useCallback } from 'react'
import { LoanApplication, LoanDecision, ApplicationRecord, Stats } from '../types'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Mapper: Frontend -> Backend (Camel to Snake)
const mapToBackend = (data: LoanApplication) => ({
  applicant_name: data.applicantName,
  age: data.age,
  annual_income: data.annualIncome,
  monthly_debt: data.monthlyDebt,
  loan_amount: data.loanAmount,
  loan_purpose: data.loanPurpose,
  employment_years: data.employmentYears,
  credit_score: data.creditScore,
  has_collateral: data.hasCollateral,
  collateral_value: data.collateralValue,
})

// Mapper: Backend -> Frontend (Snake to Camel) — for list endpoint
const mapFromBackend = (data: any): ApplicationRecord => ({
  id: data.id,
  applicantName: data.applicant_name,
  age: data.age || 0,
  annualIncome: data.annual_income,
  loanAmount: data.loan_amount,
  creditScore: data.credit_score,
  decision: data.decision,
  createdAt: data.created_at,
  monthlyDebt: data.monthly_debt || 0,
  loanPurpose: data.loan_purpose || 'PERSONAL',
  employmentYears: data.employment_years || 0,
  hasCollateral: data.has_collateral || false,
  collateralValue: data.collateral_value || 0,
})

// Mapper: Decision response (POST /apply, GET /applications/:id) -> LoanDecision
const mapDecisionFromBackend = (data: any): LoanDecision => ({
  applicationId: data.application_id,
  decision: data.decision,
  confidenceScore: data.confidence_score,
  interestRate: data.interest_rate,
  maxEligible: data.max_eligible,
  explanation: data.explanation,
  explanationChain: data.explanation_chain || data.explanation?.split(' | ') || [],
  rulesFired: data.rules_fired || [],
  timestamp: data.timestamp,
})

export const loanApi = {
  submitLoanApplication: async (data: LoanApplication): Promise<LoanDecision> => {
    const payload = mapToBackend(data)
    const response = await api.post('/apply', payload)
    return mapDecisionFromBackend(response.data)
  },

  getAllApplications: async (): Promise<ApplicationRecord[]> => {
    const response = await api.get('/applications')
    return response.data.map(mapFromBackend)
  },

  getApplicationById: async (id: string): Promise<LoanDecision> => {
    const response = await api.get(`/applications/${id}`)
    return mapDecisionFromBackend(response.data)
  },

  getStats: async (): Promise<any> => {
    const response = await api.get('/stats')
    // Stats returned from backend are snake_case:
    // { total_applications, approval_rate, rejection_rate, avg_credit_score }
    return response.data
  },

  healthCheck: async (): Promise<{ status: string }> => {
    const response = await api.get('/health')
    return response.data
  }
}

export function useApi<T>(apiFunc: (...args: any[]) => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFunc(...args)
      setData(result)
      return result
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'An error occurred'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunc])

  return { data, loading, error, execute }
}
