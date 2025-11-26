import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { CallToActionProps } from '../types';

const CallToAction = ({ onGetStarted, onTryDemo, className = '' }: CallToActionProps) => {
  const benefits = [
    'Start managing your business in under 5 minutes',
    'No technical knowledge required',
    'Free migration from existing systems',
    '30-day money-back guarantee'
  ];

  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Main CTA Container */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-primary rounded-full"></div>
            <div className="absolute top-8 right-8 w-6 h-6 bg-primary rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-4 h-4 bg-primary/50 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-primary/50 rounded-full"></div>
          </div>

          <div className="relative">
            {/* Urgency Badge */}
            <div className="inline-flex items-center bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Icon name="Clock" size={16} className="mr-2" />
              Limited Time: Free Setup & Migration
            </div>

            {/* Headline */}
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
              Ready to Transform
              <br />
              <span className="text-primary">Your Business Today?</span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful businesses using Digital Khata. 
              Start your free trial and see the difference in your first week.
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 text-left">
                  <Icon name="CheckCircle" size={18} className="text-success flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="xl"
                onClick={onGetStarted}
                iconName="ArrowRight"
                iconPosition="right"
                className="w-full sm:w-auto text-lg px-8 py-4 h-auto"
              >
                Start Free Trial Now
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={onTryDemo}
                iconName="Play"
                iconPosition="left"
                className="w-full sm:w-auto text-lg px-8 py-4 h-auto"
              >
                Watch Demo Video
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="CreditCard" size={16} className="text-muted-foreground" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-muted-foreground" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            Need help getting started? Our team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="Phone" size={16} />
              <span>Call us: +91 9999-XXX-XXX</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="Mail" size={16} />
              <span>Email: support@digitalkhata.com</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="MessageCircle" size={16} />
              <span>Live chat available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;