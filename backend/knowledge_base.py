class KnowledgeBase:
    def __init__(self):
        self.min_credit_score = 580
        self.max_dti = 0.60
        self.avg_loan_interest = 0.05

    def calculate_dti(self, monthly_debt: float, annual_income: float) -> float:
        """Calculate Debt-to-Income ratio."""
        monthly_income = annual_income / 12
        if monthly_income == 0:
            return 1.0
        return monthly_debt / monthly_income

    def calculate_loan_eligibility(self, annual_income: float, credit_score: int) -> float:
        """Calculate maximum eligible loan amount based on income and credit score."""
        base_multiplier = 2.0
        if credit_score >= 750:
            base_multiplier = 4.0
        elif credit_score >= 700:
            base_multiplier = 3.0
        elif credit_score >= 650:
            base_multiplier = 2.5
        
        return annual_income * base_multiplier

    def assess_risk_level(self, credit_score: int, dti: float) -> str:
        """Assess risk level based on credit score and DTI."""
        if credit_score >= 750 and dti < 0.30:
            return "LOW"
        elif credit_score < 600 or dti > 0.50:
            return "HIGH"
        else:
            return "MEDIUM"
