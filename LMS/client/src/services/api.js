/**
 * API Service Layer
 * Centralizes all HTTP communication with the backend REST API.
 * All functions use async/await and return data or throw errors.
 */
import axios from "axios";

// Base URL for the backend API
const API_BASE = "http://localhost:5000";

// ─── Books ────────────────────────────────────────────────────────────────────
export const bookService = {
    getAll: () => axios.get(`${API_BASE}/books`).then((r) => r.data),
    getById: (id) => axios.get(`${API_BASE}/books/${id}`).then((r) => r.data),
    create: (data) => axios.post(`${API_BASE}/books`, data).then((r) => r.data),
    update: (id, data) => axios.put(`${API_BASE}/books/${id}`, data).then((r) => r.data),
    delete: (id) => axios.delete(`${API_BASE}/books/${id}`),
};

// ─── Members ──────────────────────────────────────────────────────────────────
export const memberService = {
    getAll: () => axios.get(`${API_BASE}/members`).then((r) => r.data),
    getById: (id) => axios.get(`${API_BASE}/members/${id}`).then((r) => r.data),
    create: (data) => axios.post(`${API_BASE}/members`, data).then((r) => r.data),
    update: (id, data) => axios.put(`${API_BASE}/members/${id}`, data).then((r) => r.data),
    delete: (id) => axios.delete(`${API_BASE}/members/${id}`),
    getMemberBooks: (memberId) =>
        axios.get(`${API_BASE}/members/${memberId}/books`).then((r) => r.data),
    borrowBook: (memberId, bookId) =>
        axios.post(`${API_BASE}/members/${memberId}/books/${bookId}`).then((r) => r.data),
    returnBook: (memberId, bookId) =>
        axios.delete(`${API_BASE}/members/${memberId}/books/${bookId}`).then((r) => r.data),
};
