# Expense Tracker Web Application

This is a full-stack web application I built as part of my university learning. The goal of the project was to create a simple and practical tool that helps users track their daily expenses in an organised way.

The application follows a single-page application (SPA) approach, so users can add, edit, delete, and filter expenses without refreshing the page. Along the way, I focused on applying concepts like frontend-backend integration, API handling, and database management.


---

## Problem Overview

Managing personal spending can be difficult, especially for students working with limited budgets. I created this app as a straightforward solution to log expenses, organise them into categories, and get a clear picture of spending habits over time.

The main idea was not just to build something functional, but also to reinforce what I’ve learned in areas like React, FastAPI, and working with databases.


---

## Tech Stack

| Layer      | Technology                                       |
|------------|--------------------------------------------------|
| Frontend   | React (functional components)                    |
| Styling    | CSS (custom variables and responsive design)     |
| Backend    | FastAPI (Python)                                 |
| ORM        | SQLAlchemy                                       |
| Validation | Pydantic                                         |
| Database   | MySQL                                            |
| HTTP       | Fetch API (browser-native)                       |

---

## Feature List

- **Add Expense** - Users can enter a title, category, amount, date, and an optional description.
- **View All Expenses** - Expenses are displayed instantly and update without reloading the page.
- **Edit Expense** - Existing entries can be updated through a modal with pre-filled values.
- **Delete Expense** - Each expense can be removed with a confirmation step to prevent mistakes.
- **Category Filter** - A dropdown allows filtering expenses by category.
- **Total Calculation** - The total amount updates dynamically based on the visible expenses.
- **Monthly Trend** - A bar chart shows spending patterns across the last three months.
- **Notifications** - Feedback messages appear after actions like adding or deleting.
- **Responsive Layout** - The UI works across desktop, tablet, and mobile devices.
- **Form Validation** - Both client-side and server-side validation are implemented.
- **Loading States** - Buttons and UI elements respond properly during API calls.

---

## Folder Structure

```
expense-tracker/
├── .gitignore              # Files excluded from version control
├── README.md               # This file
├── expense_db.sql          # MySQL database setup + sample data
│
├── backend/                # FastAPI Python server
│   ├── main.py             # App entry point, CORS, router registration
│   ├── database.py         # SQLAlchemy engine, session, and Base
│   ├── models.py           # ORM model (Expense) + Pydantic schemas
│   ├── requirements.txt    # Python dependencies
│   └── routes/
│       ├── __init__.py     # Makes routes/ a Python package
│       └── expenses.py     # All CRUD route handlers
│
└── frontend/               # React single-page application
    ├── package.json        # Node dependencies and scripts
    ├── public/
    │   └── index.html      # HTML shell — React mounts here
    └── src/
        ├── App.js          # Root component — global state + layout
        ├── App.css         # All application styles
        ├── index.js        # React DOM entry point
        ├── components/
        │   ├── ExpenseForm.jsx       # Controlled form for adding expenses
        │   ├── ExpenseList.jsx       # Filter bar, trend chart, list container
        │   ├── ExpenseItem.jsx       # Single expense row with edit/delete
        │   └── EditExpenseModal.jsx  # Modal overlay for editing
        └── services/
            └── api.js      # All fetch() calls to the backend API
```

---

## Setup Instructions

You will need three terminals open to run everything smoothly.

### Prerequisites

