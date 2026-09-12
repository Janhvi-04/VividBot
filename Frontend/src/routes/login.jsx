import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {useState,useEffect} from "react";
import { Sparkles, Phone, Lock } from 'lucide-react';
import { apiFetch } from '../utils/api';
import bgImage from '@/assets/login-bg.png';
import toast from 'react-hot-toast';
export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
    const [step,setStep]=useState(1);
    const [name,setName]=useState("");
    const [identifier,setIdentifier]=useState("");
    const [otp,setOtp]=useState("");
    const [message,setMessage]=useState("");
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();
    
    useEffect(()=>{
      const user=sessionStorage.getItem("user");
      if(user) {
        navigate({to:"/dashboard"})
      }
    },[navigate])
    const handleSendOtp=async(e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        setMessage("");
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(identifier)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            toast.error("Please enter a valid email address.");
            return;
        }
        
        try {
            const response=await apiFetch('/api/auth/send-otp',{
                method:"POST",
                body:JSON.stringify({name,identifier}),
            })
            const data=await response.json();
            if(!response.ok) {
                toast.error(data.error || "Failed to send OTP")
                throw new Error(data.error || "Failed to send OTP.");
            } 
            setMessage(data.message);
            setStep(2);
        } catch (err) {
           setError(err.message)
        } finally {
            setLoading(false);
        }
    };
    const handleVerifyOtp=async(e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        setMessage("");
        try {
            const response=await apiFetch('/api/auth/verify-otp',{
                method:"POST",
                body:JSON.stringify({identifier,otp}),
            })
            const data=await response.json();
            if(!response.ok) {
              throw new Error(data.error || "Invalid OTP.");
            } 
            sessionStorage.setItem("user", JSON.stringify(data.user));
            setMessage("Login successful! Redirecting...");
            navigate({to:"/dashboard"});
        } catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
  return (
    <div 
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 bg-contain bg-center bg-no-repeat bg-[#ffffff]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Form Card Positioned precisely inside the browser window graphic */}
      <div className="relative z-10 w-full max-w-sm mt-1">
        <h2 className="mb-2 text-center font-serif text-2xl font-medium tracking-wide text-gray-800">
          VividBot Access
        </h2>
        <p  className="text-center mb-4 sm:mb-10">Come let's open your mind's window.</p>
        {error && (
          <div className="mb-3 rounded-xl bg-red-100 p-2.5 text-center text-xs font-medium text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-3 rounded-xl bg-emerald-100 p-2.5 text-center text-xs font-medium text-emerald-800">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 text-base placeholder-gray-400 transition focus:border-[#E7CBA0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E7CBA0]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:border-[#E7CBA0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E7CBA0]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#E7CBA0] py-3 text-sm font-semibold tracking-wide text-gray-800 shadow-sm transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Verification OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-center text-xs text-gray-600">
              Enter the 4-digit code sent to{" "}
              <span className="font-semibold text-gray-800">{identifier}</span>
            </p>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Verification OTP
              </label>
              <input
                type="text"
                maxLength="4"
                placeholder="••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-center text-lg tracking-[0.4em] text-gray-800 placeholder-gray-300 transition focus:border-[#E7CBA0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E7CBA0]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#E7CBA0] py-3 text-sm font-semibold tracking-wide text-gray-800 shadow-sm transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs font-semibold uppercase tracking-wider text-gray-500 transition hover:text-gray-800"
            >
              Back to Email Entry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
