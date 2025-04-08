
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-purple">
              Powerful Link Analytics for Your Business
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Track, analyze, and optimize your links with comprehensive analytics and beautiful visualizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-brand-purple hover:bg-brand-purple-light">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Powerful Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 border rounded-lg bg-card shadow-sm">
                <div className="h-12 w-12 mb-4 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue-light">
                    <path d="m9 9-6 6v4h4l6-6"></path>
                    <path d="m17 5-2 2"></path>
                    <path d="M21 9c0-1.7-1.3-3-3-3-.3 0-.7.1-1 .2l-3.8 3.8c-.2.3-.2.6-.2 1 0 1.7 1.3 3 3 3 .4 0 .7-.1 1-.2l3.8-3.8c.1-.3.2-.7.2-1z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Custom Short Links</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create memorable, branded short links that stand out and boost click-through rates.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg bg-card shadow-sm">
                <div className="h-12 w-12 mb-4 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple">
                    <path d="M3 3v18h18"></path>
                    <path d="m19 9-5 5-4-4-3 3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track clicks, devices, browsers, locations, and more to understand your audience.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg bg-card shadow-sm">
                <div className="h-12 w-12 mb-4 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue-light">
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M8 8v8"></path>
                    <path d="m8 12 4 4"></path>
                    <path d="m16 8-4 4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">QR Code Generation</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Generate QR codes for your short links to bridge digital and print marketing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-brand-blue to-brand-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to supercharge your links?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of marketers and businesses using QLink Analytics to optimize their digital presence.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="bg-white text-brand-purple hover:bg-gray-100">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-brand-blue-light to-brand-purple rounded-md p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-white"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <span className="font-bold text-lg">QLink Analytics</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} QLink Analytics. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
