# backend/routes/expenses.py
# ============================================================
# Expense routes — all CRUD endpoints live here
# Separated from main.py for cleaner code organisation
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# Import from sibling modules (note: imports are relative to backend/)
from database import get_db
from models import Expense, ExpenseCreate, ExpenseUpdate, ExpenseResponse

# Create a router — this gets registered in main.py
router = APIRouter(
    prefix="/expenses",   # All routes here start with /expenses
    tags=["Expenses"]     # Groups endpoints in the auto-generated docs
)


# ── READ — Get all expenses ───────────────────────────────────
# GET /expenses
# Returns a list of all expense records, ordered newest first
@router.get("/", response_model=List[ExpenseResponse])
def get_all_expenses(db: Session = Depends(get_db)):
    """
    Retrieve all expenses from the database.
    Uses SQLAlchemy ORM to query the expenses table.
    Results are ordered by date descending (most recent first).
    """
    expenses = (
        db.query(Expense)
        .order_by(Expense.date.desc(), Expense.created_at.desc())
        .all()
    )
    return expenses


# ── READ — Get a single expense by ID ────────────────────────
# GET /expenses/{id}
# Useful for pre-filling an edit form with existing data
@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single expense by its primary key (id).
    Returns 404 if the expense does not exist.
    """
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    # Raise a 404 error if no matching record found
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id {expense_id} not found"
        )
    return expense


# ── CREATE — Add a new expense ───────────────────────────────
# POST /expenses
# Accepts JSON body matching ExpenseCreate schema
@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(expense_data: ExpenseCreate, db: Session = Depends(get_db)):
    """
    Create a new expense record.
    Pydantic validates the incoming request body automatically.
    SQLAlchemy inserts the record and returns it with the generated id.
    """
    # Convert the Pydantic model to a dict, then unpack into ORM model
    new_expense = Expense(**expense_data.model_dump())

    db.add(new_expense)      # Stage the insert
    db.commit()              # Write to the database
    db.refresh(new_expense)  # Reload to get auto-generated id and created_at

    return new_expense


# ── UPDATE — Edit an existing expense ────────────────────────
# PUT /expenses/{id}
# Replaces all fields of the specified expense
@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, expense_data: ExpenseUpdate, db: Session = Depends(get_db)):
    """
    Update an existing expense by id.
    All fields are replaced (full update, not partial).
    Returns 404 if the expense does not exist.
    """
    # First, check the expense exists
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id {expense_id} not found"
        )

    # Update each field on the ORM object
    update_data = expense_data.model_dump()
    for field, value in update_data.items():
        setattr(expense, field, value)

    db.commit()           # Persist changes
    db.refresh(expense)   # Reload to confirm saved values

    return expense


# ── DELETE — Remove an expense ────────────────────────────────
# DELETE /expenses/{id}
# Permanently removes the record from the database
@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    """
    Delete an expense by id.
    Returns 204 No Content on success (no response body).
    Returns 404 if the expense does not exist.
    """
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id {expense_id} not found"
        )

    db.delete(expense)   # Stage the delete
    db.commit()          # Execute the delete
    # No return value — 204 means "success, nothing to return"
