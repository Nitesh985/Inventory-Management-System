import React from 'react';
import Icon from '../../../components/AppIcon';
import { FeaturesShowcaseProps, FeatureItemProps } from '../types';

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <div className="group relative bg-white border border-gray-200 rounded-lg sm:rounded-2xl p-4 sm:p-6 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg sm:rounded-2xl"></div>
    <div className="relative">
      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:from-blue-500 group-hover:to-blue-600 transition-all">
        <Icon name={icon} size={20} className="text-blue-600 group-hover:text-white transition-colors sm:hidden" />
        <Icon name={icon} size={24} className="text-blue-600 group-hover:text-white transition-colors hidden sm:block" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{title}</h3>
      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{description}</p>
    </div>
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
    <section className={`py-12 sm:py-16 md:py-24 px-3 sm:px-4 bg-gradient-to-b from-white to-blue-50 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-bold mb-4 sm:mb-6 border border-blue-200">
            <span className="text-base mr-2">⚡</span>
            Powerful Features
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-3 sm:mb-4">
            Everything Built For
            <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Your Success
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-medium px-2">
            Complete toolset to manage every aspect of your business in one place.
          </p>
        </div>

        {/* Core Business Features */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8 md:mb-10">
            Core Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {coreFeatures.map((feature, index) => (
              <FeatureItem key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Technical Features */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 text-white">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-8 sm:mb-10 md:mb-12">
            Built for Reliability
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {technicalFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-white/30 transition-all group-hover:scale-110">
                  <Icon name={feature.icon} size={24} className="text-white sm:hidden" />
                  <Icon name={feature.icon} size={32} className="text-white hidden sm:block" />
                </div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;