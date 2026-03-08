# 📚 Library Management System (LMS)


<img width="1919" height="949" alt="Screenshot 2026-03-08 120020" src="https://github.com/user-attachments/assets/8bbadd83-3b47-4b1c-be2d-4810b9740da4" />
<img width="1919" height="902" alt="Screenshot 2026-03-08 120042" src="https://github.com/user-attachments/assets/076c1e39-7505-4f4a-ba7a-aef14e075e95" />
<img width="1919" height="944" alt="Screenshot 2026-03-08 120059" src="https://github.com/user-attachments/assets/aeef2bcb-c7f8-4e07-9d44-97b1a130342b" />
<img width="1919" height="884" alt="Screenshot 2026-03-08 120129" src="https://github.com/user-attachments/assets/6a632fc5-1b59-4f27-9f83-b353ce95635c" />



> A full-stack Library Management System built with **React** (frontend) + **Node.js/Express** (backend), following **MVC architecture** and **RESTful API** principles.

---

## 🗂️ Project Structure

```
LMS/
├── client/                         # React Frontend (Vite)
│   └── src/
│       ├── models/                 # Frontend data models (mirror backend schema)
│       │   ├── Book.js             # Book model with defaultValues
│       │   └── Member.js           # Member model with defaultValues
│       ├── views/                  # Page-level View components (MVC Views)
│       │   ├── HomePage.jsx        # Dashboard with live stats
│       │   ├── BooksPage.jsx       # CRUD view for Books
│       │   └── MembersPage.jsx     # CRUD view for Members
│       ├── controllers/            # Custom hooks acting as MVC Controllers
│       │   ├── useBooks.js         # Book state + API operations
│       │   └── useMembers.js       # Member state + API operations
│       ├── services/               # API Service Layer (Axios)
│       │   └── api.js              # Centralized HTTP calls
│       ├── components/             # Reusable UI Components
│       │   ├── Navbar.jsx          # Bootstrap 5 responsive navbar
│       │   ├── BookCard.jsx        # Bootstrap card for a single book
│       │   ├── BookForm.jsx        # Reusable create/edit form for books
│       │   ├── MemberRow.jsx       # Table row for a single member
│       │   ├── MemberForm.jsx      # Reusable create/edit form for members
│       │   ├── FormField.jsx       # Reusable input / select field
│       │   ├── AlertMessage.jsx    # Bootstrap dismissible alert
│       │   ├── ConfirmModal.jsx    # Bootstrap delete confirmation modal
│       │   └── LoadingSpinner.jsx  # Bootstrap loading spinner
│       ├── App.jsx                 # Router + global layout
│       └── main.jsx                # Entry point (Bootstrap imported here)
│
└── server/                         # Node.js + Express Backend
    ├── models/
    │   ├── Book.js                 # Book class with validation
    │   └── Member.js               # Member class with validation
    ├── controllers/
    │   ├── bookController.js       # Business logic for Books API
    │   └── memberController.js     # Business logic for Members API
    ├── routes/
    │   ├── books.js                # Book REST routes
    │   └── members.js              # Member REST routes
    ├── data/
    │   └── store.js                # In-memory data store (seed data)
    └── server.js                   # Express entry point
```

---

## 🚀 Project Setup

### Prerequisites
- Node.js (v18+)
- npm

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Start the Backend Server

```bash
npm run dev       # with nodemon (auto-reload)
# OR
npm start         # without nodemon
```

> Backend runs at: `http://localhost:5000`

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

### 4. Start the Frontend Dev Server

```bash
npm run dev
```

> Frontend runs at: `http://localhost:5173`

---

## 📡 REST API Endpoints

### Books — `/books`

| Method   | Endpoint       | Description                   | Idempotent |
|----------|----------------|-------------------------------|------------|
| `GET`    | `/books`       | Retrieve all books            | ✅ Yes     |
| `GET`    | `/books/:id`   | Retrieve a book by ID         | ✅ Yes     |
| `POST`   | `/books`       | Create a new book             | ❌ No      |
| `PUT`    | `/books/:id`   | Fully update a book           | ✅ Yes     |
| `DELETE` | `/books/:id`   | Delete a book                 | ✅ Yes     |

