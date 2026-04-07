# backend/main.py
# ============================================================
# FastAPI application entry point
# Sets up the app, CORS middleware, and registers routers
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes.expenses import router as expenses_router

# ── Create all database tables ────────────────────────────────
# This reads all ORM models that inherit from Base and creates
# their corresponding tables in MySQL if they don't already exist
Base.metadata.create_all(bind=engine)

# ── Initialise the FastAPI app ────────────────────────────────
app = FastAPI(
    title="Expense Tracker API",
    description="REST API for managing personal expenses — CRUD with FastAPI + MySQL",
    version="1.0.0"
)

# ── CORS Middleware ───────────────────────────────────────────
# Allows the React frontend (running on port 3000) to make
# requests to this API (running on port 8000).
# Without this, browsers will block cross-origin requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server origin
    allow_credentials=True,
    allow_methods=["*"],    # Allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],    # Allow all headers including Content-Type
)

# ── Register routers ──────────────────────────────────────────
# The expenses router handles all /expenses/* endpoints
app.include_router(expenses_router)


# ── Root health check endpoint ────────────────────────────────
@app.get("/")
def root():
    """
    Simple health check. Visit http://localhost:8000 to confirm
    the API is running. Auto-generated docs at /docs.
    """
    return {
        "message": "Expense Tracker API is running",
        "docs": "http://localhost:8000/docs",
        "version": "1.0.0"
    }
