import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

// FAQ Item component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex w-full justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-creatively-purple" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="mt-2 text-muted-foreground">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

// FAQ Category component
const FAQCategory = ({ title, faqs }: { title: string; faqs: { question: string; answer: string }[] }) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="space-y-1">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default function FAQ() {
  // FAQ data organized by category
  const faqData = [
    {
      category: "Getting Started",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "To create an account, click the 'Sign Up' button in the top right corner of our homepage. You'll need to provide your email address, create a password, and fill in some basic information about yourself or your organization."
        },
        {
          question: "Is there a free trial available?",
          answer: "Yes, we offer a 14-day free trial for all new users. You'll have access to all features during this period, and no credit card is required to sign up. At the end of your trial, you can choose a subscription plan that best fits your needs."
        },
        {
          question: "How do I create my first project?",
          answer: "After logging in, navigate to the Dashboard and click the 'New Project' button. You'll be prompted to enter a project name, description, and select a project type. Once created, you can start adding tasks, inviting team members, and uploading files."
        },
        {
          question: "Can I import data from other project management tools?",
          answer: "Yes, Creatively supports importing data from popular project management tools like Asana, Trello, and Jira. Go to Settings > Import Data and follow the instructions for your specific platform."
        }
      ]
    },
    {
      category: "Account & Billing",
      faqs: [
        {
          question: "How do I change my subscription plan?",
          answer: "You can change your subscription plan at any time by going to Settings > Billing > Subscription. From there, you can upgrade, downgrade, or cancel your subscription. Changes to your plan will take effect at the start of your next billing cycle."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) as well as PayPal. For enterprise customers, we also offer invoice-based payment options."
        },
        {
          question: "How do I update my billing information?",
          answer: "To update your billing information, go to Settings > Billing > Payment Methods. From there, you can add, edit, or remove payment methods associated with your account."
        },
        {
          question: "Can I get a refund if I'm not satisfied?",
          answer: "We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied with our service within the first 30 days, contact our support team, and we'll process a full refund."
        }
      ]
    },
    {
      category: "Projects & Collaboration",
      faqs: [
        {
          question: "How do I invite team members to my project?",
          answer: "To invite team members, go to your project, click on the 'Team' tab, and then click 'Invite Members'. Enter the email addresses of the people you want to invite, assign their roles, and click 'Send Invitations'. They'll receive an email with instructions to join your project."
        },
        {
          question: "What's the difference between team members and clients?",
          answer: "Team members have full access to the project based on their assigned role, while clients have limited access. Clients can only view and comment on work that has been specifically shared with them, making it easier to manage client feedback without exposing internal discussions."
        },
        {
          question: "How do I share work with clients for approval?",
          answer: "To share work with clients, go to the file or deliverable you want to share, click the 'Share' button, and select 'Client Review'. You can then choose which client to share with and set permissions for commenting and approval. The client will receive an email notification with a link to view the work."
        },
        {
          question: "Can I control what notifications I receive?",
          answer: "Yes, you can customize your notification preferences in Settings > Notifications. You can choose to receive notifications for specific events like comments, task assignments, deadlines, and approvals. You can also choose to receive notifications via email, in-app, or both."
        }
      ]
    },
    {
      category: "Files & Storage",
      faqs: [
        {
          question: "What file types are supported?",
          answer: "Creatively supports a wide range of file types, including images (JPG, PNG, GIF, SVG), documents (PDF, DOCX, XLSX, PPTX), design files (PSD, AI, XD, Figma), video (MP4, MOV), and audio (MP3, WAV). If you need support for a specific file type, please contact our support team."
        },
        {
          question: "Is there a file size limit?",
          answer: "Yes, the file size limit depends on your subscription plan. Free accounts have a 100MB per file limit, Professional accounts have a 500MB limit, and Enterprise accounts have a 2GB limit. For larger files, we recommend using compression or splitting the file into smaller parts."
        },
        {
          question: "How secure are my files?",
          answer: "All files uploaded to Creatively are encrypted both in transit and at rest. We use industry-standard security measures to protect your data, including regular security audits and compliance with data protection regulations. For more information, please visit our Security page."
        },
        {
          question: "Can I recover deleted files?",
          answer: "Yes, deleted files are moved to the Trash, where they remain for 30 days before being permanently deleted. To recover a deleted file, go to the Trash in the file browser, select the file, and click 'Restore'."
        }
      ]
    },
    {
      category: "Technical Issues",
      faqs: [
        {
          question: "What browsers are supported?",
          answer: "Creatively works best on modern browsers like Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for optimal performance and security."
        },
        {
          question: "Is there a mobile app available?",
          answer: "Yes, we have mobile apps available for both iOS and Android devices. You can download them from the App Store or Google Play Store. The mobile app allows you to view projects, comment on work, and receive notifications on the go."
        },
        {
          question: "What should I do if I encounter a bug?",
          answer: "If you encounter a bug, please report it to our support team by going to Help > Report a Bug. Include as much detail as possible, including steps to reproduce the issue, screenshots, and your browser/device information. Our team will investigate and work to resolve the issue as quickly as possible."
        },
        {
          question: "Is there an API available for custom integrations?",
          answer: "Yes, we offer a RESTful API that allows you to build custom integrations with Creatively. You can find the API documentation in our Developer Portal, along with examples and SDKs for popular programming languages."
        }
      ]
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
              Frequently Asked <span className="text-creatively-purple">Questions</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Find answers to common questions about using Creatively.
            </p>
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search for answers..." 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-creatively-purple focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-4 mb-12 justify-center">
              <Button variant="outline" className="rounded-full">All Questions</Button>
              <Button variant="outline" className="rounded-full">Getting Started</Button>
              <Button variant="outline" className="rounded-full">Account & Billing</Button>
              <Button variant="outline" className="rounded-full">Projects & Collaboration</Button>
              <Button variant="outline" className="rounded-full">Files & Storage</Button>
              <Button variant="outline" className="rounded-full">Technical Issues</Button>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqData.map((category, index) => (
                <FAQCategory key={index} title={category.category} faqs={category.faqs} />
              ))}
            </div>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="py-16 bg-creatively-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
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