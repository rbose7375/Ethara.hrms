# Ethara HRMS

Ethara HRMS is a Django + Django REST Framework backend for:

- admin login using `StackHolder`
- employee creation and management
- employee login
- attendance tracking
- employee time-in and time-out logging
- Django admin management

## Tech Stack

- Python
- Django
- Django REST Framework
- DRF token authentication
- SQLite (default database in this repo)
- `django-cors-headers`
- `django-filter`
- `gunicorn` for deployment

## Repository Structure

```text
Ethara.hrms/
|-- manage.py
|-- requirements.txt
|-- start.sh
|-- db.sqlite3
|-- README.md
|-- hrms/
|   |-- __init__.py
|   |-- asgi.py
|   |-- authentication_user.py
|   |-- settings.py
|   |-- urls.py
|   `-- wsgi.py
|-- employees/
|   |-- __init__.py
|   |-- admin.py
|   |-- apps.py
|   |-- models.py
|   |-- serializer.py
|   |-- tests.py
|   |-- urls.py
|   |-- views.py
|   `-- migrations/
`-- stack_holders/
    |-- __init__.py
    |-- admin.py
    |-- apps.py
    |-- models.py
    |-- serializer.py
    |-- tests.py
    |-- urls.py
    |-- views.py
    `-- migrations/
```

## Main Modules

- `hrms/`: Django project config, URL routing, WSGI/ASGI entry points, shared login serializer
- `employees/`: employee profile, attendance, attendance logs, employee-facing APIs
- `stack_holders/`: admin profile (`StackHolder`) and admin-facing APIs

## Prerequisites

- Python 3.10+ recommended
- `pip`
- Python `venv`
- Git

Current local workspace version:

```bash
Python 3.14.3
```

## Installation and Local Setup

### 1. Clone and enter the project

```bash
git clone <your-repo-url>
cd Ethara.hrms
```

### 2. Create a virtual environment

PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

Command Prompt:

```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

Git Bash / macOS / Linux:

```bash
python -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Run migrations

```bash
python manage.py migrate
python manage.py check
```

### 5. Create a Django superuser

```bash
python manage.py createsuperuser
```

This gives you access to the Django admin panel at:

```text
http://127.0.0.1:8000/admin/
```

### 6. Create the first API admin (`StackHolder`)

There is no API endpoint to create a `StackHolder`. The admin login API only works if:

- a Django `User` exists
- a linked `StackHolder` row exists
- both use the same email address

You can create it in either of these ways.

Using Django admin:

1. Run the server.
2. Open `http://127.0.0.1:8000/admin/`.
3. Create or reuse a Django `User`.
4. Create a `StackHolder` and link it to that user.

Using Django shell:

```python
python manage.py shell
```

```python
from django.contrib.auth.models import User
from stack_holders.models import StackHolder

user = User.objects.create_user(
    username="admin@ethara.ai",
    email="admin@ethara.ai",
    password="Admin@123",
)

StackHolder.objects.create(
    user=user,
    name="HR Admin",
    email="admin@ethara.ai",
    organization="Ethara",
)
```

### 7. Run the project

```bash
python manage.py runserver
```

Local base URL:

```text
http://127.0.0.1:8000
```

## Dependency List

`requirements.txt`

```text
Django==5.0.2
djangorestframework==3.15.2
django-cors-headers==4.4.0
django-filter==25.1
gunicorn==25.1.0
```

## Database

The project currently uses SQLite:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

The repository already contains a `db.sqlite3` file for local development.

## Authentication

The project uses DRF token authentication.

After login, send the token in this header:

```http
Authorization: Token <your-token>
```

### Token Roles

- admin token: used for employee CRUD and attendance creation
- employee token: used for employee attendance listing and time-in/time-out

## Data Model Summary

### StackHolder

Represents an admin user profile.

Fields:

- `id`
- `user`
- `name`
- `email`
- `organization`
- `is_deleted`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

### Employee

Represents an employee profile linked to Django `auth.User`.

Fields:

- `employee_id`
- `user`
- `full_name`
- `email_address`
- `department`
- `is_deleted`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

