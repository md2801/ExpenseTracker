// frontend/src/services/api.js
// ============================================================
// API service layer — all HTTP requests to the backend live here
// Keeps API logic completely separate from UI components
// ============================================================

// Base URL of the FastAPI backend
const BASE_URL = "http://localhost:8000";

/**
 * Helper function that wraps fetch() with error handling.
 * Throws a descriptive error if the response status is not OK (2xx).
 *
 * @param {string} endpoint - Path after the base URL (e.g. "/expenses")
 * @param {RequestInit} options - Standard fetch options (method, body, headers)
 * @returns {Promise<any>} Parsed JSON response, or null for 204 No Content
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  // Default headers — all requests send/receive JSON
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content (DELETE success) — no body to parse
    if (response.status === 204) {
      return null;
    }

    // Parse the JSON body
    const data = await response.json();

    // If the server returned an error status, throw with the detail message
    if (!response.ok) {
      const errorMessage = data.detail || `HTTP error ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Re-throw with context if it's a network error (server not running etc.)
    if (error.name === "TypeError") {
      throw new Error(
        "Cannot connect to the server. Make sure the backend is running on port 8000."
      );
    }
    throw error; // Re-throw API errors as-is
  }
}


// ── Expense API functions ────────────────────────────────────

/**
 * GET /expenses
 * Fetch all expenses from the database.
 * @returns {Promise<Array>} Array of expense objects
 */
export async function fetchExpenses() {
  return request("/expenses/");
}

/**
 * POST /expenses
 * Create a new expense record.
 * @param {Object} expenseData - { title, category, amount, date, description }
 * @returns {Promise<Object>} The newly created expense (with id)
 */
export async function createExpense(expenseData) {
  return request("/expenses/", {
    method: "POST",
    body: JSON.stringify(expenseData),
  });
}

/**
 * PUT /expenses/{id}
 * Update an existing expense by its id.
 * @param {number} id - The expense id to update
 * @param {Object} expenseData - Updated expense fields
 * @returns {Promise<Object>} The updated expense object
 */
export async function updateExpense(id, expenseData) {
  return request(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(expenseData),
  });
}

/**
 * DELETE /expenses/{id}
 * Permanently delete an expense by its id.
 * @param {number} id - The expense id to delete
 * @returns {Promise<null>} Resolves to null on success
 */
export async function deleteExpense(id) {
  return request(`/expenses/${id}`, {
    method: "DELETE",
  });
}