Make sure the following are installed:
- [Node.js](https://nodejs.org/) v18 or higher (`node --version`)
- [Python](https://www.python.org/) 3.11 or higher (`python --version`)
- [MySQL](https://dev.mysql.com/downloads/) 8.0 (`mysql --version`)
- [VS Code](https://code.visualstudio.com/) (recommended editor)

---

### Step 1 — Set up the MySQL Database (Terminal 1)

Open MySQL Workbench or your terminal and log in to MySQL:

```bash
mysql -u root -p
```

Then run the SQL setup file to create the database and sample data:

```sql
source /path/to/expense-tracker/expense_db.sql;
```

Or from your terminal (outside MySQL):

```bash
mysql -u root -p < expense_db.sql
```

Verify it worked:

```sql
USE expense_db;
SELECT * FROM expenses;
```

---

### Step 2 — Configure the Database Password

Open `backend/database.py` and update the connection URL with your MySQL password:

```python
# Line 13 — change "password" to your actual MySQL root password
DATABASE_URL = "mysql+pymysql://root:YOUR_PASSWORD_HERE@localhost:3306/expense_db"
```

---

### Step 3 — Start the Backend (Terminal 2)

```bash
# Navigate to the backend folder
cd expense-tracker/backend

# Create a virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Activate it (Mac / Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

You should see: `Uvicorn running on http://127.0.0.1:8000`

Visit **http://localhost:8000/docs** to see the auto-generated API documentation.

---

### Step 4 — Start the Frontend (Terminal 3)

```bash
# Navigate to the frontend folder
cd expense-tracker/frontend

# Install Node dependencies (first time only — takes ~1 minute)
npm install

# Start the React development server
npm start
```

Your browser should automatically open **http://localhost:3000**

---

### Step 5 — Use the Application

With both servers running:

1. The React app at **http://localhost:3000** connects to the API at **http://localhost:8000**
2. Fill in the form on the left and click **Add Expense**
3. Your expense appears instantly in the list; no page reload.
4. Click **✏️ Edit** to open the modal and update an expense.
5. Click **🗑️ Delete** then **Yes** to remove an expense.
6. Use the **Filter by Category** dropdown to filter the list.

---

## Common Issues & Fixes

| Problem | Fix |
|--------|-----|
| `Access denied for user 'root'` | Update the password in `backend/database.py` |
| `Cannot connect to server` | Make sure the backend is running on port 8000 |
| `Module not found` | Run `pip install -r requirements.txt` again with venv activated |
| `npm install` fails | Delete `node_modules/` and run `npm install` again |
| CORS error in browser | Check that `allow_origins` in `main.py` matches your React URL |
| Port 3000 already in use | React will ask to use a different port — press Y |

---

## Challenges Faced

**1. Understanding CORS**
Initially, the frontend couldn’t communicate with the backend due to browser restrictions. Learning how CORS works and configuring it correctly in FastAPI resolved the issue.

**2. Controlled vs Uncontrolled React Inputs**
Switching from uncontrolled inputs to controlled components using useState took some adjustment, but it made the code more predictable and easier to manage.

**3. useEffect Dependency Array**
I ran into an infinite render loop because I missed the dependency array. Understanding how dependencies control re-renders helped fix this.

**4. Working with SQLAlchemy**
Moving from raw SQL to ORM-based queries felt unfamiliar at first, but it eventually made database interactions cleaner.

**5. Keeping State in Sync**
At first, I re-fetched data after every change. Later, I updated the local state directly, which improved performance and responsiveness.

**6. Date Timezone Issues**
Dates stored as `DATE` in MySQL came back as strings like `"2025-07-04"`. Passing these directly to `new Date()` caused off-by-one errors due to UTC vs local timezone. Appending `T00:00:00` before parsing forced the date to be interpreted in local time.

---

## Concepts Demonstrated

| Concept | Where I Used It |
|---------|----------------|
| Semantic HTML | Used basic tags like `header`, `main`, `section`, and `footer` in the React components and `index.html` |
| CSS layout and responsiveness | Built layouts using Flexbox and Grid in `App.css`, along with media queries for smaller screens |
| CSS variables | Defined reusable variables in the `:root` section of `App.css` |
| DOM handling in React | Didn’t manipulate the DOM directly — React handles updates through state changes |
| React components | Broke the UI into smaller components like forms, lists, and modals |
| useState | Managed form inputs, expense data, and UI state across multiple components |
| useEffect | Used for initial data fetching and syncing form data in the edit modal |
| Props | Passed data and functions between parent and child components |
| Single Page Application | All updates (add/edit/delete/filter) happen without reloading the page |
| FastAPI | Built REST endpoints for CRUD operations in the backend |
| Pydantic | Used for request validation and response models |
| SQLAlchemy | Defined the database model and handled queries using ORM methods |
| MySQL | Stored expense data in a relational database |
| CORS | Configured backend to allow requests from the frontend |
| Separation of concerns | Kept API logic separate from UI components |
| Error handling | Used try/catch in frontend and proper HTTP responses in backend |

---