### Attendance

Represents one attendance record for one employee on one date.

Fields:

- `id`
- `employee`
- `date`
- `status`
- `is_deleted`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

### AttedanceLog

Represents time-in/time-out sessions for a specific attendance record.

Fields:

- `id`
- `employee`
- `time_in`
- `time_out`
- `attendance`
- `is_deleted`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

## API Overview

Base API routes:

- `/api/v1/admin/`
- `/api/v1/employee/`

Main endpoints:

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/admin/login/` | No | Admin login |
| GET | `/api/v1/admin/employees/` | Admin token | List employees |
| POST | `/api/v1/admin/employees/` | Admin token | Create employee |
| GET | `/api/v1/admin/employees/{employee_id}/` | Admin token | Get employee details |
| PUT/PATCH | `/api/v1/admin/employees/{employee_id}/` | Admin token | Update employee |
| DELETE | `/api/v1/admin/employees/{employee_id}/` | Admin token | Delete employee |
| POST | `/api/v1/employee/login/` | No | Employee login |
| PUT/PATCH | `/api/v1/employee/login/{employee_id}/` | No explicit auth on this view | Update employee profile record |
| GET | `/api/v1/employee/attendance/` | Employee or admin token | List attendance |
| GET | `/api/v1/employee/attendance/{id}/` | Employee or admin token | Get attendance detail |
| POST | `/api/v1/employee/attendance/` | Admin token only | Create attendance and logs |
| POST | `/api/v1/employee/time-in` | Employee token | Start work session |
| POST | `/api/v1/employee/time-out` | Employee token | End work session |

DRF router root endpoints also exist:

- `/api/v1/admin/`
- `/api/v1/employee/`

## Detailed API Reference

### 1. Admin Login

Endpoint:

```http
POST /api/v1/admin/login/
```

Request body:

```json
{
  "email": "admin@ethara.ai",
  "password": "Admin@123"
}
```

Success response:

```json
{
  "token": "6b9a8d...",
  "role": "admin",
  "user_data": {
    "id": 1,
    "user": 1,
    "name": "HR Admin",
    "email": "admin@ethara.ai",
    "organization": "Ethara",
    "is_deleted": false,
    "is_active": true,
    "deleted_at": null,
    "created_at": "2026-03-12T10:00:00Z",
    "updated_at": "2026-03-12T10:00:00Z"
  }
}
```

Notes:

- login checks Django `User` by email, then authenticates with password
- the admin user must also have a linked `StackHolder` record

### 2. Admin Employee APIs

#### List Employees

```http
GET /api/v1/admin/employees/
Authorization: Token <admin-token>
```

Supported filters:

- `employee_id`
- `full_name`
- `email_address`
- `department`
- `is_deleted`
- `is_active`
- `deleted_at`
- `created_at`

Example:

```http
GET /api/v1/admin/employees/?department=Engineering
```

#### Create Employee

```http
POST /api/v1/admin/employees/
Authorization: Token <admin-token>
```

Request body:

```json
{
  "full_name": "John Doe",
  "email_address": "john@ethara.ai",
  "department": "Engineering",
  "password": "John@123"
}
```

Behavior:

- creates a Django `auth.User`
- creates an `Employee`
- sets `username = email_address`
- stores the password on the Django `User`

Create response:

```json
{
  "employee_id": 1,
  "full_name": "John Doe",
  "email_address": "john@ethara.ai",
  "department": "Engineering"
}
```

#### Get Employee Details

```http
GET /api/v1/admin/employees/{employee_id}/
Authorization: Token <admin-token>
```

#### Update Employee

```http
PUT /api/v1/admin/employees/{employee_id}/
PATCH /api/v1/admin/employees/{employee_id}/
Authorization: Token <admin-token>
```

Typical patch body:

```json
{
  "full_name": "John D.",
  "department": "Product"
}
```

Important:

- this updates the `Employee` model
- this does not update Django `User.username`, `User.email`, or password

#### Delete Employee

```http
DELETE /api/v1/admin/employees/{employee_id}/
Authorization: Token <admin-token>
```

Current behavior:

- delete is a real delete through DRF default destroy
- it does not perform a soft delete, even though the model has `is_deleted`

### 3. Employee Login

Endpoint:

```http
POST /api/v1/employee/login/
```

Request body:

```json
{
  "email": "john@ethara.ai",
  "password": "John@123"
}
```

Success response:

```json
{
  "token": "f21b31...",
  "role": "employee",
  "user_data": {
    "employee_id": 1,
    "user": 2,
    "full_name": "John Doe",
    "email_address": "john@ethara.ai",
    "department": "Engineering",
    "is_deleted": false,
    "is_active": true,
    "deleted_at": null,
    "created_at": "2026-03-12T10:10:00Z",
    "updated_at": "2026-03-12T10:10:00Z"
  }
}
```

### 4. Employee Profile Update

Endpoint:

```http
PUT /api/v1/employee/login/{employee_id}/
PATCH /api/v1/employee/login/{employee_id}/
```

Example patch body:

```json
{
  "full_name": "John Updated",
  "department": "Operations"
}
```

Notes:

- this route is attached to the same viewset as employee login
- current implementation does not declare token auth on this view
- it updates only the `Employee` record

### 5. Attendance List

Endpoint:

```http
GET /api/v1/employee/attendance/
Authorization: Token <token>
```

Behavior:

- if the token belongs to an admin `StackHolder`, it returns all attendance records
- if the token belongs to an employee, it returns only that employee's records
- records are ordered by latest date first
- the view paginates with page size `30`, but the response is returned as a plain JSON array

Attendance response fields:

- `id`
- `employee`
- `employee_id`
- `employee_name`
- `date`
- `status`
- `today_logs`
- `logs`
- `total_hours_today`
- `total_working_hours`
- `total_working_time`
- `session_count`
- `is_deleted`
- `is_active`
- `deleted_at`
- `created_at`
- `updated_at`

Notes about computed fields:

- `today_logs` and `logs` currently return the same log list
- `total_hours_today`, `total_working_hours`, and `total_working_time` currently return the same value

### 6. Attendance Detail

Endpoint:

```http
GET /api/v1/employee/attendance/{id}/
Authorization: Token <token>
```

Returns a single attendance record using the same serializer fields as the list endpoint.

### 7. Admin Attendance Create

Endpoint:

```http
POST /api/v1/employee/attendance/
Authorization: Token <admin-token>
```

Only admin users can create attendance records through this endpoint.

Supported request fields:

- `employee`
- `employee_id`
- `date`
- `status`
- `time_in`
- `time_out`
- `logs`
- `today_logs`

Example using `employee_id` and `logs`:

```json
{
  "employee_id": 1,
  "date": "2026-03-12",
  "status": "Present",
  "logs": [
    {
      "time_in": "09:00:00",
      "time_out": "13:00:00"
    },
    {
      "time_in": "14:00:00",
      "time_out": "18:00:00"
    }
  ]
}
```

Example using `time_in` and `time_out` directly:

```json
{
  "employee_id": 1,
  "date": "2026-03-12",
  "status": "Present",
  "time_in": "09:30:00",
  "time_out": "18:30:00"
}
```

Validation rules:

- either `employee` or `employee_id` must be provided
- if one of `time_in` or `time_out` is provided, the other is required
- `time_out` must be later than `time_in`
- nested `logs` entries also require `time_out > time_in`

Behavior:

- creates or reuses the attendance record for that employee and date
- updates the attendance status if the record already exists
- creates attendance log rows for each provided time range

### 8. Employee Time-In

Endpoint:

```http
POST /api/v1/employee/time-in
Authorization: Token <employee-token>
```

Request body:

```json
{}
```

Behavior:

- finds the logged-in employee
- creates today's attendance record if it does not already exist
- defaults the attendance status to `Present`
- prevents opening a second active session if one already exists
- records the current server time as `time_in`

Success response shape:

```json
{
  "id": 1,
  "employee": 1,
  "time_in": "09:15:00",
  "time_out": null,
  "attendance": 10,
  "is_deleted": false,
  "is_active": true,
  "deleted_at": null,
  "created_at": "2026-03-12T09:15:00Z",
  "updated_at": "2026-03-12T09:15:00Z"
}
```

### 9. Employee Time-Out

Endpoint:

```http
POST /api/v1/employee/time-out
Authorization: Token <employee-token>
```

Request body:

```json
{}
```

Behavior:

- finds today's attendance record
- finds the latest active log where `time_out` is still empty
- sets `time_out` to the current server time

Success response returns the updated `AttedanceLog` record.

## Example API Flow

### Admin flow

1. Create or link a `StackHolder` to a Django user.
2. `POST /api/v1/admin/login/`
3. Use returned token to create employees.
4. Use returned token to create or inspect attendance.

### Employee flow

1. Admin creates the employee.
2. Employee logs in using `POST /api/v1/employee/login/`
3. Employee calls `POST /api/v1/employee/time-in`
4. Employee calls `POST /api/v1/employee/time-out`
5. Employee checks `GET /api/v1/employee/attendance/`

## cURL Examples

### Admin login

```bash
curl -X POST http://127.0.0.1:8000/api/v1/admin/login/ \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@ethara.ai\",\"password\":\"Admin@123\"}"
```

### Create employee

```bash
curl -X POST http://127.0.0.1:8000/api/v1/admin/employees/ \
  -H "Authorization: Token <admin-token>" \
  -H "Content-Type: application/json" \
  -d "{\"full_name\":\"John Doe\",\"email_address\":\"john@ethara.ai\",\"department\":\"Engineering\",\"password\":\"John@123\"}"
