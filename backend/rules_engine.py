from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class Rule:
    rule_id: str
    conditions: List[Dict[str, Any]]
    conclusion: str
    priority: int
    explanation: str
    recommended_interest_rate: Optional[float] = None

class RulesEngine:
    def __init__(self):
        self.rules: List[Rule] = []
        self.load_rules()

    def load_rules(self):
        self.rules = [
            Rule(
                rule_id="R1",
                priority=1,
                conditions=[
                    {"field": "credit_score", "op": ">=", "value": 750},
                    {"field": "debt_to_income", "op": "<", "value": 0.35},
                    {"field": "employment_years", "op": ">=", "value": 2}
                ],
                conclusion="APPROVED",
                explanation="Excellent credit score, low DTI, and stable employment history.",
                recommended_interest_rate=0.035
            ),
            Rule(
                rule_id="R2",
                priority=2,
                conditions=[
                    {"field": "credit_score", "op": ">=", "value": 700},
                    {"field": "loan_amount", "op": "<=", "value": 50000},
                    {"field": "annual_income", "op": ">=", "value": 40000},
                    {"field": "employment_years", "op": ">=", "value": 1}
                ],
                conclusion="APPROVED",
                explanation="Good credit score and moderate loan amount with stable income.",
                recommended_interest_rate=0.045
            ),
            Rule(
                rule_id="R3",
                priority=3,
                conditions=[
                    {"field": "credit_score", "op": ">=", "value": 650},
                    {"field": "debt_to_income", "op": "<", "value": 0.45},
                    {"field": "has_collateral", "op": "==", "value": True}
                ],
                conclusion="CONDITIONAL_APPROVAL",
                explanation="Fair credit score and DTI, approved due to provided collateral.",
                recommended_interest_rate=0.06
            ),
            Rule(
                rule_id="R4",
                priority=1,
                conditions=[
                    {"field": "credit_score", "op": "<", "value": 580}
                ],
                conclusion="REJECTED",
                explanation="Credit score is below the minimum threshold of 580.",
                recommended_interest_rate=None
            ),
            Rule(
                rule_id="R5",
                priority=1,
                conditions=[
                    {"field": "debt_to_income", "op": ">=", "value": 0.60}
                ],
                conclusion="REJECTED",
                explanation="Debt-to-income ratio is too high (>= 60%).",
                recommended_interest_rate=None
            ),
            Rule(
                rule_id="R6",
                priority=2,
                conditions=[
                    {"field": "employment_years", "op": "<", "value": 1},
                    {"field": "loan_amount", "op": ">", "value": 25000}
                ],
                conclusion="REJECTED",
                explanation="High loan amount requested with less than 1 year of employment history.",
                recommended_interest_rate=None
            ),
            Rule(
                rule_id="R7",
                priority=2,
                conditions=[
                    {"field": "annual_income", "op": "<", "value": 20000},
                    {"field": "loan_amount", "op": ">", "value": 15000}
                ],
                conclusion="REJECTED",
                explanation="Annual income is too low for the requested loan amount.",
                recommended_interest_rate=None
            ),
            Rule(
                rule_id="R8",
                priority=5,
                conditions=[
                    {"field": "credit_score", "op": "between", "value": (580, 649)}
                ],
                conclusion="REVIEW",
                explanation="Credit score is in the marginal range and requires manual review.",
                recommended_interest_rate=None
            ),
            Rule(
                rule_id="R9",
                priority=5,
                conditions=[
                    {"field": "debt_to_income", "op": "between", "value": (0.45, 0.59)}
                ],
                conclusion="REVIEW",
                explanation="Debt-to-income ratio is in the high-risk range and requires review.",
                recommended_interest_rate=None
            ),
            Rule(
                rule_id="R10",
                priority=3,
                conditions=[
                    {"field": "credit_score", "op": "between", "value": (650, 699)},
                    {"field": "annual_income", "op": ">=", "value": 60000}
                ],
                conclusion="APPROVED",
                explanation="Fair credit score but strong annual income allows for approval with higher interest.",
                recommended_interest_rate=0.075
            )
        ]

    def get_rules(self) -> List[Rule]:
        return sorted(self.rules, key=lambda x: x.priority)
