import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';

export default function Blog() {
  // Sample blog posts
  const blogPosts = [
    {
      id: 1,
      title: "5 Ways to Improve Creative Collaboration in Remote Teams",
      excerpt: "Remote work has become the norm for many creative agencies. Learn how to maintain effective collaboration and creativity when your team is distributed.",
      author: "Alex Johnson",
      date: "June 15, 2023",
      readTime: "5 min read",
      category: "Collaboration",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80"
    },
    {
      id: 2,
      title: "The Future of Creative Project Management",
      excerpt: "Explore emerging trends in creative project management and how technology is shaping the way agencies work with clients and deliver projects.",
      author: "Sarah Chen",
      date: "May 28, 2023",
      readTime: "7 min read",
      category: "Industry Trends",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80"
    },
    {
      id: 3,
      title: "How to Create a Client Approval Process That Works",
      excerpt: "A streamlined client approval process can save time, reduce revisions, and improve client satisfaction. Here's how to create one that works for your agency.",
      author: "Michael Rodriguez",
      date: "April 12, 2023",
      readTime: "6 min read",
      category: "Client Management",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80"
    },
    {
      id: 4,
      title: "Balancing Creativity and Productivity in Agency Work",
      excerpt: "Creative work requires time and space, but agencies also need to be productive and profitable. Learn how to strike the right balance.",
      author: "Emma Wilson",
      date: "March 5, 2023",
      readTime: "4 min read",
      category: "Productivity",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80"
    },
    {
      id: 5,
      title: "Building a Strong Agency Culture in a Hybrid Work Environment",
      excerpt: "With some team members in the office and others remote, how do you maintain a strong agency culture? Here are practical strategies that work.",
      author: "David Park",
      date: "February 18, 2023",
      readTime: "8 min read",
      category: "Culture",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80"
    },
    {
      id: 6,
      title: "The ROI of Creative Project Management Software",
      excerpt: "Investing in project management software is a significant decision. Here's how to calculate the ROI and make the case for your agency.",
      author: "Lisa Chen",
      date: "January 30, 2023",
      readTime: "5 min read",
      category: "Business",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80"
    }
  ];

  // Categories for filtering
  const categories = [
    "All",
    "Collaboration",
    "Industry Trends",
    "Client Management",
    "Productivity",
    "Culture",
    "Business"
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
            <Link to="/careers" className="text-sm font-medium hover:text-creatively-purple transition-colors">Careers</Link>
            <Link to="/blog" className="text-sm font-medium text-creatively-purple">Blog</Link>
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
        <section className="py-20 bg-gradient-to-b from-creatively-purple/5 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-center">
                Creatively <span className="text-creatively-purple">Blog</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-center">
                Insights, tips, and stories about creative project management and agency life.
              </p>
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-12">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search articles..." 
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {categories.map((category, index) => (
                    <Button 
                      key={index} 
                      variant={index === 0 ? "default" : "outline"} 
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                  <span className="text-white/80 text-sm mb-2">{blogPosts[0].category}</span>
                  <h2 className="text-3xl font-bold text-white mb-3">{blogPosts[0].title}</h2>
                  <p className="text-white/90 mb-4 max-w-2xl">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{blogPosts[0].date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{blogPosts[0].readTime}</span>
                    </div>
                  </div>
                  <Button className="mt-6 w-fit" size="sm">
                    Read Article <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.slice(1).map(post => (
                  <Card key={post.id} className="overflow-hidden h-full flex flex-col">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <CardContent className="pt-6 flex-grow">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-xs font-medium px-2 py-1 bg-creatively-purple/10 text-creatively-purple rounded-full">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="link" className="p-0 h-auto text-creatively-purple">
                        Read More <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {/* Load More Button */}
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-creatively-purple text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-white/80 mb-8">
                Get the latest articles, resources, and insights about creative project management delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
                />
                <Button variant="secondary">
                  Subscribe
                </Button>
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