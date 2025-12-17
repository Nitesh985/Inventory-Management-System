import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import FeaturesShowcase from './components/FeaturesShowcase';
import SocialProof from './components/SocialProof';
import CallToAction from './components/CallToAction';
import TrustSignals from './components/TrustSignals';
import Icon from '../../components/AppIcon';
import { Chatbot } from '../../components/Chatbot';

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
    navigate('/register');
  };
  

  const handleTryDemo = () => {
    // For demo purposes, redirect to login with pre-filled credentials
    navigate('/login', { 
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
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Calculator" size={20} className="text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Digital Khata</span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Reviews
              </button>
              <button 
                onClick={() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Security
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleNavigation('/login')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Offline Notice */}
        {!isOnline && (
          <div className="bg-warning text-warning-foreground px-4 py-2 text-center text-sm">
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
      <footer className="bg-muted/20 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Calculator" size={20} className="text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">Digital Khata</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering small businesses with smart digital record-keeping 
                and AI-powered insights for better decision making.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground transition-colors">Features</button></li>
                <li><button className="hover:text-foreground transition-colors">Pricing</button></li>
                <li><button className="hover:text-foreground transition-colors">Demo</button></li>
                <li><button className="hover:text-foreground transition-colors">API</button></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground transition-colors">Help Center</button></li>
                <li><button className="hover:text-foreground transition-colors">Contact Us</button></li>
                <li><button className="hover:text-foreground transition-colors">Training</button></li>
                <li><button className="hover:text-foreground transition-colors">Status</button></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-foreground transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-foreground transition-colors">Security</button></li>
                <li><button className="hover:text-foreground transition-colors">Compliance</button></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 Digital Khata. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} className="text-success" />
                <span>Secure & Trusted</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Zap" size={16} className="text-warning" />
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