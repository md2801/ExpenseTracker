-- ============================================================
-- expense_db.sql
-- Database setup file for the Expense Tracker application
-- Creates the database, table, and inserts sample data
-- ============================================================

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS expense_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Use the newly created database
USE expense_db;

-- ============================================================
-- Create the expenses table
-- Stores all user expense records
-- ============================================================
CREATE TABLE IF NOT EXISTS expenses (
    id          INT AUTO_INCREMENT PRIMARY KEY,         -- Unique identifier for each expense
    title       VARCHAR(255)   NOT NULL,                -- Short title / name of the expense
    category    VARCHAR(100)   NOT NULL,                -- Category (Food, Transport, etc.)
    amount      DECIMAL(10, 2) NOT NULL,                -- Amount spent (supports cents)
    date        DATE           NOT NULL,                -- Date the expense occurred
    description TEXT           DEFAULT NULL,            -- Optional longer description
    created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP -- Auto-set when record is inserted
);

-- ============================================================
-- Sample data — gives the app something to display on first run
-- ============================================================
INSERT INTO expenses (title, category, amount, date, description) VALUES
('Weekly Groceries',        'Food',          85.50,  '2025-07-01', 'Woolworths grocery run for the week'),
('Monthly Bus Pass',        'Transport',    120.00,  '2025-07-01', 'Monthly public transport card top-up'),
('Netflix Subscription',    'Entertainment', 22.99,  '2025-07-02', 'Monthly streaming subscription'),
('Coffee & Lunch',          'Food',          18.40,  '2025-07-03', 'Flat white and sandwich from cafe'),
('Python Textbook',         'Education',     55.00,  '2025-07-04', 'Core Python Programming 3rd Edition'),
('Electricity Bill',        'Utilities',    145.00,  '2025-07-05', 'Quarterly electricity bill payment'),
('Gym Membership',          'Health',        49.95,  '2025-07-06', 'Monthly gym membership fee'),
('Dinner with Friends',     'Food',          62.00,  '2025-07-08', 'Italian restaurant for birthday dinner'),
('Uber Ride',               'Transport',     14.50,  '2025-07-09', 'Ride home from the city after 10pm'),
('Online Course – React',   'Education',     29.99,  '2025-07-10', 'Udemy React course for university project'),
('Pharmacy',                'Health',        23.80,  '2025-07-11', 'Vitamins and cold medication'),
('Spotify Premium',         'Entertainment', 11.99,  '2025-07-12', 'Monthly music subscription'),
('Internet Bill',           'Utilities',     79.00,  '2025-07-13', 'Monthly home internet plan'),
('Farmers Market',          'Food',          34.20,  '2025-07-14', 'Fresh fruit, veggies and eggs'),
('Movie Tickets',           'Entertainment', 38.00,  '2025-07-15', 'Two tickets including popcorn');
