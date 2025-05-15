import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Terms() {
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
              <FileText className="text-creatively-purple w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
              Last updated: July 15, 2024
            </p>
          </div>
        </section>

        {/* Terms of Service Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <p className="lead">
                Welcome to Creatively. Please read these Terms of Service ("Terms") carefully as they contain important information about your legal rights, remedies, and obligations. By accessing or using the Creatively platform, you agree to comply with and be bound by these Terms.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By registering for and/or using the Service in any manner, you agree to these Terms and all other operating rules, policies, and procedures that may be published by Creatively from time to time. These Terms apply to all visitors, users, and others who access the Service.
              </p>

              <h2>2. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
              </p>

              <h2>3. Eligibility</h2>
              <p>
                You must be at least 18 years old to use the Service. By agreeing to these Terms, you represent and warrant that:
              </p>
              <ul>
                <li>You are at least 18 years of age</li>
                <li>You have the legal capacity to enter into a binding agreement with us</li>
                <li>Your use of the Service does not violate any applicable law or regulation</li>
              </ul>
              <p>
                If you are using the Service on behalf of a company, organization, or other entity, you represent and warrant that you have the authority to bind that entity to these Terms, in which case "you" will refer to that entity.
              </p>

              <h2>4. Account Registration and Security</h2>
              <p>
                To use certain features of the Service, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security. We cannot and will not be liable for any loss or damage arising from your failure to comply with the above requirements.
              </p>

              <h2>5. Subscription and Payments</h2>
              <p>
                Some aspects of the Service may be provided for a fee. You agree to pay all fees in accordance with the fees, charges, and billing terms in effect at the time a fee is due and payable. You must provide us with a valid credit card or other payment method information. By providing your payment information, you authorize us to charge all fees to that payment method.
              </p>
              <p>
                All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities, and you shall be responsible for payment of all such taxes, levies, or duties.
              </p>
              <p>
                You may cancel your subscription at any time, but no refunds will be provided for any unused portion of a subscription period. We reserve the right to change our pricing terms at any time, and such changes will be posted on our website.
              </p>

              <h2>6. User Content</h2>
              <p>
                Our Service allows you to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material ("User Content"). You are responsible for the User Content that you post on or through the Service, including its legality, reliability, and appropriateness.
              </p>
              <p>
                By posting User Content on or through the Service, you represent and warrant that:
              </p>
              <ul>
                <li>The User Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms</li>
                <li>The posting of your User Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person</li>
              </ul>
              <p>
                You retain any and all of your rights to any User Content you submit, post, or display on or through the Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for User Content you or any third party posts on or through the Service.
              </p>

              <h2>7. Intellectual Property Rights</h2>
              <p>
                The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Creatively and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Creatively.
              </p>

              <h2>8. Prohibited Uses</h2>
              <p>
                You agree not to use the Service:
              </p>
              <ul>
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation</li>
                <li>To impersonate or attempt to impersonate Creatively, a Creatively employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm Creatively or users of the Service or expose them to liability</li>
              </ul>

              <h2>9. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p>
                If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>

              <h2>10. Limitation of Liability</h2>
              <p>
                In no event shall Creatively, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul>
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
              <p>
                Whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
              </p>

              <h2>11. Disclaimer</h2>
              <p>
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
              </p>
              <p>
                Creatively, its subsidiaries, affiliates, and its licensors do not warrant that:
              </p>
              <ul>
                <li>The Service will function uninterrupted, secure, or available at any particular time or location</li>
                <li>Any errors or defects will be corrected</li>
                <li>The Service is free of viruses or other harmful components</li>
                <li>The results of using the Service will meet your requirements</li>
              </ul>

              <h2>12. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>

              <h2>13. Dispute Resolution</h2>
              <p>
                Any disputes arising out of or related to these Terms or the Service shall be resolved through binding arbitration in San Francisco, California, in accordance with the rules of the American Arbitration Association. The decision of the arbitrator shall be final and binding, and judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction thereof.
              </p>

              <h2>14. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                Creatively, Inc.<br />
                123 Creative Way<br />
                San Francisco, CA 94103<br />
                legal@creatively.com<br />
                (800) 123-4567
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-creatively-gray">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Have Questions About Our Terms?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
              Our team is here to help you understand our terms of service.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="px-8">
                  Contact Us
                </Button>
              </Link>
              <Link to="/privacy">
                <Button size="lg" variant="outline" className="px-8">
                  View Privacy Policy
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
                <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground font-medium">Terms</Link></li>
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