import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle the form submission here
    setFormSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 3000);
  };

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
            <Link to="/contact" className="text-sm font-medium text-creatively-purple">Contact</Link>
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
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Get in <span className="text-creatively-purple">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Have questions about Creatively? Want to request a demo? We're here to help.
            </p>
          </div>
        </section>

        {/* Contact Information and Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Information */}
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className="bg-creatively-purple/10 p-3 rounded-full">
                          <Mail className="h-6 w-6 text-creatively-purple" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Email Us</h3>
                          <p className="text-muted-foreground mb-2">For general inquiries:</p>
                          <a href="mailto:hello@creatively.com" className="text-creatively-purple hover:underline">
                            hello@creatively.com
                          </a>
                          <p className="text-muted-foreground mt-2 mb-1">For support:</p>
                          <a href="mailto:support@creatively.com" className="text-creatively-purple hover:underline">
                            support@creatively.com
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className="bg-creatively-purple/10 p-3 rounded-full">
                          <Phone className="h-6 w-6 text-creatively-purple" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Call Us</h3>
                          <p className="text-muted-foreground mb-2">Monday to Friday, 9am to 5pm EST</p>
                          <a href="tel:+1-555-123-4567" className="text-creatively-purple hover:underline">
                            +1 (555) 123-4567
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className="bg-creatively-purple/10 p-3 rounded-full">
                          <MapPin className="h-6 w-6 text-creatively-purple" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Visit Us</h3>
                          <p className="text-muted-foreground mb-2">Our headquarters:</p>
                          <address className="not-italic">
                            123 Creative Street<br />
                            Suite 456<br />
                            New York, NY 10001<br />
                            United States
                          </address>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className="bg-creatively-purple/10 p-3 rounded-full">
                          <Clock className="h-6 w-6 text-creatively-purple" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Business Hours</h3>
                          <p className="text-muted-foreground mb-2">We're available:</p>
                          <ul className="space-y-1">
                            <li>Monday - Friday: 9:00 AM - 5:00 PM EST</li>
                            <li>Saturday - Sunday: Closed</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  
                  <Card>
                    <CardContent className="p-6">
                      {formSubmitted ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="bg-green-100 rounded-full p-3 mb-4">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                          <p className="text-muted-foreground text-center max-w-md">
                            Thank you for reaching out. We've received your message and will get back to you as soon as possible.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label htmlFor="firstName" className="text-sm font-medium">
                                First Name <span className="text-red-500">*</span>
                              </label>
                              <Input 
                                id="firstName" 
                                placeholder="Enter your first name" 
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="lastName" className="text-sm font-medium">
                                Last Name <span className="text-red-500">*</span>
                              </label>
                              <Input 
                                id="lastName" 
                                placeholder="Enter your last name" 
                                required 
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label htmlFor="email" className="text-sm font-medium">
                                Email <span className="text-red-500">*</span>
                              </label>
                              <Input 
                                id="email" 
                                type="email" 
                                placeholder="Enter your email" 
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="phone" className="text-sm font-medium">
                                Phone Number
                              </label>
                              <Input 
                                id="phone" 
                                type="tel" 
                                placeholder="Enter your phone number" 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">
                              Subject <span className="text-red-500">*</span>
                            </label>
                            <Select required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="sales">Sales Question</SelectItem>
                                <SelectItem value="support">Technical Support</SelectItem>
                                <SelectItem value="demo">Request a Demo</SelectItem>
                                <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">
                              Message <span className="text-red-500">*</span>
                            </label>
                            <Textarea 
                              id="message" 
                              placeholder="How can we help you?" 
                              rows={6} 
                              required 
                            />
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <input 
                              type="checkbox" 
                              id="privacy" 
                              className="mt-1" 
                              required 
                            />
                            <label htmlFor="privacy" className="text-sm text-muted-foreground">
                              I agree to the <a href="#" className="text-creatively-purple hover:underline">Privacy Policy</a> and consent to Creatively processing my personal data.
                            </label>
                          </div>
                          
                          <Button type="submit" className="w-full md:w-auto">
                            Send Message <MessageSquare className="ml-2 h-4 w-4" />
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-creatively-gray">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">How quickly can I get started with Creatively?</h3>
                    <p className="text-muted-foreground">
                      You can sign up and start using Creatively immediately. Our onboarding process is designed to get you up and running quickly, and you can import your existing projects in just a few clicks.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Do you offer custom plans for larger agencies?</h3>
                    <p className="text-muted-foreground">
                      Yes, we offer custom enterprise plans for larger agencies with specific needs. Contact our sales team to discuss your requirements and get a tailored solution.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Is there a limit to how many projects I can create?</h3>
                    <p className="text-muted-foreground">
                      No, there's no limit to the number of projects you can create on any of our plans. You can manage as many projects as you need.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">How secure is my data on Creatively?</h3>
                    <p className="text-muted-foreground">
                      We take security seriously. All data is encrypted in transit and at rest, and we use industry-standard security practices to protect your information. We also offer two-factor authentication for added security.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Don't see your question here? Check our comprehensive FAQ or contact us directly.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button variant="outline" asChild>
                    <a href="/#faq">View All FAQs</a>
                  </Button>
                  <Button>Contact Support</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Find Us</h2>
              <div className="rounded-xl overflow-hidden h-[400px] bg-gray-200">
                {/* In a real application, you would embed a Google Map or similar here */}
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <p className="text-muted-foreground">Interactive map would be displayed here</p>
                </div>
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