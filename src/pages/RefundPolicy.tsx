import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Receipt } from 'lucide-react';
import Footer from '@/components/ui/footer';

export default function RefundPolicy() {
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
        <section className="py-20 md:py-24 bg-gradient-to-b from-kulibre-purple/5 to-white">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-6 bg-kulibre-purple/10 w-16 h-16 rounded-full flex items-center justify-center">
              <Receipt className="text-kulibre-purple w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Refund Policy
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
              Last updated: July 15, 2024
            </p>
          </div>
        </section>

        {/* Refund Policy Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <p className="lead">
                This Refund Policy outlines the terms and conditions for refunds at kulibre. Please read this policy carefully to understand your rights and options regarding refunds for our services.
              </p>

              <h2>Consumer Right to Cancel</h2>
              <p>
                If you are a Consumer and unless the below exception applies, you have the right to cancel this Agreement and return the Product within 14 days without giving any reason. The cancellation period will expire after 14 days from the day after completion of the Transaction. To meet the cancellation deadline, it is sufficient that you send us your communication concerning your exercise of the cancellation right before the expiration of the 14 day period.
              </p>

              <p>
                To cancel your order, you must inform us of your decision. To ensure immediate processing, please do so by contacting us through our support channels. Please note that in respect of subscription services your right to cancel is only present following the initial subscription and not upon each automatic renewal.
              </p>

              <p>
                You also have the right to inform us using the model cancellation form below or by making any other clear, unambiguous statement through our available communication channels. If you use our "Contact Us" form online, we will communicate acknowledgment of receipt of your cancellation request to you without delay.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 my-6">
                <h3 className="text-lg font-semibold mb-4">Model Cancellation Form</h3>
                <p className="italic mb-4">To kulibre, Customer Support Team</p>
                <p className="mb-2">I hereby give notice that I cancel my contract of sale of the following Products</p>
                <p className="mb-2">Ordered on [DATE]</p>
                <p className="mb-2">Name of consumer(s),</p>
                <p className="mb-2">Address of consumer(s),</p>
                <p className="mb-2">Signature of consumer(s) (only if this form is notified on paper),</p>
                <p>Date</p>
              </div>

              <h2>Effect of Cancellation</h2>
              <p>
                If you cancel this Agreement as permitted above, we will reimburse to you all payments received from you.
              </p>

              <p>
                We will make the reimbursement without undue delay, and not later than 14 days after the day on which we are informed about your decision to cancel this Agreement.
              </p>

              <p>
                We will make the reimbursement using the same means of payment as you used for the initial transaction and you will not incur any fees as a result of the reimbursement.
              </p>

              <h2>Exception to the Right to Cancel</h2>
              <p>
                Your right as a Consumer to cancel your order does not apply to the supply of Digital Content that you have started to download, stream or otherwise acquire and to Products which you have had the benefit of.
              </p>

              <h2>Refund Policy</h2>
              <p>
                Refunds are provided at the sole discretion of kulibre and on a case-by-case basis and may be refused. We will refuse a refund request if we find evidence of fraud, refund abuse, or other manipulative behavior that entitles us to counterclaim the refund.
              </p>

              <p>
                This does not affect your rights as a Consumer in relation to Products which are not as described, faulty or not fit for purpose.
              </p>

              <h2>Payment by Wire Transfer</h2>
              <p>
                It's your responsibility to provide us with the correct payment details (your unique bank transfer reference number), Company VAT / sales tax code and order information to avoid delays in your order fulfillment, as we may be unable to reconcile or refund such transactions. Orders, where payments are made via wire transfer, are not protected under the CCA (Consumer Credit Act) and are therefore not eligible for a refund. However, in cases where the transaction amount, including sales tax or where the sales tax refund is above $ / £ / €100, you may be entitled to a refund including the sales tax you paid, at our discretion.
              </p>

              <h2>Indirect Sales Tax Refund Policy</h2>
              <p>
                If you've been charged sales tax on your purchase and are registered for sales tax in the country of purchase, you may be entitled to a refund of the sales tax amount if permitted by the laws applicable in such country. Sales taxes include VAT, GST, Consumption Tax and others as applicable from time to time. For wire transfers, please refer to the Wire Transfer section above for more information regarding eligibility of sales tax refunds.
              </p>

              <p>
                You must contact us within 60 days after completing the purchase to be eligible for a sales tax refund. This refund will only be processed upon the provision of a valid sales tax code for your country.
              </p>

              <p>
                All refund requests received after 60 days from the date of the Transaction will not be processed.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about our Refund Policy, please contact us:
              </p>
              <ul>
                <li>Email: kulibre@gmail.com</li>
                <li>Phone: 92 3243037082</li>
                <li>Address: L-377, Sector-4, North Karachi</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-kulibre-gray">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Have Questions About Our Refund Policy?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
              Our team is here to help you understand our refund process.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="px-8">
                  Contact Us
                </Button>
              </Link>
              <Link to="/faq">
                <Button size="lg" variant="outline" className="px-8">
                  View FAQ
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
