import Button from '../../../components/ui/Button';
import type { CallToActionProps } from '../types';

const CallToAction = ({ onGetStarted, onTryDemo, className = '' }: CallToActionProps) => {
  const benefits = [
    '✅ Start in under 5 minutes',
    '✅ No credit card required',
    '✅ Free 30-day trial'
  ];

  return (
    <section className={`py-12 sm:py-16 md:py-24 px-3 sm:px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden ${className}`}>
      {/* Animated background elements - Hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center text-white px-2">
        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight">
          Ready to Transform
          <span className="block text-blue-100 mt-2">Your Business?</span>
        </h2>

        <p className="text-xs sm:text-base md:text-lg text-blue-100 mb-6 sm:mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          Join 10,000+ businesses managing their operations smarter. Start free today.
        </p>

        {/* Benefits List - Responsive */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4 md:gap-6 mb-6 sm:mb-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-xs sm:text-sm md:text-base font-semibold text-blue-50 text-left sm:text-center">
              {benefit}
            </div>
          ))}
        </div>

        {/* CTA Buttons - Mobile optimized */}
        <div className="flex flex-col gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-6 sm:mb-10">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="w-full sm:w-auto bg-white text-blue-700 hover:bg-gray-100 rounded-lg sm:rounded-xl font-black py-3 sm:py-4 px-6 sm:px-10 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-base sm:text-lg active:scale-95"
          >
            🚀 Get Started Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onTryDemo}
            className="w-full sm:w-auto border-2 border-white text-white hover:bg-blue-700 rounded-lg sm:rounded-xl font-bold py-3 sm:py-4 px-6 sm:px-10 transition-all transform hover:scale-105 text-base sm:text-lg active:scale-95"
          >
            ▶️ Try Demo
          </Button>
        </div>

        {/* Trust Indicators */}
        <p className="text-xs sm:text-sm text-blue-100 font-medium">
          No credit card. 30-day free trial. Cancel anytime.
        </p>
      </div>

      <style>{`
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default CallToAction;