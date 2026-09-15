# 🎓 UniCore — University Management System

UniCore is a backend-focused **University Management System** designed to manage university academic operations, student enrollment, teachers, courses, class routines, payments, and academic results through a secure REST API.

This project is currently developed as an **MVP (Minimum Viable Product)** with a focus on clean backend architecture, authentication, authorization, relational database design, and real-world business logic.

---

## 🚀 MVP Features

### 🔐 Authentication & Authorization

* User registration & login
* JWT-based authentication
* Access Token & Refresh Token using HTTP cookies
* Password hashing with bcrypt
* Email verification
* Role-based authorization
* Account active/inactive checking

### 👥 User & Role Management

Supported roles:

* `USER`
* `SUPER_ADMIN`
* `ADMIN`
* `DEPARTMENT_HEAD`
* `TEACHER`
* `STUDENT`

---

## 🏢 Department Management

Admin can:

* Create department
* Get all departments
* Get single department
* Update department
* Delete/deactivate department

---

## 👨‍🏫 Teacher Management

Teachers can apply for a teacher profile.

Admin can:

* View all teachers
* Search teachers
* Filter by status
* Filter by department
* Approve teacher
* Reject teacher
* Activate/deactivate teacher

When a teacher is approved, the user's role is automatically updated to:

```text
TEACHER
```

---

## 👨‍🎓 Student Management

Students can apply for a student profile.

Admin can:

* View all students
* Search students
* Filter by status
* Filter by department
* Filter by batch
* Filter by semester
* Approve student
* Reject student
* Activate/deactivate student

When a student is approved:

* Student status becomes `APPROVED`
* User role becomes `STUDENT`
* A unique student ID is generated

Example:

```text
583421
```

---

## 📚 Course Management

The system supports:

* Course creation
* Course information
* Department-based courses
* Course activation/deactivation

Example:

```text
CSE101
Introduction to Programming
Credit: 3
```

---

## 📅 Semester Management

Semester management supports:

* Spring
* Summer
* Fall

Each semester contains:

* Name
* Year
* Start date
* End date
* Active status

---

## 📝 Course Offering

A course can be offered in a specific semester and section.

Features:

* Course offering creation
* Section management
* Capacity management
* Course fee
* Teacher assignment
* Department validation
* Active/inactive status

Example:

```text
Course: CSE101
Semester: Spring 2027
Section: A
Capacity: 40
Fee: 1200 BDT
```

---

## 🎓 Course Enrollment

Students can enroll in available course offerings.

The system handles:

* Student enrollment
* Duplicate enrollment prevention
* Enrollment status
* Course offering relationship
* Enrollment confirmation
* Enrollment cancellation

Supported statuses:

```text
PENDING
CONFIRMED
CANCELLED
```

---

## 💳 Payment

UniCore includes a **bKash Sandbox/Test Payment Flow** for course enrollment.

Payment features:

* Payment creation
* bKash sandbox checkout
* Payment execution
* Callback handling
* Payment status tracking
* Merchant invoice number
* bKash payment ID
* Transaction ID

Supported payment statuses:

```text
UNPAID
PENDING
PAID
FAILED
REFUNDED
CANCELLED
```

> Payment integration currently uses the bKash sandbox/test environment.

---

## 🗓️ Class Routine

The system supports course class scheduling.

Features:

* Create class routine
* View routines
* Update routine
* Soft delete routine
* Room conflict detection
* Teacher schedule conflict detection
* Course teacher validation
* Active/inactive routine

Supported days:

```text
SATURDAY
SUNDAY
MONDAY
TUESDAY
WEDNESDAY
THURSDAY
FRIDAY
```

Example:

```text
Course: CSE101
Day: SATURDAY
Time: 09:00 - 10:30
Room: Room-101
```

---

## 📊 Result & Grade Management

Teachers/Admin can create academic results for confirmed enrollments.

Result includes:

* Marks
* Grade
* Grade Point
* Published status

Supported grades:

```text
A_PLUS
A
A_MINUS
B_PLUS
B
B_MINUS
C_PLUS
C
D
F
```

Students can view their **published results**.

---

# 🔎 Admin Data Management

Admin APIs support:

* Search
* Filtering
* Sorting
* Pagination

Currently implemented for:

```text
Users
Teachers
Students
Enrollments
Results
```

Example:

```http
GET /api/v1/admin/students?search=polok&status=APPROVED&page=1&limit=10
```

---

# 🛠️ Tech Stack

### Backend

* Node.js
* Express.js 5
* TypeScript
* Prisma ORM
* PostgreSQL

### Authentication & Security

* JWT
* bcryptjs
* HTTP Cookies
* Role-Based Access Control

### Caching / Verification

* Redis

### Payment

* bKash Sandbox API

### Development Tools

* tsx
* Git
* GitHub
* Postman

---

# 🏗️ Project Architecture

The backend follows a modular architecture.

```text
src/
│
├── app/
│
├── co
```
