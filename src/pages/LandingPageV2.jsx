import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPageV2.css';

const LandingPageV2 = () => {
    return (
        <div className="landing-v2">
            {/* Header / Nav */}
            <nav className="v2-nav">
                <div className="v2-brand">
                    <span>🌿</span> Stride
                </div>
                <div className="v2-nav-items">
                    <Link to="/auth" className="v2-link">Log In</Link>
                    <Link to="/auth" className="v2-btn-primary">Sign Up</Link>
                </div>
            </nav>

            {/* Main Split Hero */}
            <main className="v2-hero">
                {/* Left: Text Content */}
                <div className="v2-hero-text">
                    <div className="v2-badge">
                        <span>Rated 5 ★ on Capterra →</span>
                    </div>

                    <h1 className="v2-title">
                        Build Better Habits,<br />
                        <span className="v2-italic">One Day at a Time.</span>
                    </h1>

                    <p className="v2-subtitle">
                        The simple planner for building better habits.
                        No clutter. Just you and your goals. 🌿
                    </p>

                    <div className="v2-cta-wrapper">
                        <Link to="/auth" className="v2-cta-large">Start Tracking Free</Link>
                        {/* CSS-only decorative arrow could go here */}
                        <span className="v2-try-it-arrow">try it here ⤵</span>
                    </div>

                    <div className="v2-trust-badges">
                        <span>✓ Unlimited habits</span>
                        <span>✓ No credit card required</span>
                    </div>

                    <div className="v2-testimonial">
                        <p>"Stride is an absolute joy to use."</p>
                        <div className="v2-user">
                            <div className="v2-user-avatar"></div>
                            <div className="v2-user-info">
                                <strong>David Zhou</strong>
                                <span>Productive Human</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Visual Content */}
                <div className="v2-hero-visual">
                    {/* Background blob */}
                    <div className="v2-blob"></div>

                    {/* Main Tilted Card */}
                    <div className="v2-main-card">


                        <div className="v2-floating-habits">
                            <div className="v2-floating-badge">
                                <span>🔥</span> 12 Day Streak
                            </div>

                            <div className="v2-habit-pill v2-pill-1">
                                <div className="v2-pill-check checked">✓</div>
                                <div className="v2-pill-content">
                                    <span className="v2-pill-emoji">🏃‍♂️</span>
                                    <span className="v2-pill-label">Morning Run</span>
                                </div>
                            </div>

                            <div className="v2-habit-pill v2-pill-2">
                                <div className="v2-pill-check checked">✓</div>
                                <div className="v2-pill-content">
                                    <span className="v2-pill-emoji">📚</span>
                                    <span className="v2-pill-label">Read 30 mins</span>
                                </div>
                            </div>

                            <div className="v2-habit-pill v2-pill-3">
                                <div className="v2-pill-check"></div>
                                <div className="v2-pill-content">
                                    <span className="v2-pill-emoji">🧘‍♀️</span>
                                    <span className="v2-pill-label">Meditation</span>
                                </div>
                            </div>
                        </div>

                        <Link to="/auth" className="v2-card-btn">Let's Start</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPageV2;
