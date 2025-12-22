
import React from 'react';
import { BookOpen, Monitor, Clock, ShieldCheck, ArrowRight, Library, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-screen bg-dark-950 font-sans text-white overflow-x-hidden relative">
      
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Library size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">LibBook</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="px-5 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={onRegister}
            className="px-5 py-2 text-sm font-bold text-dark-950 bg-primary rounded-lg hover:bg-emerald-400 transition-colors shadow-lg shadow-primary/20"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16 pb-32 lg:pt-32">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-primary text-xs font-semibold mb-8 border border-slate-800 animate-in fade-in slide-in-from-bottom-4 shadow-lg shadow-primary/5">
            <Sparkles size={12} className="text-accent" />
            <span className="text-primary">Smart AI Assistant Included</span>
          </div> */}
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
            The Smartest Way to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-teal-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">Reserve Your Spot.</span>
          </h1>
          
          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Stop searching for empty chairs. Book standard seats, quiet zones, or PC stations instantly and maximize your study time.
          </p>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in zoom-in duration-500 delay-200">
            <button 
              onClick={onRegister}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-primary rounded-full hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5"
            >
              Book Your Seat Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onLogin} 
              className="text-slate-400 font-medium hover:text-white transition-colors px-6 py-4"
            >
              Check Availability
            </button>
          </div>
        </div>

        {/* Background Gradients/Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-yellow-600/10 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-teal-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-dark-900 py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Everything you need to focus</h2>
            <p className="text-slate-400">Our library system is designed to remove the friction from finding a place to study.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <FeatureCard 
               icon={<Monitor className="w-6 h-6 text-teal-400" />}
               bg="bg-teal-900/20"
               borderColor="border-teal-900/50"
               title="PC Stations"
               desc="Access high-performance computers with specialized software for your academic projects."
             />
             <FeatureCard 
               icon={<BookOpen className="w-6 h-6 text-yellow-400" />}
               bg="bg-yellow-900/20"
               borderColor="border-yellow-900/50"
               title="Quiet Zones"
               desc="Guaranteed silence. Perfect for intense focus, exam preparation, and reading."
             />
             <FeatureCard 
               icon={<Clock className="w-6 h-6 text-emerald-400" />}
               bg="bg-emerald-900/20"
               borderColor="border-emerald-900/50"
               title="Real-Time Booking"
               desc="See live availability map. Book up to 3 days in advance and manage cancellations easily."
             />
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-dark-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
             <ShieldCheck size={16} />
             <span>University Authentication Required</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} LibBook System.
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, bg, borderColor, title, desc }: any) => (
  <div className={`group flex flex-col items-start p-8 rounded-2xl bg-dark-950 border border-slate-800 shadow-lg hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300`}>
    <div className={`p-4 rounded-2xl ${bg} ${borderColor} border mb-6 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);
