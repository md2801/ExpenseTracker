# backend/models.py
# ============================================================
# SQLAlchemy ORM model + Pydantic schemas
# The ORM model maps to the MySQL table
# Pydantic schemas handle request/response validation
# ============================================================

from sqlalchemy import Column, Integer, String, Numeric, Date, Text, TIMESTAMP
from sqlalchemy.sql import func
from pydantic import BaseModel, field_validator
from datetime import date, datetime
from typing import Optional
from database import Base


# ── SQLAlchemy ORM Model ─────────────────────────────────────
# Represents the "expenses" table in MySQL
class Expense(Base):
    __tablename__ = "expenses"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title       = Column(String(255), nullable=False)
    category    = Column(String(100), nullable=False)
    amount      = Column(Numeric(10, 2), nullable=False)
    date        = Column(Date, nullable=False)
    description = Column(Text, nullable=True)
    created_at  = Column(TIMESTAMP, server_default=func.now())


# ── Pydantic Schemas ─────────────────────────────────────────
# These define the shape of data coming IN (requests) and going OUT (responses)

class ExpenseBase(BaseModel):
    """Shared fields used by both Create and Update schemas."""
    title:       str
    category:    str
    amount:      float
    date:        date
    description: Optional[str] = None

    # Validation: title must not be empty or just whitespace
    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Title cannot be empty")
        return value.strip()

    # Validation: amount must be a positive number
    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, value: float) -> float:
        if value <= 0:
            raise ValueError("Amount must be greater than zero")
        return round(value, 2)  # Ensure only 2 decimal places

    # Validation: category must be one of the accepted values
    @field_validator("category")
    @classmethod
    def category_must_be_valid(cls, value: str) -> str:
        allowed = ["Food", "Transport", "Entertainment", "Education",
                   "Health", "Utilities", "Shopping", "Other"]
        if value not in allowed:
            raise ValueError(f"Category must be one of: {', '.join(allowed)}")
        return value


class ExpenseCreate(ExpenseBase):
    """Schema for POST /expenses — creating a new expense."""
    pass  # Inherits all fields from ExpenseBase


class ExpenseUpdate(ExpenseBase):
    """Schema for PUT /expenses/{id} — updating an existing expense."""
    pass  # Same fields; id comes from the URL path


class ExpenseResponse(ExpenseBase):
    """Schema for responses — includes id and created_at."""
    id:         int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Allows Pydantic to read from SQLAlchemy model attributes
