# Daily Work Tracker Database Schema

This document outlines the structure for the three core tables used by the Daily Work Tracker application: Users, Tasks, and DailyLog.

---

## Table 1: Users (Login & Access)

| Field Name | Data Type (SQL) | Required? | Purpose | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `user_id` | INT (PK) | YES | Unique ID for each employee/admin. | Auto-Increment |
| `email` | VARCHAR(255) | YES | Used for login and reminders. | Unique Index |
| `password_hash` | VARCHAR(255) | YES | Stores the secure, encrypted password. | |
| `role` | VARCHAR(50) | YES | Defines access level. | Values: 'Employee', 'Admin' |
| `status` | VARCHAR(50) | YES | Controls initial login access. | Values: 'Pending', 'Approved' |
| `created_at` | TIMESTAMP | YES | Date/time the user was added. | |

---

## Table 2: Tasks (Admin Managed Work Items)

| Field Name | Data Type (SQL) | Required? | Purpose | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `task_id` | INT (PK) | YES | Unique ID for the task. | Auto-Increment |
| `task_name` | VARCHAR(100) | YES | The actual name of the work item. | e.g., "RTO OPEN", "Cleaning" |
| `is_active` | BOOLEAN | YES | Controls if the task appears in the App. | TRUE (Visible) or FALSE (Hidden) |
| `created_by_user_id`| INT (FK) | NO | Who initially created the task. | References `Users(user_id)` |
| `created_at` | TIMESTAMP | YES | Date/time the task was added. | |

---

## Table 3: DailyLog (Employee Work Records)

| Field Name | Data Type (SQL) | Required? | Purpose | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `log_id` | INT (PK) | YES | Unique ID for each submitted log. | Auto-Increment |
| `user_id` | INT (FK) | YES | Links the log to the employee. | References `Users(user_id)` |
| `task_id` | INT (FK) | YES | Links the log to the specific task. | References `Tasks(task_id)` |
| `work_date` | DATE | YES | The calendar day the work was performed. | For reporting and reminders |
| `start_time` | TIME | YES | When the work started. | |
| `end_time` | TIME | YES | When the work ended. | |
| `duration_minutes`| INT/DECIMAL | YES | Total time spent. | **Calculated** (End Time - Start Time) |
| `is_completed` | BOOLEAN | YES | Your requested **Checkbox** field. | TRUE if task was completed |
| `notes` | TEXT | NO | Field for remarks or context. | |
| `logged_at` | TIMESTAMP | YES | Date/time the record was submitted to the system. | |
