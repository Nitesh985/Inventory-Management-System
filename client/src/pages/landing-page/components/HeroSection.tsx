import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import { HeroSectionProps } from "../types";

const HeroSection = ({ onGetStarted, onTryDemo }: HeroSectionProps) => {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background"></div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center space-y-10">
          
          {/* Brand Logo */}
          <div className="flex items-center justify-center space-x-3">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <Icon name="Calculator" size={28} className="text-primary-foreground" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground">
              Digital <span className="text-primary">Khata</span>
            </h1>
          </div>

          {/* Hero Headline */}
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight text-foreground">
              Transform Your Business with <br />
              <span className="text-primary">Smart Digital Records</span>
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A complete business management platform with inventory tracking, sales 
              recording, expense management, and AI-powered insights — all with 
              reliable offline-first support.
            </p>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
            {[
              {
                icon: "Wifi",
                title: "Offline-First",
                description: "Use the app without internet and sync when connected.",
              },
              {
                icon: "BarChart3",
                title: "AI Insights",
                description: "Smart trends, forecasts, and automated business reports.",
              },
              {
                icon: "Shield",
                title: "Secure & Private",
                description: "Your business data stays encrypted and protected.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-3 p-6 bg-muted/40 backdrop-blur-sm rounded-xl shadow-sm border border-border/40"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name={item.icon} size={28} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="xl"
              onClick={onGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
              className="w-full sm:w-auto text-lg py-6 px-8"
            >
              Get Started Free
            </Button>

            <Button
              variant="outline"
              size="xl"
              onClick={onTryDemo}
              iconName="Play"
              iconPosition="left"
              className="w-full sm:w-auto text-lg py-6 px-8"
            >
              Try Live Demo
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-base text-muted-foreground pt-6">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={18} className="text-success" />
              <span>No credit card required</span>
            </div>

            <div className="flex items-center space-x-2">
              <Icon name="Users" size={18} className="text-success" />
              <span>10,000+ businesses joined</span>
            </div>

            <div className="flex items-center space-x-2">
              <Icon name="Star" size={18} className="text-success" />
              <span>4.9/5 average rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
