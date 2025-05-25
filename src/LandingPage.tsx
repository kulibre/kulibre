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
          <h2>Smart Project Management</h2>
          <p>Create and manage multiple projects with detailed views, progress tracking, and team assignments</p>
        </section>
        
        <section className="feature-card hover-effect">
          <h2>Advanced Task Tracking</h2>
          <p>Organize tasks with custom workflows, priorities, and real-time status updates</p>
        </section>
        
        <section className="feature-card hover-effect">
          <h2>Team Collaboration Hub</h2>
          <p>Invite team members, manage permissions, and collaborate seamlessly on projects</p>
        </section>

        <section className="feature-card hover-effect">
          <h2>Interactive Calendar</h2>
          <p>Plan schedules, set deadlines, and visualize project timelines with our dynamic calendar</p>
        </section>

        <section className="feature-card hover-effect">
          <h2>Secure File Management</h2>
          <p>Upload, organize, and share project files with your team in a secure environment</p>
        </section>

        <section className="feature-card hover-effect">
          <h2>User Settings & Customization</h2>
          <p>Personalize your workspace and manage account preferences for optimal productivity</p>
        </section>
      </main>

      <footer className="landing-footer">
        <button className="cta-button pulse-effect">Get Started</button>
      </footer>
    </div>
  );
};