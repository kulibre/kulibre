import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Clock, Filter, ChevronRight } from 'lucide-react';

export default function Tutorials() {
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
              <span className="text-creatively-purple">Video Tutorials</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Learn how to use Creatively with our step-by-step video tutorials.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="rounded-full">Getting Started</Button>
              <Button variant="outline" className="rounded-full">Project Management</Button>
              <Button variant="outline" className="rounded-full">File Collaboration</Button>
              <Button variant="outline" className="rounded-full">Client Management</Button>
              <Button variant="outline" className="rounded-full">Advanced Features</Button>
            </div>
          </div>
        </section>

        {/* Featured Tutorials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Featured Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=340&q=80" 
                    alt="Getting Started Tutorial" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="rounded-full">
                      <Play className="w-4 h-4 mr-2" /> Watch Now
                    </Button>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> 5:32
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium bg-creatively-purple/10 text-creatively-purple px-2 py-1 rounded-full">Beginner</span>
                  <h3 className="text-lg font-semibold mt-2 mb-1">Getting Started with Creatively</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn the basics of setting up your account and creating your first project.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Updated 2 weeks ago</span>
                    <a href="#" className="text-xs font-medium text-creatively-purple hover:underline flex items-center">
                      Watch <ChevronRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=340&q=80" 
                    alt="Project Management Tutorial" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="rounded-full">
                      <Play className="w-4 h-4 mr-2" /> Watch Now
                    </Button>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> 8:15
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Intermediate</span>
                  <h3 className="text-lg font-semibold mt-2 mb-1">Advanced Project Management</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn how to manage complex projects with multiple team members and deadlines.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Updated 1 month ago</span>
                    <a href="#" className="text-xs font-medium text-creatively-purple hover:underline flex items-center">
                      Watch <ChevronRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=340&q=80" 
                    alt="Client Collaboration Tutorial" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="rounded-full">
                      <Play className="w-4 h-4 mr-2" /> Watch Now
                    </Button>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> 6:47
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium bg-creatively-purple/10 text-creatively-purple px-2 py-1 rounded-full">Beginner</span>
                  <h3 className="text-lg font-semibold mt-2 mb-1">Client Collaboration Tools</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn how to share work with clients and collect feedback efficiently.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Updated 3 weeks ago</span>
                    <a href="#" className="text-xs font-medium text-creatively-purple hover:underline flex items-center">
                      Watch <ChevronRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tutorial Categories */}
        <section className="py-16 bg-creatively-gray">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">All Tutorials</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="w-4 h-4" /> Filter
                </Button>
                <select className="border border-gray-200 rounded-md px-3 py-1 text-sm bg-white">
                  <option>Most Recent</option>
                  <option>Most Popular</option>
                  <option>Beginner</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative md:w-64 h-36">
                    <img 
                      src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80" 
                      alt="File Management Tutorial" 
                      className="w-full h-full object-cover rounded-md"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> 7:22
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium bg-creatively-purple/10 text-creatively-purple px-2 py-1 rounded-full">Beginner</span>
                      <span className="text-xs text-muted-foreground">Updated 1 week ago</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">File Management and Organization</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Learn how to organize your files and folders for maximum efficiency and collaboration.
                    </p>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Play className="w-4 h-4 mr-2" /> Watch Tutorial
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative md:w-64 h-36">
                    <img 
                      src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80" 
                      alt="Team Collaboration Tutorial" 
                      className="w-full h-full object-cover rounded-md"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> 9:15
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Intermediate</span>
                      <span className="text-xs text-muted-foreground">Updated 2 weeks ago</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Team Collaboration Best Practices</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Discover the best ways to collaborate with your team members and streamline your workflow.
                    </p>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Play className="w-4 h-4 mr-2" /> Watch Tutorial
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative md:w-64 h-36">
                    <img 
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80" 
                      alt="Reporting Tutorial" 
                      className="w-full h-full object-cover rounded-md"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> 11:03
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Advanced</span>
                      <span className="text-xs text-muted-foreground">Updated 3 weeks ago</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Advanced Reporting and Analytics</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Learn how to use Creatively's reporting tools to track project progress and team performance.
                    </p>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Play className="w-4 h-4 mr-2" /> Watch Tutorial
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline">Load More Tutorials</Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-creatively-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Our support team is ready to help you with any questions you may have.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/support">
                <Button size="lg" variant="secondary" className="px-8">
                  Contact Support
                </Button>
              </Link>
              <Link to="/documentation">
                <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-creatively-purple">
                  View Documentation
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