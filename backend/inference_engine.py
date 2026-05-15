from typing import List, Dict, Any, Tuple
from rules_engine import Rule

class InferenceEngine:
    def __init__(self, rules: List[Rule]):
        self.rules = rules

    def evaluate_condition(self, fact_value: Any, condition: Dict[str, Any]) -> bool:
        op = condition["op"]
        val = condition["value"]

        if fact_value is None:
            return False

        if op == ">=":
            return fact_value >= val
        elif op == ">":
            return fact_value > val
        elif op == "<=":
            return fact_value <= val
        elif op == "<":
            return fact_value < val
        elif op == "==":
            return fact_value == val
        elif op == "between":
            low, high = val
            return low <= fact_value <= high
        
        return False

    def forward_chaining(self, facts: Dict[str, Any]) -> Dict[str, Any]:
        fired_rules = []
        explanation_chain = []
        final_decision = "PENDING"
        recommended_interest_rate = 0.0
        
        # Sort rules by priority (lower number = higher priority)
        sorted_rules = sorted(self.rules, key=lambda x: x.priority)

        for rule in sorted_rules:
            match = True
            for cond in rule.conditions:
                fact_field = cond["field"]
                if fact_field not in facts:
                    match = False
                    break
                
                if not self.evaluate_condition(facts[fact_field], cond):
                    match = False
                    break
            
            if match:
                fired_rules.append(rule.rule_id)
                explanation_chain.append(rule.explanation)
                
                # REJECTED takes precedence if multiple rules match, 
                # or we take the conclusion of the first (highest priority) matching rule
                if final_decision != "REJECTED":
                    final_decision = rule.conclusion
                    if rule.recommended_interest_rate:
                        recommended_interest_rate = rule.recommended_interest_rate
                
                if rule.conclusion == "REJECTED":
                    final_decision = "REJECTED"
                    break # Stop if rejected
        
        # Calculate a simple confidence score based on rule matches
        confidence_score = 0
        if fired_rules:
            if final_decision == "REJECTED":
                confidence_score = 100
            elif final_decision == "APPROVED":
                confidence_score = 90
            else:
                confidence_score = 75
        else:
            final_decision = "REVIEW"
            explanation_chain.append("No specific rules matched the applicant's profile. Manual review required.")
            confidence_score = 50

        return {
            "decision": final_decision,
            "confidence_score": confidence_score,
            "fired_rules": fired_rules,
            "explanation_chain": explanation_chain,
            "recommended_interest_rate": recommended_interest_rate
        }
