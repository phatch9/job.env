import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="landing-container">
            <nav className="landing-nav glass-card">
                <div className="logo">
                    <h1>Apply.come</h1>
                </div>
                <div className="nav-links">
                    <Link to="/auth/login" className="btn btn-ghost">Login</Link>
                    <Link to="/auth/register" className="btn btn-primary">Get Started</Link>
                </div>
            </nav>

            <main className="landing-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Track your job search <br />
                        <span className="text-gradient">with clarity</span>
                    </h1>
                    <p className="hero-subtitle">
                        A modern, beautiful way to organize your job applications.
                        Stop using spreadsheets and start using a tool designed for you.
                    </p>
                    <div className="hero-cta">
                        <Link to="/auth/register" className="btn btn-primary btn-xl">
                            Start Tracking Free
                        </Link>
                        <Link to="/auth/login" className="btn btn-secondary btn-xl">
                            View Demo
                        </Link>
                    </div>
                </div>

                <div className="hero-visual glass-card">
                    <div className="mock-card applied">
                        <div className="badge">Applied</div>
                        <h3>Senior Frontend Engineer</h3>
                        <p>Tech Corp Inc.</p>
                    </div>
                    <div className="mock-card interview">
                        <div className="badge">Interview</div>
                        <h3>Product Designer</h3>
                        <p>Creative Studio</p>
                    </div>
                    <div className="mock-card offer">
                        <div className="badge">Offer</div>
                        <h3>Full Stack Developer</h3>
                        <p>StartupAI</p>
                    </div>
                </div>
            </main>

            <style>{`
                .landing-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, hsl(220, 25%, 10%) 0%, hsl(280, 30%, 15%) 100%);
                    color: white;
                    overflow-x: hidden;
                }

                .landing-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 2rem;
                    position: sticky;
                    top: 1rem;
                    margin: 0 1rem;
                    border-radius: 1rem;
                    z-index: 10;
                }

                .landing-nav h1 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, var(--accent-primary, #646cff), var(--accent-secondary, #bc52ee));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .nav-links {
                    display: flex;
                    gap: 1rem;
                }

                .landing-hero {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 8rem 2rem;
                    gap: 4rem;
                }

                @media (min-width: 1024px) {
                    .landing-hero {
                        flex-direction: row;
                        text-align: left;
                        justify-content: space-between;
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                }

                .hero-content {
                    flex: 1;
                    max-width: 600px;
                }

                .hero-title {
                    font-size: 3.5rem;
                    line-height: 1.1;
                    margin-bottom: 1.5rem;
                    font-weight: 800;
                }

                .text-gradient {
                    background: linear-gradient(135deg, var(--accent-primary, #646cff), var(--accent-secondary, #bc52ee));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 2.5rem;
                    line-height: 1.6;
                }

                .hero-cta {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                @media (min-width: 1024px) {
                    .hero-cta {
                        justify-content: flex-start;
                    }
                }

                .btn-xl {
                    padding: 1rem 2rem;
                    font-size: 1.1rem;
                }

                .hero-visual {
                    flex: 1;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    max-width: 400px;
                    transform: rotate(-5deg);
                    transition: transform 0.3s ease;
                }

                .hero-visual:hover {
                    transform: rotate(0deg) scale(1.02);
                }

                .mock-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    padding: 1.5rem;
                    position: relative;
                    backdrop-filter: blur(5px);
                }

                .mock-card h3 {
                    margin: 0.5rem 0 0.25rem;
                    font-size: 1.1rem;
                }

                .mock-card p {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.5);
                }

                .mock-card .badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 1rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }

                .mock-card.applied .badge { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
                .mock-card.interview .badge { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
                .mock-card.offer .badge { background: rgba(16, 185, 129, 0.2); color: #34d399; }
            `}</style>
        </div>
    );
}
