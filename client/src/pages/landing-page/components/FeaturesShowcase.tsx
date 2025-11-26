import React from 'react';
import Icon from '../../../components/AppIcon';
import { FeaturesShowcaseProps, FeatureItemProps } from '../types';

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <div className="bg-muted/30 rounded-lg p-6 hover:bg-muted/50 transition-colors">
    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
      <Icon name={icon} size={24} className="text-primary" />
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const FeaturesShowcase = ({ className = '' }: FeaturesShowcaseProps) => {
  const coreFeatures = [
    {
      icon: 'Package',
      title: 'Smart Inventory Management',
      description: 'Track stock levels, set low-stock alerts, manage suppliers, and get insights on fast-moving products. Barcode scanning for quick updates.'
    },
    {
      icon: 'TrendingUp',
      title: 'Sales Tracking & Reports',
      description: 'Record daily sales, track customer purchases, generate invoices, and analyze sales trends with beautiful charts and insights.'
    },
    {
      icon: 'Users',
      title: 'Customer Management',
      description: 'Maintain customer profiles, track purchase history, manage credit/debit accounts, and send personalized offers.'
    },
    {
      icon: 'Receipt',
      title: 'Expense Tracking',
      description: 'Record business expenses, categorize spending, track supplier payments, and monitor cash flow with detailed reports.'
    },
    {
      icon: 'Brain',
      title: 'AI-Powered Insights',
      description: 'Get intelligent business recommendations, demand forecasting, profit analysis, and automated financial summaries.'
    },
    {
      icon: 'Smartphone',
      title: 'Mobile-First Design',
      description: 'Optimized for smartphones and tablets with touch-friendly interface, works perfectly on any device size.'
    }
  ];

  const technicalFeatures = [
    {
      icon: 'WifiOff',
      title: 'Offline Capability',
      description: 'Continue working without internet connection. All data is stored locally and syncs automatically when online.'
    },
    {
      icon: 'Cloud',
      title: 'Auto Sync & Backup',
      description: 'Your data is automatically backed up to secure cloud storage and synced across all your devices.'
    },
    {
      icon: 'Zap',
      title: 'Lightning Fast',
      description: 'Optimized performance ensures quick loading times and smooth user experience even with large datasets.'
    }
  ];

  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Icon name="Sparkles" size={16} className="mr-2" />
            Complete Business Solution
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <br />
            <span className="text-primary">Manage Your Business</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From inventory to insights, Digital Khata provides all the tools you need 
            to run your business efficiently and make data-driven decisions.
          </p>
        </div>

        {/* Core Business Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">
            Core Business Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <FeatureItem key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Technical Features */}
        <div className="bg-muted/20 rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">
            Built for Reliability & Performance
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {technicalFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={feature.icon} size={28} className="text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;