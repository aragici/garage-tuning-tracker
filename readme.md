# Garage Tuning Tracker 🔧

[cite_start]A web-based full-stack CRUD application developed as a course project for **System Analysis and Design (SAD)**[cite: 1, 4]. [cite_start]It allows users to register, manage vehicles in their garage, and keep a log of installed tuning modifications/parts with real-time dynamic rendering[cite: 7, 30, 32].

---

## 🚀 Features

- [cite_start]**Full CRUD Support**: Create, read, and delete vehicles and structural tuning components[cite: 10, 32].
- **User Isolation**: Secure JWT-based Authentication protects custom garage spaces.
- [cite_start]**RESTful Architecture**: Follows clean REST endpoint routing standards[cite: 8].
- [cite_start]**Single-Page Application**: Implemented strictly with Vanilla HTML5, CSS3 (Neon-Carbon UI), and asynchronous JavaScript (`fetch`)[cite: 9, 25, 36, 37]. [cite_start]No frameworks used[cite: 25, 38].
- [cite_start]**Interactive Documentation**: Integrated fully interactive Swagger UI for instant API exploration[cite: 46, 47].
- **Robustness**: Unit-tested business logic ensuring zero runtime configuration faults.

---

## 🛠️ Tech Stack

- [cite_start]**Frontend**: Vanilla HTML, CSS, JavaScript (Asynchronous API architecture)[cite: 25].
- [cite_start]**Backend**: Node.js, Express.js framework[cite: 26].
- [cite_start]**Data Layer**: SQLite3 (relational local file store)[cite: 27].
- **Testing**: Jest.
- [cite_start]**API Spec**: Swagger UI / OpenAPI 3.0[cite: 46, 47].

---

## 📦 Local Setup Instructions

[cite_start]Follow these exact steps to reproduce and launch the application environment locally[cite: 43, 44]:

### 1. Clone & Project Traversal
Ensure you are operating inside the backend environment directory:
```bash
cd backend