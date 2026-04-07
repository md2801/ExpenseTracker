// frontend/src/App.js
// ============================================================
// Root application component — manages global state and
// coordinates all child components and API calls.
// Demonstrates: useState, useEffect, SPA architecture, CRUD
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import EditExpenseModal from "./components/EditExpenseModal";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./services/api";
import "./App.css";

/**
 * App — the top-level component.
 * Owns all shared state and passes data + handlers down as props.
 */
function App() {
  // ── Global state ────────────────────────────────────────
  const [expenses, setExpenses]             = useState([]);         // All expense records
  const [selectedCategory, setSelectedCategory] = useState("All"); // Active filter
  const [editingExpense, setEditingExpense] = useState(null);       // Expense being edited (or null)
  const [isLoadingList, setIsLoadingList]   = useState(true);       // List fetch in progress
  const [isLoadingForm, setIsLoadingForm]   = useState(false);      // Form submit in progress
  const [isLoadingEdit, setIsLoadingEdit]   = useState(false);      // Edit modal save in progress
  const [notification, setNotification]     = useState(null);       // { message, type } | null

  // ── Grand total across ALL expenses (unfiltered) ────────
  const grandTotal = expenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount), 0
  );

  // ── Load expenses on mount ───────────────────────────────
  // useEffect with an empty dependency array runs once when the component mounts.
  // This is equivalent to componentDidMount in class components.
  useEffect(() => {
    loadExpenses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch all expenses from the API ─────────────────────
  const loadExpenses = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  // ── Notification helper ──────────────────────────────────
  // Shows a toast-style message that auto-dismisses after 3 seconds
  function showNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }

  // ── CREATE — Add a new expense ───────────────────────────
  // Called by ExpenseForm when the user submits the add form
  async function handleAddExpense(expenseData) {
    setIsLoadingForm(true);
    try {
      const newExpense = await createExpense(expenseData);

      // Update state directly instead of re-fetching (faster UX)
      setExpenses((prev) => [newExpense, ...prev]);
      showNotification(`"${newExpense.title}" added successfully!`, "success");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsLoadingForm(false);
    }
  }

  // ── UPDATE — Save edits from the modal ──────────────────
  // Called by EditExpenseModal when the user submits the edit form
  async function handleSaveEdit(id, updatedData) {
    setIsLoadingEdit(true);
    try {
      const updatedExpense = await updateExpense(id, updatedData);

      // Replace the old expense in state with the updated version
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === id ? updatedExpense : exp))
      );

      showNotification(`"${updatedExpense.title}" updated successfully!`, "success");
      setEditingExpense(null); // Close the modal
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsLoadingEdit(false);
    }
  }

  // ── DELETE — Remove an expense ───────────────────────────
  // Called by ExpenseItem when the user confirms deletion
  async function handleDeleteExpense(id) {
    // Find the expense name before deleting (for the notification message)
    const expense = expenses.find((exp) => exp.id === id);

    try {
      await deleteExpense(id);

      // Remove from state — no need to re-fetch the whole list
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      showNotification(`"${expense?.title}" deleted.`, "info");
    } catch (error) {
      showNotification(error.message, "error");
    }
  }

  // ── Open edit modal ──────────────────────────────────────
  // Called by ExpenseItem's Edit button
  function handleEditClick(expense) {
    setEditingExpense(expense);
  }

  // ── Close edit modal ─────────────────────────────────────
  function handleCloseModal() {
    setEditingExpense(null);
  }

  // ── Format grand total as currency ──────────────────────
  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="app">
      {/* ── Toast notification ──────────────────────────── */}
      {notification && (
        <div
          className={`notification notification-${notification.type}`}
          role="status"
          aria-live="polite"
        >
          {notification.message}
        </div>
      )}

      {/* ── App header ──────────────────────────────────── */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <span className="header-logo" aria-hidden="true">💰</span>
            <div>
              <h1 className="header-title">Expense Tracker</h1>
              <p className="header-subtitle">Track. Analyse. Save.</p>
            </div>
          </div>

          {/* Grand total badge */}
          <div className="header-total">
            <span className="header-total-label">All-time total</span>
            <span className="header-total-amount">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────── */}
      <main className="app-main">
        <div className="app-container">

          {/* Left column: Add expense form */}
          <aside className="sidebar">
            <ExpenseForm
              onSubmit={handleAddExpense}
              isLoading={isLoadingForm}
            />
          </aside>

          {/* Right column: Filtered list + trend */}
          <section className="main-content" aria-label="Expense list">
            <ExpenseList
              expenses={expenses}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onEdit={handleEditClick}
              onDelete={handleDeleteExpense}
              isLoading={isLoadingList}
            />
          </section>
        </div>
      </main>

      {/* ── Edit modal (rendered at root level for proper overlay) ── */}
      <EditExpenseModal
        expense={editingExpense}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
        isLoading={isLoadingEdit}
      />

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="app-footer">
        <p>Expense Tracker · Built with React + FastAPI + MySQL</p>
      </footer>
    </div>
  );
}

export default App;
