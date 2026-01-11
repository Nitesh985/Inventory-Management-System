import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
      <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-10 text-center">
        <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">🔒 Security & Trust</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="group relative bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 opacity-0 group-hover:opacity-5 transition-opacity"></div>
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
            <p className="font-bold text-gray-900 text-lg mb-1">Encrypted & Secure</p>
            <p className="text-gray-700 text-sm leading-relaxed font-medium">Military-grade encryption keeps your data safe at rest and in transit.</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 opacity-0 group-hover:opacity-5 transition-opacity"></div>
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="Cloud" size={24} className="text-white" />
            </div>
            <p className="font-bold text-gray-900 text-lg mb-1">Cloud Backup</p>
            <p className="text-gray-700 text-sm leading-relaxed font-medium">Automatic daily backups ensure your business data is always protected.</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 opacity-0 group-hover:opacity-5 transition-opacity"></div>
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon name="ShieldCheck" size={24} className="text-white" />
            </div>
            <p className="font-bold text-gray-900 text-lg mb-1">Privacy First</p>
            <p className="text-gray-700 text-sm leading-relaxed font-medium">Built with privacy & compliance at its core. Your data, your control.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
