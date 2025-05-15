import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Briefcase, Clock, ArrowRight } from 'lucide-react';

export default function Careers() {
  // Sample job listings
  const jobListings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote (US/Europe)",
      type: "Full-time",
      description: "We're looking for a Senior Frontend Developer to help build and improve our React-based application. You'll work closely with our design and product teams to create intuitive user experiences."
    },
    {
      id: 2,
      title: "UX/UI Designer",
      department: "Design",
      location: "New York, NY",
      type: "Full-time",
      description: "Join our design team to create beautiful, intuitive interfaces for our platform. You'll be responsible for user research, wireframing, prototyping, and working with our development team to implement your designs."
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "Remote (Worldwide)",
      type: "Full-time",
      description: "We're seeking an experienced Product Manager to help shape the future of our platform. You'll work with customers, stakeholders, and our development team to prioritize features and drive product strategy."
    },
    {
      id: 4,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "London, UK",
      type: "Full-time",
      description: "Help our customers get the most out of Creatively. You'll onboard new customers, provide training, and ensure they're successful with our platform."
    },
    {
      id: 5,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote (US/Europe)",
      type: "Full-time",
      description: "Join our marketing team to help spread the word about Creatively. You'll create content, manage social media, and work on campaigns to attract new customers."
    }
  ];

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
            <Link to="/careers" className="text-sm font-medium text-creatively-purple">Careers</Link>
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
              Join Our <span className="text-creatively-purple">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We're building the future of creative project management and we're looking for talented individuals to join us on this journey.
            </p>
            <Button size="lg" className="px-8" asChild>
              <a href="#open-positions">View Open Positions</a>
            </Button>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Why Join Creatively?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-creatively-purple/10 flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-creatively-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Meaningful Work</h3>
                  <p className="text-muted-foreground">
                    Work on a product that helps creative professionals do their best work.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-creatively-purple/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-creatively-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Great Team</h3>
                  <p className="text-muted-foreground">
                    Join a diverse team of talented individuals who are passionate about what they do.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-creatively-purple/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-creatively-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
                  <p className="text-muted-foreground">
                    Develop your skills and grow your career in a supportive environment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-creatively-gray">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Our Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Competitive Compensation</h3>
                  <p className="text-muted-foreground">
                    We offer competitive salaries and equity packages to ensure you're rewarded for your contributions.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Flexible Work</h3>
                  <p className="text-muted-foreground">
                    Work remotely or from our offices with flexible hours to maintain a healthy work-life balance.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Health & Wellness</h3>
                  <p className="text-muted-foreground">
                    Comprehensive health insurance, wellness programs, and mental health support.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Learning & Development</h3>
                  <p className="text-muted-foreground">
                    Budget for courses, conferences, and books to help you grow professionally.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Paid Time Off</h3>
                  <p className="text-muted-foreground">
                    Generous vacation policy, plus paid holidays and sick leave.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Team Events</h3>
                  <p className="text-muted-foreground">
                    Regular team retreats and virtual events to build relationships and have fun together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="open-positions" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>
              
              <div className="space-y-6">
                {jobListings.map(job => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <p className="text-sm text-creatively-purple mt-1">{job.department}</p>
                        </div>
                        <Button variant="outline" className="flex items-center gap-1">
                          Apply <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{job.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No positions that match your skills? */}
              <div className="mt-12 bg-creatively-purple/5 p-8 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-3">Don't see a position that matches your skills?</h3>
                <p className="text-muted-foreground mb-6">
                  We're always looking for talented individuals to join our team. Send us your resume and we'll keep it on file for future opportunities.
                </p>
                <Link to="/contact">
                  <Button>Contact Us</Button>
                </Link>
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

// Missing component definition
const Users = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const Zap = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);