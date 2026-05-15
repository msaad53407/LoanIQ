from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from database import Base

# SQLAlchemy Models
class ApplicationModel(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    applicant_name = Column(String)
    age = Column(Integer)
    annual_income = Column(Float)
    monthly_debt = Column(Float)
    loan_amount = Column(Float)
    loan_purpose = Column(String)
    employment_years = Column(Float)
    credit_score = Column(Integer)
    has_collateral = Column(Boolean)
    collateral_value = Column(Float)
    created_at = Column(DateTime, default=func.now())

    decision = relationship("DecisionModel", back_populates="application", uselist=False)

class DecisionModel(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    decision = Column(String)
    confidence_score = Column(Float)
    interest_rate = Column(Float)
    max_eligible = Column(Float)
    explanation = Column(Text)
    rules_fired = Column(String) # Stored as comma-separated IDs
    timestamp = Column(DateTime, default=func.now())

    application = relationship("ApplicationModel", back_populates="decision")

# Pydantic Models for API
class LoanApplicationSchema(BaseModel):
    applicant_name: str
    age: int
    annual_income: float
    monthly_debt: float
    loan_amount: float
    loan_purpose: str
    employment_years: float
    credit_score: int
    has_collateral: bool
    collateral_value: float

class LoanDecisionResponse(BaseModel):
    application_id: int
    decision: str
    confidence_score: float
    interest_rate: float
    max_eligible: float
    explanation: str
    rules_fired: List[str]
    timestamp: datetime

    class Config:
        from_attributes = True

class ApplicationWithDecision(BaseModel):
    id: int
    applicant_name: str
    annual_income: float
    loan_amount: float
    credit_score: int
    decision: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
