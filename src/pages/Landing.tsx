
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Check,
  X,
  DollarSign,
  Zap,
  Calendar,
  Users,
  BarChart2,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

// Custom CSS for floating animations
const floatingLogoStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes floatSlow {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
  }

  .float-animation {
    animation: float 3s ease-in-out infinite;
  }

  .float-animation-slow {
    animation: floatSlow 5s ease-in-out infinite;
  }

  .float-delay-1 {
    animation-delay: 1s;
  }

  .float-delay-2 {
    animation-delay: 2s;
  }

  .float-delay-3 {
    animation-delay: 0.5s;
  }

  .float-delay-4 {
    animation-delay: 1.5s;
  }

  .float-delay-5 {
    animation-delay: 0.7s;
  }
`;

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Add the custom CSS for floating animations */}
      <style dangerouslySetInnerHTML={{ __html: floatingLogoStyles }} />
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4 md:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-kulibre-purple rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <h1 className="text-xl font-bold">kulibre</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-kulibre-purple transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-kulibre-purple transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-medium hover:text-kulibre-purple transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-kulibre-purple transition-colors">Testimonials</a>
            <a href="#faq" className="text-sm font-medium hover:text-kulibre-purple transition-colors">FAQ</a>
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
              Manage Creative Projects <span className="text-kulibre-purple">Seamlessly</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              kulibre helps creative agencies streamline workflows, collaborate effectively, and deliver exceptional results for their clients.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="px-8">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8" asChild>
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent z-10 h-16 bottom-0 top-auto"></div>

              {/* Feature Highlights */}
              <div className="absolute -top-6 left-10 z-20 float-animation-slow hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 border-l-4 border-kulibre-purple">
                  <Calendar className="h-5 w-5 text-kulibre-purple" />
                  <div>
                    <p className="text-sm font-semibold">Project Planning</p>
                    <p className="text-xs text-gray-500">Visualize timelines</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 right-10 z-20 float-animation float-delay-1 hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 border-l-4 border-kulibre-orange">
                  <Users className="h-5 w-5 text-kulibre-orange" />
                  <div>
                    <p className="text-sm font-semibold">Team Collaboration</p>
                    <p className="text-xs text-gray-500">Work together seamlessly</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 left-10 z-20 float-animation-slow float-delay-3 hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 border-l-4 border-creatively-yellow">
                  <Zap className="h-5 w-5 text-creatively-yellow" />
                  <div>
                    <p className="text-sm font-semibold">Automated Workflows</p>
                    <p className="text-xs text-gray-500">Save time with automation</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 right-10 z-20 float-animation float-delay-4 hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 border-l-4 border-creatively-blue">
                  <BarChart2 className="h-5 w-5 text-creatively-blue" />
                  <div>
                    <p className="text-sm font-semibold">Advanced Analytics</p>
                    <p className="text-xs text-gray-500">Data-driven insights</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/3 right-5 z-20 float-animation-slow float-delay-5 hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 border-l-4 border-creatively-pink">
                  <DollarSign className="h-5 w-5 text-creatively-pink" />
                  <div>
                    <p className="text-sm font-semibold">Budget Tracking</p>
                    <p className="text-xs text-gray-500">Monitor project costs</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-5 z-20 float-animation float-delay-2 hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center space-x-2 border-l-4 border-green-500">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold">Client Approvals</p>
                    <p className="text-xs text-gray-500">Streamlined feedback</p>
                  </div>
                </div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=600&q=80"
                alt="Creatively Dashboard"
                className="rounded-lg shadow-2xl border border-gray-200 mx-auto"
              />
            </div>

            {/* Key Benefits */}
            <div className="mt-16 text-center">
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-6">Key Benefits</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="rounded-full bg-creatively-purple/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-creatively-purple" />
                  </div>
                  <h3 className="font-semibold mb-2">Streamlined Workflows</h3>
                  <p className="text-sm text-gray-500">Reduce project delivery time by up to 40% with optimized processes</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="rounded-full bg-creatively-blue/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-creatively-blue" />
                  </div>
                  <h3 className="font-semibold mb-2">Enhanced Collaboration</h3>
                  <p className="text-sm text-gray-500">Keep everyone aligned with real-time updates and communication</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="rounded-full bg-creatively-green/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <BarChart2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Data-Driven Insights</h3>
                  <p className="text-sm text-gray-500">Make informed decisions with comprehensive analytics and reporting</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Features for Creative Teams</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage projects, collaborate with your team, and delight your clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Calendar className="h-10 w-10 text-creatively-purple" />}
                title="Visual Project Planning"
                description="Intuitive Kanban boards and Gantt charts that help you visualize project timelines and dependencies."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-creatively-orange" />}
                title="Team Collaboration"
                description="Real-time communication, file sharing, and task assignment to keep everyone on the same page."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-creatively-yellow" />}
                title="Automated Workflows"
                description="Create custom workflows that automate repetitive tasks and keep projects moving forward."
              />
              <FeatureCard
                icon={<BarChart2 className="h-10 w-10 text-creatively-blue" />}
                title="Advanced Analytics"
                description="Gain insights into team performance, project profitability, and resource allocation."
              />
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10 text-creatively-green" />}
                title="Client Approvals"
                description="Streamline the review and approval process with clients for faster feedback cycles."
              />
              <FeatureCard
                icon={<DollarSign className="h-10 w-10 text-creatively-pink" />}
                title="Budget Tracking"
                description="Monitor project budgets and expenses to keep your projects profitable."
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-kulibre-gray">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How kulibre Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Getting started is simple. Here's how kulibre transforms your creative workflow.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-12">
                <StepItem
                  number="1"
                  title="Set up your workspace"
                  description="Create your team workspace and invite team members to collaborate on projects."
                />
                <StepItem
                  number="2"
                  title="Create your first project"
                  description="Use our templates or start from scratch to set up your project structure."
                />
                <StepItem
                  number="3"
                  title="Assign tasks and track progress"
                  description="Break down projects into manageable tasks and track progress in real-time."
                />
                <StepItem
                  number="4"
                  title="Collaborate and get feedback"
                  description="Share work with clients, collect feedback, and get approvals all in one place."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of creative teams who've transformed their workflow with kulibre.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="kulibre has revolutionized how we manage our design projects. The client approval workflow is a game-changer."
                author="Sarah Johnson"
                role="Creative Director, DesignHub"
              />
              <TestimonialCard
                quote="We've reduced our project turnaround time by 40% since implementing kulibre. The team collaboration features are unmatched."
                author="Michael Chen"
                role="Agency Owner, Pixel Perfect"
              />
              <TestimonialCard
                quote="As a freelancer, kulibre helps me stay organized and professional with my clients. Worth every penny!"
                author="Alex Rodriguez"
                role="Independent Designer"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-kulibre-gray">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that best fits your team's needs. No hidden fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <PricingCard
                title="Free"
                price="$0"
                description="Perfect for individuals and small projects"
                features={[
                  "Up to 5 Projects",
                  "Basic Task Management",
                  "Collaborative Workspace"
                ]}
                unavailable={[
                  "Advanced Analytics",
                  "Priority Support",
                  "Unlimited Projects"
                ]}
                ctaText="Sign Up Free"
                popular={false}
              />
              <PricingCard
                title="Basic"
                price="$9.99/mo"
                description="Great for growing creative teams"
                features={[
                  "Up to 20 Projects",
                  "Advanced Task Management",
                  "Team Collaboration",
                  "Basic Analytics",
                  "Client Portal"
                ]}
                unavailable={[
                  "Enterprise Features",
                  "Priority Support"
                ]}
                ctaText="Start with Basic"
                popular={true}
              />
              <PricingCard
                title="Premium"
                price="$24.99/mo"
                description="For professional agencies and studios"
                features={[
                  "Unlimited Projects",
                  "Advanced Analytics",
                  "Priority Support",
                  "Custom Integrations",
                  "Advanced Team Management",
                  "Resource Allocation",
                  "White-labeling"
                ]}
                unavailable={[]}
                ctaText="Go Premium"
                popular={false}
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does the free plan work?</AccordionTrigger>
                  <AccordionContent>
                    Our free plan gives you access to basic project management features for up to 5 projects.
                    You can create tasks, collaborate with team members, and manage deadlines.
                    There's no time limit on the free plan, use it as long as you like.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I upgrade or downgrade my plan later?</AccordionTrigger>
                  <AccordionContent>
                    Yes! You can upgrade or downgrade your plan at any time.
                    When you upgrade, you'll be prorated for the remainder of your billing cycle.
                    When you downgrade, the changes will take effect at the end of your current billing cycle.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Is there a limit to how many team members I can invite?</AccordionTrigger>
                  <AccordionContent>
                    The Free plan allows up to 3 team members, the Basic plan supports up to 10 team members,
                    and the Premium plan offers unlimited team members. Each team member gets their own login
                    and customized permissions based on their role.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What kind of support do you offer?</AccordionTrigger>
                  <AccordionContent>
                    All plans include community support through our knowledge base and forums.
                    Basic plans include email support with a 48-hour response time.
                    Premium plans include priority email support with a response time of 24 hours
                    and access to live chat during business hours.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can cancel your subscription at any time. When you cancel,
                    you'll continue to have access to your paid features until the end of your billing cycle.
                    After that, your account will revert to the free plan.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-kulibre-purple/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Creative Workflow?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of creative teams who've streamlined their processes with kulibre.
            </p>
            <Link to="/signup">
              <Button size="lg" className="px-8">
                Get Started Free
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required</p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a></li>
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

// Component for feature cards
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <Card className="card-hover h-full">
      <CardContent className="pt-6">
        <div className="mb-5">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

// Component for how it works steps
const StepItem = ({ number, title, description }: { number: string, title: string, description: string }) => {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-creatively-purple text-white rounded-full flex items-center justify-center font-bold text-xl">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

// Component for testimonial cards
const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="mb-4 text-4xl text-creatively-purple/30">"</div>
        <p className="mb-6 italic">{quote}</p>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for pricing cards
const PricingCard = ({
  title,
  price,
  description,
  features,
  unavailable = [],
  ctaText,
  popular
}: {
  title: string,
  price: string,
  description: string,
  features: string[],
  unavailable?: string[],
  ctaText: string,
  popular: boolean
}) => (
  <Card className={`h-full ${
    popular ? 'border-2 border-creatively-purple relative' : ''
  }`}>
    {popular && (
      <div className="absolute top-0 right-0 bg-creatively-purple text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
        Popular
      </div>
    )}
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        {title}
        <DollarSign className="h-5 w-5 text-muted-foreground" />
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="text-3xl font-bold">{price}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
        {unavailable.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <X className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Link to="/signup" className="w-full">
        <Button className={`w-full ${popular ? 'bg-creatively-purple hover:bg-creatively-purple/90' : ''}`}>
          {ctaText}
        </Button>
      </Link>
    </CardFooter>
  </Card>
);
