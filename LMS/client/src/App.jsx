/**
 * App.jsx — Root Application Component
 * Sets up React Router routes and the global layout (Navbar + Footer).
 * Each route maps to a full-page View component.
 */
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './views/HomePage';
import BooksPage from './views/BooksPage';
import MembersPage from './views/MembersPage';

const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Persistent navigation bar */}
      <Navbar />

      {/* Main route content */}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/members" element={<MembersPage />} />
          {/* Catch-all: redirect unknown paths to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          📚 LibraryMS &copy; {new Date().getFullYear()} &mdash; Library Management System
        </div>
      </footer>
    </div>
  );
};

export default App;
