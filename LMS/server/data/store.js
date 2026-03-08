/**
 * In-memory data store for Books and Members.
 * Acts as a simple database replacement for the LMS backend.
 */

let books = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    publishedYear: 2008,
    status: "available",
    borrowedByMemberId: null,
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    isbn: "978-0201616224",
    publishedYear: 1999,
    status: "borrowed",
    borrowedByMemberId: 1,
  },
  {
    id: 3,
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    isbn: "978-1491950357",
    publishedYear: 2015,
    status: "available",
    borrowedByMemberId: null,
  },
];

let members = [
  {
    id: 1,
    fullName: "Alice Johnson",
    email: "alice@example.com",
    membershipDate: "2024-01-15",
  },
  {
    id: 2,
    fullName: "Bob Smith",
    email: "bob@example.com",
    membershipDate: "2024-03-22",
  },
];

// Counters for auto-incrementing IDs
let nextBookId = 4;
let nextMemberId = 3;

// Mapping: memberId -> [bookId, ...]
const memberBooks = {
  1: [2], // Alice has borrowed book id 2
  2: [],
};

module.exports = {
  books,
  members,
  memberBooks,
  getNextBookId: () => nextBookId++,
  getNextMemberId: () => nextMemberId++,
};
