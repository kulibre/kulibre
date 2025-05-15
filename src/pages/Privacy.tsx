import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
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
        <section className="py-20 md:py-24 bg-gradient-to-b from-creatively-purple/5 to-white">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-6 bg-creatively-purple/10 w-16 h-16 rounded-full flex items-center justify-center">
              <Shield className="text-creatively-purple w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
              Last updated: July 15, 2024
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <p className="lead">
                At Creatively, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>

              <h2>Information We Collect</h2>
              <p>
                We collect information that you provide directly to us when you register for an account, create or modify your profile, set preferences, or make purchases through the platform. This includes:
              </p>
              <ul>
                <li>Personal information such as your name, email address, and profile picture</li>
                <li>Account credentials such as your password</li>
                <li>Billing information such as your payment method details and billing address</li>
                <li>Profile information such as your job title, company, and preferences</li>
                <li>Content you upload to the platform such as files, comments, and messages</li>
              </ul>

              <p>
                We also collect information automatically when you use our platform, including:
              </p>
              <ul>
                <li>Log information such as your IP address, browser type, operating system, referring webpage, pages visited, and time spent on each page</li>
                <li>Device information such as your device type, operating system, and unique device identifiers</li>
                <li>Usage information such as features you use, actions you take, and time, frequency, and duration of your activities</li>
                <li>Location information such as your general geographic location based on your IP address</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our platform</li>
                <li>Process transactions and send related information including confirmations, invoices, technical notices, updates, security alerts, and support and administrative messages</li>
                <li>Respond to your comments, questions, and requests and provide customer service</li>
                <li>Communicate with you about products, services, offers, promotions, and events, and provide other news or information about us and our partners</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our platform</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect the rights and property of Creatively and others</li>
                <li>Personalize and improve the platform and provide content, features, or advertisements that match your interests and preferences</li>
              </ul>

              <h2>How We Share Your Information</h2>
              <p>
                We may share the information we collect in various ways, including:
              </p>
              <ul>
                <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
                <li>With other users of the platform with whom you choose to share your content and information</li>
                <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process</li>
                <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of Creatively or others</li>
                <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
                <li>With your consent or at your direction</li>
              </ul>

              <h2>Data Retention</h2>
              <p>
                We will retain your information for as long as your account is active or as needed to provide you services, comply with our legal obligations, resolve disputes, and enforce our agreements. When we no longer need to use your information and there is no need for us to keep it to comply with our legal or regulatory obligations, we'll either remove it from our systems or depersonalize it so that we can't identify you.
              </p>

              <h2>Your Rights and Choices</h2>
              <p>
                You have certain rights and choices regarding your information:
              </p>
              <ul>
                <li>Account Information: You may update, correct, or delete your account information at any time by logging into your account or contacting us</li>
                <li>Cookies: Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject cookies</li>
                <li>Promotional Communications: You may opt out of receiving promotional emails from us by following the instructions in those emails. If you opt out, we may still send you non-promotional emails, such as those about your account or our ongoing business relations</li>
                <li>Data Subject Rights: Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, restrict processing, or object to our processing of your information</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no Internet or email transmission is ever fully secure or error-free. In particular, email sent to or from the platform may not be secure. Therefore, you should take special care in deciding what information you send to us via email.
              </p>

              <h2>International Data Transfers</h2>
              <p>
                We are based in the United States and the information we collect is governed by U.S. law. If you are accessing the platform from outside of the U.S., please be aware that information collected through the platform may be transferred to, processed, stored, and used in the U.S. and other jurisdictions. Data protection laws in the U.S. and other jurisdictions may be different from those of your country of residence. Your use of the platform or provision of any information therefore constitutes your consent to the transfer to and from, processing, usage, sharing, and storage of information about you in the U.S. and other jurisdictions as set out in this Privacy Policy.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our platform is not directed to children under the age of 13, and we do not knowingly collect personal information from children under the age of 13. If we learn that we have collected personal information of a child under the age of 13, we will delete such information as quickly as possible. If you believe that we might have any information from or about a child under the age of 13, please contact us.
              </p>

              <h2>Changes to this Privacy Policy</h2>
              <p>
                We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage or sending you a notification). We encourage you to review the Privacy Policy whenever you access the platform to stay informed about our information practices and the ways you can help protect your privacy.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                Creatively, Inc.<br />
                123 Creative Way<br />
                San Francisco, CA 94103<br />
                privacy@creatively.com<br />
                (800) 123-4567
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-creatively-gray">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Have Questions About Our Privacy Practices?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
              Our team is here to help you understand how we protect your data.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="px-8">
                  Contact Us
                </Button>
              </Link>
              <Link to="/security">
                <Button size="lg" variant="outline" className="px-8">
                  View Security Practices
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
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground font-medium">Privacy</Link></li>
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