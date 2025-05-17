import React from 'react';
import './LandingPage.css';

export const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1 className="gradient-text">kulibre</h1>
        <p className="subtitle">Manage creative projects seamlessly</p>
      </header>

      <main className="landing-main">
        <section className="feature-card hover-effect">
          <h2>Collaborate</h2>
          <p>Work together with your team in real-time</p>
        </section>
        
        <section className="feature-card hover-effect">
          <h2>Organize</h2>
          <p>Keep all your projects neatly structured</p>
        </section>
        
        <section className="feature-card hover-effect">
          <h2>Create</h2>
          <p>Bring your ideas to life with powerful tools</p>
        </section>
      </main>

      <footer className="landing-footer">
        <button className="cta-button pulse-effect">Get Started</button>
      </footer>
    </div>
  );
};