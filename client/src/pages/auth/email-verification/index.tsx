import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { useNavigate } from "react-router-dom";
// import { useFetch } from "@/hooks/useFetch";
// import { getVerificationCode, verifyOtpCode } from "@/api/users";
import axios from "axios";
// import { sendVerificationCode } from "@/api/users";
// import { useMutation } from "@/hooks/useMutation";

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [resendTimer, setResendTimer] = useState(60);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [verifyCodeLoading, setVerifyCodeLoading] = useState(false);
  // const {mutate:sendVerifyCode, loading:sendCodeLoading} = useMutation<any, void>(sendVerificationCode)
  // const {mutate:mutateVerifyCode, loading:verifyCodeLoading, data:verifyCodeRes} = useMutation(verifyOtpCode)

  // const resendEmail = async () => {
  //   await refetch()
  //   setResendTimer(120)
  // }

  // Handle resend countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  
  const sendVerifyCode = async () => {
    const res = await axios.post("/api/users/send-verification-code")
    if (res.data.success){
      alert("Check your email for the code")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      setIsLoading(true);
      try {
        const verifyCodeRes = await axios.post("/api/users/verify-code", {
          inputCode: code,
        });
        // await mutateVerifyCode({inputCode:code})
        // console.log(verifyCodeRes)
        const verified = verifyCodeRes?.data?.success;
        if (verified) {
          alert("Congratulations! You were successfully verified!");
          navigate("/inventory-management");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header with Icon */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="relative inline-block mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full blur-2xl opacity-40 animate-pulse"></div>
          <div className="absolute inset-2 bg-gradient-to-r from-blue-300 to-blue-200 rounded-full blur-lg opacity-20"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-4 ring-blue-200/50">
            <Icon name="Mail" size={32} className="text-white drop-shadow-lg" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Verify Your Email
          </h3>
          <p className="text-sm text-gray-600 max-w-xs mx-auto font-medium leading-relaxed">
            We've sent a 6-digit verification code to your email address. Please
            enter it below.
          </p>
        </div>
      </div>

      {/* Verification Code Input */}
      <div
        className="space-y-4 animate-fade-in-delay"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Verification Code
          </label>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300"></div>
            <Input
              placeholder="000000"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="relative text-center text-3xl tracking-[0.5em] font-mono font-bold py-4 px-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg transition-all bg-white/80 hover:bg-white hover:border-gray-300"
              required
              disabled={sendCodeLoading}
              autoFocus
              maxLength={6}
            />
          </div>
        </div>

        {/* Resend Timer */}
        <div className="flex justify-center pt-2">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-600 font-medium">
              Resend code in{" "}
              <span className="font-bold text-blue-600 animate-pulse">
                {resendTimer}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
              onClick={sendVerifyCode}
            >
              Didn't receive a code? Resend now
            </button>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={code.length !== 6 || isLoading}
        loading={isLoading}
        className="py-3 text-base font-bold bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:opacity-60 disabled:shadow-md relative overflow-hidden group animate-fade-in-delay"
        style={{ animationDelay: "0.2s" }}
      >
        <span className="relative z-10 flex items-center justify-center">
          {verifyCodeLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Verifying...
            </>
          ) : (
            "Verify Account"
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Button>

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
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </form>
  );
};

export default EmailVerification;
