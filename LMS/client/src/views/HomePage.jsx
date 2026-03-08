/**
 * HomePage.jsx — View: Dashboard / Home Page
 * Displays a hero section and live stats (book/member counts) pulled from API.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookService, memberService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
    const [stats, setStats] = useState({ books: 0, members: 0, available: 0, borrowed: 0 });
    const [loading, setLoading] = useState(true);

    // Fetch stats from the API on mount
    useEffect(() => {
        const loadStats = async () => {
            try {
                const [books, members] = await Promise.all([
                    bookService.getAll(),
                    memberService.getAll(),
                ]);
                setStats({
                    books: books.length,
                    members: members.length,
                    available: books.filter((b) => b.status === 'available').length,
                    borrowed: books.filter((b) => b.status === 'borrowed').length,
                });
            } catch {
                // Stats are non-critical; fail silently
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    return (
        <>
            {/* ── Hero Section ── */}
            <section className="lms-hero">
                <div className="container text-center">
                    <div className="mb-3" style={{ fontSize: '4rem' }}>📚</div>
                    <h1>Library Management System</h1>
                    <p className="mt-3 mb-4">
                        Manage your library's books and members with ease using a clean,
                        REST-powered interface.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Link to="/books" className="btn btn-light btn-lg px-5 fw-semibold">
                            📖 Manage Books
                        </Link>
                        <Link to="/members" className="btn btn-outline-light btn-lg px-5 fw-semibold">
                            👥 Manage Members
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Statistics Section ── */}
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center fw-bold mb-4">📊 Library Overview</h2>

                    {loading ? (
                        <LoadingSpinner message="Loading statistics..." />
                    ) : (
                        <div className="row g-4 justify-content-center">
                            {/* Total Books */}
                            <div className="col-sm-6 col-lg-3">
                                <div className="card stat-card h-100 border-0 shadow-sm p-3">
                                    <div className="card-body text-center">
                                        <div style={{ fontSize: '2.5rem' }}>📚</div>
                                        <h3 className="fw-bold text-primary mt-2">{stats.books}</h3>
                                        <p className="text-muted mb-0">Total Books</p>
                                    </div>
                                </div>
                            </div>

                            {/* Available Books */}
                            <div className="col-sm-6 col-lg-3">
                                <div className="card stat-card h-100 border-0 shadow-sm p-3" style={{ borderLeftColor: '#198754 !important' }}>
                                    <div className="card-body text-center">
                                        <div style={{ fontSize: '2.5rem' }}>✅</div>
                                        <h3 className="fw-bold text-success mt-2">{stats.available}</h3>
                                        <p className="text-muted mb-0">Available</p>
                                    </div>
                                </div>
                            </div>

                            {/* Borrowed Books */}
                            <div className="col-sm-6 col-lg-3">
                                <div className="card stat-card h-100 border-0 shadow-sm p-3" style={{ borderLeftColor: '#ffc107 !important' }}>
                                    <div className="card-body text-center">
                                        <div style={{ fontSize: '2.5rem' }}>📤</div>
                                        <h3 className="fw-bold text-warning mt-2">{stats.borrowed}</h3>
                                        <p className="text-muted mb-0">Borrowed</p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Members */}
                            <div className="col-sm-6 col-lg-3">
                                <div className="card stat-card h-100 border-0 shadow-sm p-3" style={{ borderLeftColor: '#dc3545 !important' }}>
                                    <div className="card-body text-center">
                                        <div style={{ fontSize: '2.5rem' }}>👥</div>
                                        <h3 className="fw-bold text-danger mt-2">{stats.members}</h3>
                                        <p className="text-muted mb-0">Members</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── About Section ── */}
            <section className="bg-white py-5 border-top">
                <div className="container">
                    <div className="row align-items-center g-4">
                        <div className="col-md-6">
                            <h2 className="fw-bold">About This System</h2>
                            <p className="text-muted mt-3">
                                This Library Management System is built on a <strong>RESTful API</strong> architecture
                                using Node.js + Express for the backend and React for the frontend.
                            </p>
                            <ul className="list-group list-group-flush mt-3">
                                <li className="list-group-item border-0 ps-0">✅ Full CRUD for Books and Members</li>
                                <li className="list-group-item border-0 ps-0">✅ Hierarchical route: Member's borrowed books</li>
                                <li className="list-group-item border-0 ps-0">✅ MVC architecture with separation of concerns</li>
                                <li className="list-group-item border-0 ps-0">✅ Stateless REST API with proper HTTP methods</li>
                            </ul>
                        </div>
                        <div className="col-md-6 text-center">
                            <div style={{ fontSize: '8rem', lineHeight: 1 }}>🏛️</div>
                            <p className="text-muted mt-2">Academic Library Management System</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