```

### Employee login

```bash
curl -X POST http://127.0.0.1:8000/api/v1/employee/login/ \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@ethara.ai\",\"password\":\"John@123\"}"
```

### Employee time-in

```bash
curl -X POST http://127.0.0.1:8000/api/v1/employee/time-in \
  -H "Authorization: Token <employee-token>" \
  -H "Content-Type: application/json" \
  -d "{}"
```

### Employee time-out

```bash
curl -X POST http://127.0.0.1:8000/api/v1/employee/time-out \
  -H "Authorization: Token <employee-token>" \
  -H "Content-Type: application/json" \
  -d "{}"
```

## Django Admin

Registered models:

- `Employee`
- `Attendance`
- `AttedanceLog`
- `StackHolder`

Admin URL:

```text
http://127.0.0.1:8000/admin/
```

## Railway Deployment

This repository now includes:

- `requirements.txt`
- `start.sh`

### Deploy steps

1. Push the repository to GitHub.
2. Create a Railway project from the repo.
3. If Railway does not auto-detect the start command, set it to:

```bash
bash start.sh
```

4. Deploy the service.

### What `start.sh` does

```bash
#!/usr/bin/env bash
set -e

PORT="${PORT:-8000}"

python manage.py migrate --noinput

if python -c "import gunicorn" >/dev/null 2>&1; then
  exec gunicorn hrms.wsgi:application --bind "0.0.0.0:${PORT}"
fi

exec python manage.py runserver "0.0.0.0:${PORT}"
```

Important deployment note:

- Railway filesystem is not a good long-term home for SQLite data
- for production, use Railway Postgres or another persistent database

## Current Project Notes and Caveats

- `DEBUG = False`
- `ALLOWED_HOSTS = ['*']`
- CORS is open to all origins
- `SECRET_KEY` is currently stored directly in `settings.py`
- the repo uses SQLite by default
- `employees/tests.py` and `stack_holders/tests.py` are placeholders only
- the project has soft-delete style fields, but the employee delete endpoint performs a hard delete
- updating an employee profile does not update Django `User` login credentials

## Useful Commands

```bash
python manage.py migrate
python manage.py makemigrations
python manage.py createsuperuser
python manage.py runserver
python manage.py check
python manage.py shell
```

## Suggested Next Improvements

- move secrets to environment variables
- switch from SQLite to PostgreSQL for production
- add automated tests
- tighten CORS and `ALLOWED_HOSTS`
- make employee/admin registration flows explicit instead of relying on manual setup
