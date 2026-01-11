import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import type { HeroSectionProps } from "../types";
import logooo from "../../../assets/logooo.png";

const HeroSection = ({ onGetStarted, onTryDemo }: HeroSectionProps) => {
  return (
    <section className="relative py-12 sm:py-20 md:py-32 px-3 sm:px-4 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white">
      {/* Animated background elements - Hidden on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center space-y-8 sm:space-y-10">
          
          {/* Brand Logo with glow effect */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4 animate-fade-in">
            <div className="relative hidden sm:block">
              <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-xl opacity-30"></div>
            </div>
            <img src={logooo} alt="Logo" className="w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20 drop-shadow-lg" />
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent">
              Digital Khata
            </h1>
          </div>

          {/* Hero Headline with better typography */}
          <div className="space-y-4 sm:space-y-5 max-w-4xl mx-auto animate-fade-in-delay">
            <div className="inline-block bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold mx-auto">
              ✨ Smart Business Management
            </div>
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-black leading-tight text-gray-900">
              Manage Your Business
              <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Smarter, Faster, Offline
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto font-medium">
              All-in-one platform for inventory, sales, expenses & AI insights. Works anywhere, anytime.
            </p>
          </div>

          {/* Value Propositions - Mobile optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto pt-2 sm:pt-4 animate-fade-in-delay-2">
            {[
              {
                icon: "WifiOff",
                title: "Works Offline",
                description: "Continue without internet.",
                color: "from-purple-500 to-purple-900"
              },
              {
                icon: "Brain",
                title: "AI Powered",
                description: "Smart insights & forecasting.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: "Shield",
                title: "100% Secure",
                description: "Encrypted & safe data.",
                color: "from-green-500 to-green-600"
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 rounded-xl sm:rounded-2xl transition-opacity`}></div>
                <div className="relative">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${item.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon name={item.icon} size={24} className="text-white sm:hidden" />
                    <Icon name={item.icon} size={28} className="text-white hidden sm:block" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons with mobile optimization */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-stretch sm:items-center pt-4 sm:pt-6 animate-fade-in-delay-3">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-lg sm:rounded-xl font-bold py-3 px-6 sm:px-8 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 text-base sm:text-lg active:scale-95"
            >
              🚀 Get Started Free
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onTryDemo}
              className="w-full sm:w-auto border-2 border-blue-400 text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl font-bold py-3 px-6 sm:px-8 transition-all transform hover:scale-105 text-base sm:text-lg active:scale-95"
            >
              ▶️ Try Demo
            </Button>
          </div>

          {/* Trust Badges - Mobile optimized */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-8 text-xs sm:text-sm text-gray-700 pt-4 sm:pt-6 animate-fade-in-delay-4">
            <div className="flex items-center space-x-1.5 bg-green-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
              <Icon name="CheckCircle" size={16} className="text-green-500 font-bold" />
              <span className="font-semibold">No card</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-blue-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
              <Icon name="Users" size={16} className="text-blue-600 font-bold" />
              <span className="font-semibold">10K+ users</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-yellow-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
              <Icon name="Star" size={16} className="text-yellow-500 font-bold fill-current" />
              <span className="font-semibold">4.9/5</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-3 {
          animation: fadeIn 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-4 {
          animation: fadeIn 0.8s ease-out 0.8s forwards;
          opacity: 0;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
