import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4 md:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-kulibre-purple rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <h1 className="text-xl font-bold">kulibre</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-kulibre-purple transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-medium text-kulibre-purple">About</Link>
            <Link to="/careers" className="text-sm font-medium hover:text-kulibre-purple transition-colors">Careers</Link>
            <Link to="/blog" className="text-sm font-medium hover:text-kulibre-purple transition-colors">Blog</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-kulibre-purple transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-kulibre-purple/5 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              About <span className="text-kulibre-purple">kulibre</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We're on a mission to transform how creative agencies manage their projects and collaborate with clients.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Our Story</h2>
              <div className="prose prose-lg max-w-none">
                <p>
                  kulibre was founded in 2022 by a team of designers and developers who were frustrated with the existing project management tools that didn't cater to the unique needs of creative agencies.
                </p>
                <p className="mt-4">
                  Having worked in creative agencies ourselves, we understood the challenges of managing multiple projects, collaborating with team members, and presenting work to clients. We saw an opportunity to build a platform specifically designed for creative workflows.
                </p>
                <p className="mt-4">
                  Our platform combines powerful project management capabilities with intuitive design tools, making it easier for creative teams to deliver exceptional work on time and within budget.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-kulibre-gray">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Creativity First</h3>
                  <p className="text-muted-foreground">
                    We believe in putting creativity at the center of everything we do. Our platform is designed to enhance creative work, not hinder it.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Simplicity</h3>
                  <p className="text-muted-foreground">
                    We strive for simplicity in our design and functionality, making our platform intuitive and easy to use.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
                  <p className="text-muted-foreground">
                    We believe that great work happens when teams collaborate effectively. Our platform facilitates seamless collaboration between team members and clients.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Continuous Improvement</h3>
                  <p className="text-muted-foreground">
                    We're committed to continuously improving our platform based on user feedback and emerging trends in the creative industry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Our Leadership Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"
                      alt="CEO"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">Alex Johnson</h3>
                  <p className="text-kulibre-purple">CEO & Co-Founder</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Former design agency director with 15+ years of experience in the creative industry.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"
                      alt="CTO"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">Sarah Chen</h3>
                  <p className="text-kulibre-purple">CTO & Co-Founder</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Tech leader with a background in building scalable software for creative professionals.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"
                      alt="CPO"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">Michael Rodriguez</h3>
                  <p className="text-kulibre-purple">Chief Product Officer</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Product visionary with experience at leading design software companies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-kulibre-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Us on Our Journey</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              We're just getting started, and we'd love for you to be part of our story.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-kulibre-purple">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="/#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Roadmap</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/documentation" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link></li>
                <li><Link to="/tutorials" className="text-sm text-muted-foreground hover:text-foreground">Tutorials</Link></li>
                <li><Link to="/support" className="text-sm text-muted-foreground hover:text-foreground">Support</Link></li>
                <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link></li>
                <li><Link to="/security" className="text-sm text-muted-foreground hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-kulibre-purple rounded-lg w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="font-bold">kulibre</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} kulibre. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}