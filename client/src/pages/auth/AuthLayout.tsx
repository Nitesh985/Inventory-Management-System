import { Helmet } from "react-helmet";
import { Outlet } from 'react-router-dom'


export default function AuthLayout() {
  return (
    <>
      {/* @ts-ignore */}
      <Helmet>
        <title>
          Create Account - Digital Khata | Business Management Platform
        </title>
        <meta
          name="description"
          content="Join Digital Khata and transform your business with our comprehensive ERP solution. Create your account to start managing inventory, sales, and expenses with offline-first capabilities."
        />
        <meta
          name="keywords"
          content="business registration, ERP signup, inventory management, digital transformation"
        />
        <meta property="og:title" content="Create Account - Digital Khata" />
        <meta
          property="og:description"
          content="Start your digital business transformation journey with Digital Khata's comprehensive management platform."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-50 relative overflow-hidden flex flex-col">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top right orb */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-b from-blue-300 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>

          {/* Bottom left orb */}
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-gradient-to-t from-blue-400 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          {/* Center orb */}
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-200 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>

          {/* Floating particles effect */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-float"></div>
          <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-40 animate-float animation-delay-1000"></div>
          <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-blue-300 rounded-full opacity-25 animate-float animation-delay-2000"></div>
        </div>

        {/* Main Content */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-16">
          <div className="w-full max-w-2xl mx-auto">
            <div className="flex flex-col items-center justify-center">
              {/* Form Card */}
              <div className="w-full bg-gradient-to-br from-white to-blue-50 rounded-3xl border border-gray-200 shadow-2xl hover:shadow-3xl p-8 sm:p-10 hover:-translate-y-1 transition-all duration-500 overflow-visible relative">
                {/* Header */}
                <div className="text-center mb-10 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
                    <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Create Your Account
                    </h2>
                    <div className="h-1 w-12 bg-gradient-to-l from-blue-600 to-blue-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-lg mx-auto">
                    Join thousands of businesses managing their operations with
                    Digital Khata
                  </p>
                </div>

                <Outlet />
              </div>
            </div>
          </div>
        </main>
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

          @keyframes blob {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0.25;
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
              opacity: 0.3;
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
              opacity: 0.2;
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-20px) translateX(10px);
              opacity: 0.6;
            }
          }
          
          .animate-in {
            animation: fadeIn 0.5s ease-out forwards;
          }

          .animate-blob {
            animation: blob 7s infinite;
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          .animation-delay-1000 {
            animation-delay: 1s;
          }

          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
}
