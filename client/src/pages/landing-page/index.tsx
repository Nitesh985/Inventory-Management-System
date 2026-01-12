import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import FeaturesShowcase from './components/FeaturesShowcase';
import SocialProof from './components/SocialProof';
import CallToAction from './components/CallToAction';
import TrustSignals from './components/TrustSignals';
import Icon from '../../components/AppIcon';
import { Chatbot } from '../../components/Chatbot';
import logooo from "../../assets/logooo.png";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/sign-up');
  };
  

  const handleTryDemo = () => {
    // For demo purposes, redirect to login with pre-filled credentials
    navigate('/sign-in', { 
      state: { 
        demoMode: true,
        message: 'Try our demo with credentials: admin@digitalkhata.com / admin123' 
      }
    });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 group">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src={logooo} alt="Logo" className="w-10 h-10 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xl font-black text-blue-900 hidden sm:inline">Digital Khata</span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-semibold"
              >
                Features
              </button>
              <button 
                onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-semibold"
              >
                Reviews
              </button>
              <button 
                onClick={() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-semibold"
              >
                Security
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => handleNavigation('/sign-in')}
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-semibold hidden sm:inline"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Offline Notice */}
        {!isOnline && (
          <div className="bg-yellow-50 text-yellow-800 px-4 py-2 text-center text-sm border-t border-yellow-200">
            <Icon name="WifiOff" size={16} className="inline mr-2" />
            You're offline. Some features may be limited.
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection 
          onGetStarted={handleGetStarted}
          onTryDemo={handleTryDemo}
        />

        {/* Features Showcase */}
        <div id="features">
          <FeaturesShowcase />
        </div>

        {/* Social Proof & Testimonials */}
        <div id="testimonials">
          <SocialProof />
        </div>

        {/* Trust Signals & Security */}
        <div id="security">
          <TrustSignals />
        </div>

        {/* Final Call to Action */}
        <CallToAction 
          onGetStarted={handleGetStarted}
          onTryDemo={handleTryDemo}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-blue-950 to-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img src={logooo} alt="Logo" className="w-10 h-10" />
                </div>
                <span className="text-lg font-black">Digital Khata</span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed font-medium">
                Empowering small businesses with smart digital record-keeping 
                and AI-powered insights.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><button className="hover:text-white transition-colors font-medium">Features</button></li>
                <li><button className="hover:text-white transition-colors font-medium">Pricing</button></li>
                <li><button className="hover:text-white transition-colors font-medium">Demo</button></li>
                <li><button className="hover:text-white transition-colors font-medium">API</button></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><button className="hover:text-white transition-colors font-medium">Help Center</button></li>
                <li><button className="hover:text-white transition-colors font-medium">Contact Us</button></li>
                <li><button className="hover:text-white transition-colors font-medium">Training</button></li>
                <li><button className="hover:text-white transition-colors font-medium">Status</button></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><button className="hover:text-white transition-colors font-medium">Privacy Policy</button></li>
                <li><button className="hover:text-white transition-colors font-medium">Terms of Service</button></li>
                <li><button className="hover:text-white transition-colors font-medium">Security</button></li>
                <li><button className="hover:text-white transition-colors font-medium">Compliance</button></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-blue-800 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-blue-200 font-medium">
              © 2024 Digital Khata. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-blue-200 font-medium">
                <Icon name="Shield" size={16} className="text-green-400" />
                <span>Secure & Trusted</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-200 font-medium">
                <Icon name="Zap" size={16} className="text-yellow-400" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot - will appear as floating button */}
      <Chatbot />
    </div>
  );
};

export default LandingPage;