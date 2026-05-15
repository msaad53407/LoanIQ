from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import json

from database import get_db
from models import ApplicationModel, DecisionModel, LoanApplicationSchema, LoanDecisionResponse, ApplicationWithDecision
from expert_system import ExpertSystem

router = APIRouter()
expert_system = ExpertSystem()

@router.post("/apply", response_model=LoanDecisionResponse)
async def apply_for_loan(application: LoanApplicationSchema, db: Session = Depends(get_db)):
    # 1. Save Application to DB
    db_application = ApplicationModel(**application.model_dump())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    # 2. Run Expert System
    result = expert_system.evaluate(application.model_dump())

    # 3. Save Decision to DB
    db_decision = DecisionModel(
        application_id=db_application.id,
        decision=result["decision"],
        confidence_score=result["confidence_score"],
        interest_rate=result["recommended_interest_rate"],
        max_eligible=result["max_loan_eligible"],
        explanation=" | ".join(result["explanation_chain"]),
        rules_fired=",".join(result["fired_rules"])
    )
    db.add(db_decision)
    db.commit()
    db.refresh(db_decision)

    return LoanDecisionResponse(
        application_id=db_application.id,
        decision=db_decision.decision,
        confidence_score=db_decision.confidence_score,
        interest_rate=db_decision.interest_rate,
        max_eligible=db_decision.max_eligible,
        explanation=db_decision.explanation,
        rules_fired=result["fired_rules"],
        timestamp=db_decision.timestamp
    )

@router.get("/applications", response_model=List[ApplicationWithDecision])
async def list_applications(db: Session = Depends(get_db)):
    apps = db.query(ApplicationModel).all()
    results = []
    for app in apps:
        results.append({
            "id": app.id,
            "applicant_name": app.applicant_name,
            "annual_income": app.annual_income,
            "loan_amount": app.loan_amount,
            "credit_score": app.credit_score,
            "decision": app.decision.decision if app.decision else "N/A",
            "created_at": app.created_at
        })
    return results

@router.get("/applications/{application_id}", response_model=LoanDecisionResponse)
async def get_application_details(application_id: int, db: Session = Depends(get_db)):
    decision = db.query(DecisionModel).filter(DecisionModel.application_id == application_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    return LoanDecisionResponse(
        application_id=decision.application_id,
        decision=decision.decision,
        confidence_score=decision.confidence_score,
        interest_rate=decision.interest_rate,
        max_eligible=decision.max_eligible,
        explanation=decision.explanation,
        rules_fired=decision.rules_fired.split(",") if decision.rules_fired else [],
        timestamp=decision.timestamp
    )

@router.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    decisions = db.query(DecisionModel).all()
    apps = db.query(ApplicationModel).all()
    total = len(decisions)
    
    if total == 0:
        return {
            "total_applications": 0, 
            "approval_rate": 0, 
            "avg_credit_score": 0, 
            "avg_loan_amount": 0,
            "rejection_reasons": []
        }

    approved = len([d for d in decisions if d.decision == "APPROVED"])
    
    avg_credit = db.query(func.avg(ApplicationModel.credit_score)).scalar() or 0
    avg_loan = db.query(func.avg(ApplicationModel.loan_amount)).scalar() or 0

    # Map rule IDs to rejection categories
    CREDIT_RULES = {"R4"}
    DEBT_RULES = {"R5", "R6"}
    INCOME_RULES = {"R7"}

    def get_rejection_category(rules_fired: str) -> set:
        if not rules_fired:
            return set()
        fired = set(rules_fired.split(","))
        categories = set()
        if fired & CREDIT_RULES:
            categories.add("credit")
        if fired & DEBT_RULES:
            categories.add("debt")
        if fired & INCOME_RULES:
            categories.add("income")
        return categories

    rejection_reasons = [
        {"reason": "Low Credit Score", "count": len([d for d in decisions if "credit" in get_rejection_category(d.rules_fired) and d.decision == "REJECTED"])},
        {"reason": "High Debt Ratio", "count": len([d for d in decisions if "debt" in get_rejection_category(d.rules_fired) and d.decision == "REJECTED"])},
        {"reason": "Insufficient Income", "count": len([d for d in decisions if "income" in get_rejection_category(d.rules_fired) and d.decision == "REJECTED"])}
    ]

    return {
        "total_applications": total,
        "approval_rate": (approved / total) * 100,
        "avg_credit_score": float(avg_credit),
        "avg_loan_amount": float(avg_loan),
        "rejection_reasons": rejection_reasons
    }

@router.get("/health")
async def health_check():
    return {"status": "healthy"}
