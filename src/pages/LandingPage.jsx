import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-logo">
                    <span>🌿</span> Stride
                </div>
                <div className="nav-links">
                    <Link to="/auth" className="btn-login">Log In</Link>
                    <Link to="/auth" className="btn-cta-small">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Build Better Habits,<br />
                        <span className="highlight-text">One Day at a Time.</span>
                    </h1>
                    <p className="hero-subtitle">
                        The simple planner for building better habits.
                    </p>
                    <div className="hero-actions">
                        <Link to="/auth" className="btn-cta-large">Start Tracking Free</Link>
                        <span className="hero-note">No credit card required</span>
                    </div>
                </div>

                {/* Abstract Visual Representation of "Consistency" */}
                <div className="hero-visual">
                    <div className="visual-card card-1">
                        <div className="check-circle completed">✓</div>
                        <div className="line-placeholder"></div>
                    </div>
                    <div className="visual-card card-2">
                        <div className="check-circle completed">✓</div>
                        <div className="line-placeholder"></div>
                    </div>
                    <div className="visual-card card-3">
                        <div className="check-circle"></div>
                        <div className="line-placeholder"></div>
                    </div>
                    <div className="floating-badge badge-streak">
                        <span className="fire-icon">🔥</span> 12 Day Streak
                    </div>
                </div>
            </header>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <span className="logo-text"><span>🌿</span> Stride</span>
                        <p>Copyright © {new Date().getFullYear()}</p>
                    </div>
                    <div className="footer-links">
                        <Link to="/auth">Sign Up</Link>
                        <Link to="/auth">Log In</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
