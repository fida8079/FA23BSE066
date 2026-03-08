/**
 * Navbar Component
 * Responsive Bootstrap 5 navigation bar with links to Home, Books, Members.
 */
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                {/* Brand */}
                <NavLink className="navbar-brand fw-bold fs-4" to="/">
                    📚 LibraryMS
                </NavLink>

                {/* Hamburger toggle for mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Nav links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " active fw-semibold" : "")
                                }
                                to="/"
                                end
                            >
                                🏠 Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " active fw-semibold" : "")
                                }
                                to="/books"
                            >
                                📖 Books
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " active fw-semibold" : "")
                                }
                                to="/members"
                            >
                                👥 Members
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
