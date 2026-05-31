from typing import Dict, Any
from knowledge_base import KnowledgeBase
from rules_engine import RulesEngine
from inference_engine import InferenceEngine


class ExpertSystem:
    def __init__(self):
        self.kb = KnowledgeBase()
        self.rules_engine = RulesEngine()
        self.inference_engine = InferenceEngine(self.rules_engine.get_rules())

    def evaluate(self, applicant_data: Dict[str, Any]) -> Dict[str, Any]:
        """Orchestrate the loan evaluation process."""
        # Pre-process facts
        facts = applicant_data.copy()
        facts["debt_to_income"] = self.kb.calculate_dti(
            applicant_data.get("monthly_debt", 0),
            applicant_data.get("annual_income", 0)
        )

        # Run Inference
        inference_result = self.inference_engine.forward_chaining(facts)

        # Post-process results with KB data
        max_eligible = self.kb.calculate_loan_eligibility(
            applicant_data.get("annual_income", 0),
            applicant_data.get("credit_score", 0)
        )

        # Combine everything
        result = {
            **inference_result,
            "max_loan_eligible": max_eligible,
            "facts_used": facts
        }

        return result