### Members — `/members`

| Method   | Endpoint                    | Description                         | Idempotent |
|----------|-----------------------------|-------------------------------------|------------|
| `GET`    | `/members`                  | Retrieve all members                | ✅ Yes     |
| `GET`    | `/members/:id`              | Retrieve a member by ID             | ✅ Yes     |
| `POST`   | `/members`                  | Create a new member                 | ❌ No      |
| `PUT`    | `/members/:id`              | Fully update a member               | ✅ Yes     |
| `DELETE` | `/members/:id`              | Delete a member                     | ✅ Yes     |
| `GET`    | `/members/:memberId/books`  | Get books borrowed by a member      | ✅ Yes     |

---

## 🔗 HTTP Method Mapping Explanation

| HTTP Method | Purpose              | Usage in LMS                           |
|-------------|----------------------|----------------------------------------|
| `GET`       | Read / Retrieve      | Fetch all or one book/member           |
| `POST`      | Create               | Add a new book or register a member    |
| `PUT`       | Update (replace)     | Update all fields of a book/member     |
| `DELETE`    | Delete               | Remove a book or member by ID          |

**Key REST rules followed:**
- ✅ URIs use **plural nouns** only (`/books`, `/members`) — no verbs like `/getBook`
- ✅ HTTP methods convey the **action**, not the URI
- ✅ Proper **status codes**: `200`, `201`, `204`, `400`, `404`, `409`, `500`
- ✅ **Hierarchical route**: `GET /members/:memberId/books` follows REST nesting convention

---

## 🔄 Statelessness

This API is **stateless** as per REST principles:

> Every request from a client contains **all the information** the server needs to process it. The server does **not store any client session** between requests.

**How it is implemented:**
- No sessions or cookies on the server side
- Each API request includes the resource ID in the URL (e.g., `/books/2`)
- The request body contains all data needed for `POST`/`PUT` operations
- Authentication headers (if added later) would be sent with **every** request — not stored as a session

---

## ✅ Idempotent Methods

An operation is **idempotent** if calling it multiple times produces the **same result** as calling it once.

| Method   | Idempotent | Explanation                                                         |
|----------|------------|---------------------------------------------------------------------|
| `GET`    | ✅ Yes     | Reading data does not change server state                           |
| `PUT`    | ✅ Yes     | Replacing a resource with the same data yields the same result      |
| `DELETE` | ✅ Yes     | Deleting an already-deleted resource still results in "not found"   |
| `POST`   | ❌ No      | Each call creates a **new** resource with a new ID                  |

---

## 🏗️ MVC Architecture

| MVC Layer  | Frontend                              | Backend                          |
|------------|---------------------------------------|----------------------------------|
| **Model**  | `src/models/Book.js`, `Member.js`     | `server/models/Book.js`, `Member.js` |
| **View**   | `src/views/BooksPage.jsx`, etc.       | JSON responses (REST resources)  |
| **Controller** | `src/controllers/useBooks.js`, `useMembers.js` | `server/controllers/bookController.js`, `memberController.js` |

---

## 📦 Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React 19 + Vite             |
| Routing   | React Router DOM v7         |
| Styling   | Bootstrap 5.3               |
| HTTP      | Axios                       |
| Backend   | Node.js + Express           |
| Database  | In-memory array (store.js)  |
| Dev Tool  | Nodemon                     |

---

## 📝 Book Schema

```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "978-0132350884",
  "publishedYear": 2008,
  "status": "available"
}
```

## 📝 Member Schema

```json
{
  "id": 1,
  "fullName": "Alice Johnson",
  "email": "alice@example.com",
  "membershipDate": "2024-01-15"
}
```

---

*Built for undergraduate-level academic evaluation — demonstrating RESTful architecture, MVC separation, Bootstrap integration, and full-stack JavaScript development.*
