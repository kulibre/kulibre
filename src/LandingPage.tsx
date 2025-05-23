import React from 'react';
import './LandingPage.css';

export const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1 className="gradient-text">kulibre</h1>
        <p className="subtitle">Streamline your creative workflow</p>
      </header>

      <main className="landing-main">
        <section className="feature-card hover-effect">
          <h2>Project Management</h2>
          <p>Organize projects with intuitive boards and detailed project views</p>
        </section>
        
        <section className="feature-card hover-effect">
          <h2>Task Tracking</h2>
          <p>Create, assign, and monitor tasks with customizable workflows</p>
        </section>
        
        <section className="feature-card hover-effect">
          <h2>Team Collaboration</h2>
          <p>Connect your team members and streamline communication</p>
        </section>

        <section className="feature-card hover-effect">
          <h2>Calendar Integration</h2>
          <p>Visualize project timelines and manage deadlines effectively</p>
        </section>

        <section className="feature-card hover-effect">
          <h2>File Storage</h2>
          <p>Centralize project files and documents in one secure location</p>
        </section>

        <section className="feature-card hover-effect">
          <h2>Customizable Dashboard</h2>
          <p>Get a comprehensive overview of all your projects and tasks</p>
        </section>
      </main>

      <footer className="landing-footer">
        <button className="cta-button pulse-effect">Get Started</button>
      </footer>
    </div>
  );
};