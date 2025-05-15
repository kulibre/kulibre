import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Server, Database, CheckCircle } from 'lucide-react';

export default function Security() {
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
              Security at Creatively
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We take the security of your data seriously. Learn about our comprehensive approach to protecting your information.
            </p>
          </div>
        </section>

        {/* Security Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Our Security Commitment</h2>
              <p className="text-lg text-muted-foreground mb-8">
                At Creatively, security isn't just a feature—it's foundational to everything we build. We've designed our platform with security in mind from the ground up, implementing industry best practices and advanced technologies to ensure your data remains safe and confidential.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our security program is comprehensive, covering everything from how we develop our software to how we operate our infrastructure and handle your data. We regularly review and update our security measures to address emerging threats and vulnerabilities.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="mb-4 bg-creatively-purple/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Lock className="text-creatively-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Data Protection</h3>
                  <p className="text-muted-foreground">
                    All data is encrypted both in transit and at rest using industry-standard encryption protocols. We implement strict access controls and regularly audit access to sensitive data.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="mb-4 bg-creatively-purple/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Server className="text-creatively-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Infrastructure Security</h3>
                  <p className="text-muted-foreground">
                    Our infrastructure is hosted in secure, SOC 2 compliant data centers with 24/7 monitoring, intrusion detection, and DDoS protection. We perform regular security assessments and penetration testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-16 bg-creatively-gray">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Key Security Features</h2>
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-creatively-purple/10 p-4 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-creatively-purple"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
                    <p className="text-muted-foreground">
                      We support multi-factor authentication (MFA) to add an extra layer of security to your account. Our password policies enforce strong passwords, and we use secure, industry-standard authentication protocols.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-creatively-purple/10 p-4 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-creatively-purple"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Advanced Access Controls</h3>
                    <p className="text-muted-foreground">
                      Our role-based access control system allows you to define precisely who can access what within your organization. You can set permissions at the project, folder, or file level, ensuring that sensitive information is only accessible to authorized users.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-creatively-purple/10 p-4 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="text-creatively-purple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Data Encryption</h3>
                    <p className="text-muted-foreground">
                      All data is encrypted in transit using TLS 1.2+ with strong ciphers. Data at rest is encrypted using AES-256 encryption. We manage encryption keys securely and rotate them regularly according to industry best practices.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-creatively-purple/10 p-4 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-creatively-purple"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Security Monitoring</h3>
                    <p className="text-muted-foreground">
                      Our security team continuously monitors our systems for suspicious activity. We use automated tools to detect and respond to potential security threats in real-time, and we conduct regular security audits and vulnerability assessments.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-creatively-purple/10 p-4 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-creatively-purple"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Business Continuity</h3>
                    <p className="text-muted-foreground">
                      We maintain comprehensive backup systems and disaster recovery procedures to ensure your data is safe even in the event of a system failure. Our infrastructure is designed for high availability with redundancy at multiple levels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Compliance & Certifications</h2>
              <p className="text-lg text-muted-foreground mb-12 text-center">
                We adhere to industry standards and regulations to ensure the highest level of security for your data.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                  <div className="mx-auto mb-4 bg-creatively-purple/10 w-16 h-16 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-creatively-purple w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">SOC 2 Type II</h3>
                  <p className="text-sm text-muted-foreground">
                    Independently verified controls for security, availability, and confidentiality.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                  <div className="mx-auto mb-4 bg-creatively-purple/10 w-16 h-16 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-creatively-purple w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">GDPR Compliant</h3>
                  <p className="text-sm text-muted-foreground">
                    Meeting the requirements of the EU General Data Protection Regulation.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                  <div className="mx-auto mb-4 bg-creatively-purple/10 w-16 h-16 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-creatively-purple w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">ISO 27001</h3>
                  <p className="text-sm text-muted-foreground">
                    Certified information security management system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Best Practices */}
        <section className="py-16 bg-creatively-purple text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Security Best Practices</h2>
              <p className="text-lg mb-12 text-center opacity-90">
                While we implement robust security measures, security is a shared responsibility. Here are some recommendations to help keep your account secure:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">For Administrators</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span>Enforce multi-factor authentication for all users</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span>Regularly review user access and remove unnecessary permissions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span>Implement a strong password policy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span>Monitor account activity for suspicious behavior</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white/10 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">For All Users</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span>Use strong, unique passwords for your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span>Enable multi-factor authentication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span>Be cautious of phishing attempts and suspicious emails</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span>Log out when using shared or public computers</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Reporting */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Report a Security Vulnerability</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
              We appreciate the work of security researchers in improving the security of our platform. If you believe you've found a security vulnerability, please let us know.
            </p>
            <Link to="/contact">
              <Button size="lg" className="px-8">
                Contact Security Team
              </Button>
            </Link>
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
                <li><Link to="/security" className="text-sm text-muted-foreground hover:text-foreground font-medium">Security</Link></li>
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