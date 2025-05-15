import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Book, Code, FileText, BookOpen } from 'lucide-react';

export default function Documentation() {
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
            <Link to="/about" className="text-sm font-medium hover:text-kulibre-purple transition-colors">About</Link>
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
              <span className="text-kulibre-purple">Documentation</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Everything you need to know about using kulibre to manage your creative projects.
            </p>
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-creatively-purple focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-4 bg-creatively-purple/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Book className="text-creatively-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
                <p className="text-muted-foreground mb-4">
                  Learn the basics of Creatively and set up your first project.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="text-sm">
                    <a href="#" className="text-creatively-purple hover:underline">Platform Overview</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-creatively-purple hover:underline">Creating Your First Project</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-creatively-purple hover:underline">Inviting Team Members</a>
                  </li>
                </ul>
                <a href="#" className="text-sm font-medium text-creatively-purple hover:underline">View all guides →</a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-4 bg-creatively-purple/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Code className="text-creatively-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">API Reference</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed documentation for integrating with our API.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="text-sm">
                    <a href="#" className="text-creatively-purple hover:underline">Authentication</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-creatively-purple hover:underline">Projects API</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-creatively-purple hover:underline">Files API</a>
                  </li>
                </ul>
                <a href="#" className="text-sm font-medium text-creatively-purple hover:underline">View API docs →</a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-4 bg-creatively-purple/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <FileText className="text-creatively-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">User Guides</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive guides for all Creatively features.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="text-sm">
                    <a href="#" className="text-creatively-purple hover:underline">Project Management</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-creatively-purple hover:underline">File Collaboration</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-creatively-purple hover:underline">Client Approvals</a>
                  </li>
                </ul>
                <a href="#" className="text-sm font-medium text-creatively-purple hover:underline">View all guides →</a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-4 bg-creatively-purple/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-creatively-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Best Practices</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to get the most out of Creatively.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="text-sm">
                    <a href="#" className="text-creatively-purple hover:underline">Project Organization</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-creatively-purple hover:underline">Team Collaboration</a>
                  </li>
                  <li className="text-sm">
                    <a href="#" className="text-creatively-purple hover:underline">Client Communication</a>
                  </li>
                </ul>
                <a href="#" className="text-sm font-medium text-creatively-purple hover:underline">View all best practices →</a>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Updates */}
        <section className="py-16 bg-creatively-gray">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Recent Documentation Updates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <span className="text-xs font-medium bg-creatively-purple/10 text-creatively-purple px-2 py-1 rounded-full">New</span>
                <h3 className="text-xl font-semibold mt-3 mb-2">Client Portal Documentation</h3>
                <p className="text-muted-foreground mb-3">
                  Learn how to set up and customize the client portal for your projects.
                </p>
                <p className="text-sm text-muted-foreground">Updated 3 days ago</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Updated</span>
                <h3 className="text-xl font-semibold mt-3 mb-2">Team Permissions Guide</h3>
                <p className="text-muted-foreground mb-3">
                  Updated documentation on managing team roles and permissions.
                </p>
                <p className="text-sm text-muted-foreground">Updated 1 week ago</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-creatively-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Our support team is ready to assist you with any questions you may have.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/support">
                <Button size="lg" variant="secondary" className="px-8">
                  Contact Support
                </Button>
              </Link>
              <Link to="/tutorials">
                <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-creatively-purple">
                  View Tutorials
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