import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Phone, Mail, Clock, HelpCircle } from 'lucide-react';

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4 md:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-creatively-purple rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <h1 className="text-xl font-bold">Creatively</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-creatively-purple transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-medium hover:text-creatively-purple transition-colors">About</Link>
            <Link to="/careers" className="text-sm font-medium hover:text-creatively-purple transition-colors">Careers</Link>
            <Link to="/blog" className="text-sm font-medium hover:text-creatively-purple transition-colors">Blog</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-creatively-purple transition-colors">Contact</Link>
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
        <section className="py-20 md:py-32 bg-gradient-to-b from-creatively-purple/5 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              <span className="text-creatively-purple">Support Center</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We're here to help you get the most out of Creatively.
            </p>
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search for help..." 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-creatively-purple focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">How Can We Help You?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="mx-auto mb-4 bg-creatively-purple/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <MessageSquare className="text-creatively-purple w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Live Chat</h3>
                <p className="text-muted-foreground mb-6">
                  Chat with our support team in real-time for immediate assistance.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Available 24/7</span>
                </div>
                <Button className="w-full">Start Chat</Button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="mx-auto mb-4 bg-creatively-purple/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Phone className="text-creatively-purple w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Phone Support</h3>
                <p className="text-muted-foreground mb-6">
                  Speak directly with a support specialist for complex issues.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Mon-Fri, 9am-6pm EST</span>
                </div>
                <Button variant="outline" className="w-full">+1 (800) 123-4567</Button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="mx-auto mb-4 bg-creatively-purple/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Mail className="text-creatively-purple w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Email Support</h3>
                <p className="text-muted-foreground mb-6">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Response within 24 hours</span>
                </div>
                <Button variant="outline" className="w-full">support@creatively.com</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Self-Help Resources */}
        <section className="py-16 bg-creatively-gray">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Self-Help Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/documentation" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="bg-creatively-purple/10 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-creatively-purple"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Documentation</h3>
                  <p className="text-muted-foreground">
                    Comprehensive guides and reference materials for all Creatively features.
                  </p>
                </div>
              </Link>

              <Link to="/tutorials" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="bg-creatively-purple/10 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-creatively-purple"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Video Tutorials</h3>
                  <p className="text-muted-foreground">
                    Step-by-step video guides to help you master Creatively.
                  </p>
                </div>
              </Link>

              <Link to="/faq" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="bg-creatively-purple/10 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-creatively-purple"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">FAQ</h3>
                  <p className="text-muted-foreground">
                    Answers to commonly asked questions about using Creatively.
                  </p>
                </div>
              </Link>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="bg-creatively-purple/10 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-creatively-purple"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Community Forum</h3>
                  <p className="text-muted-foreground">
                    Connect with other Creatively users to share tips and get help.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Support Topics */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Popular Support Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-creatively-purple transition-colors">
                <h3 className="font-semibold mb-2">How to invite team members to my project</h3>
                <p className="text-sm text-muted-foreground">Learn how to add new team members and set their permissions.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-creatively-purple transition-colors">
                <h3 className="font-semibold mb-2">Setting up client access and approvals</h3>
                <p className="text-sm text-muted-foreground">Guide to sharing work with clients and collecting feedback.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-creatively-purple transition-colors">
                <h3 className="font-semibold mb-2">Managing project deadlines and milestones</h3>
                <p className="text-sm text-muted-foreground">Tips for keeping your projects on track with our timeline tools.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-creatively-purple transition-colors">
                <h3 className="font-semibold mb-2">Troubleshooting file upload issues</h3>
                <p className="text-sm text-muted-foreground">Solutions for common problems when uploading files.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-creatively-purple transition-colors">
                <h3 className="font-semibold mb-2">Billing and subscription management</h3>
                <p className="text-sm text-muted-foreground">How to update your plan, payment methods, and billing information.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-creatively-purple transition-colors">
                <h3 className="font-semibold mb-2">Exporting and sharing project reports</h3>
                <p className="text-sm text-muted-foreground">Learn how to generate and share reports with stakeholders.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Support */}
        <section className="py-16 bg-creatively-purple text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-4">Enterprise Support</h2>
                <p className="text-xl mb-6 opacity-90">
                  Need dedicated support for your organization? Our enterprise plans include priority support, dedicated account managers, and custom training.
                </p>
                <Button variant="secondary" size="lg">Contact Sales</Button>
              </div>
              <div className="md:w-1/2 bg-white/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Enterprise Support Includes:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>24/7 priority support with guaranteed response times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Custom onboarding and training sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Quarterly business reviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Custom feature development</span>
                  </li>
                </ul>
              </div>
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
              <div className="bg-creatively-purple rounded-lg w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-bold">Creatively</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Creatively. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}