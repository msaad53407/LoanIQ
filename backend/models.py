from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlalchemy import Integer, String, Float, Boolean, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base

# SQLAlchemy Models


class ApplicationModel(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    applicant_name: Mapped[str] = mapped_column(String)
    age: Mapped[int] = mapped_column(Integer)
    annual_income: Mapped[float] = mapped_column(Float)
    monthly_debt: Mapped[float] = mapped_column(Float)
    loan_amount: Mapped[float] = mapped_column(Float)
    loan_purpose: Mapped[str] = mapped_column(String)
    employment_years: Mapped[float] = mapped_column(Float)
    credit_score: Mapped[int] = mapped_column(Integer)
    has_collateral: Mapped[bool] = mapped_column(Boolean)
    collateral_value: Mapped[float] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    decision: Mapped[Optional["DecisionModel"]] = relationship(
        "DecisionModel", back_populates="application", uselist=False
    )


class DecisionModel(Base):
    __tablename__ = "decisions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    application_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("applications.id"))
    decision: Mapped[str] = mapped_column(String)
    confidence_score: Mapped[float] = mapped_column(Float)
    interest_rate: Mapped[float] = mapped_column(Float)
    max_eligible: Mapped[float] = mapped_column(Float)
    explanation: Mapped[str] = mapped_column(Text)
    rules_fired: Mapped[str] = mapped_column(
        String)  # Stored as comma-separated IDs
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    application: Mapped[Optional["ApplicationModel"]] = relationship(
        "ApplicationModel", back_populates="decision"
    )

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
