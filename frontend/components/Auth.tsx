
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { getStoredUsers, saveUser } from '../services/storage';
import { Library, UserPlus, LogIn, Mail, Lock, User as UserIcon, Hash, Phone, Briefcase, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  mode: 'login' | 'register';
  onSwitchMode: () => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, mode, onSwitchMode, onBack }) => {
  const isLogin = mode === 'login';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
    yearSection: '',
    mobile: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear form errors when mode changes
  useEffect(() => {
    setError('');
  }, [mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address.";
    
    if (formData.password.length < 4) return "Password must be at least 4 characters long.";

    if (!isLogin) {
      if (!formData.name.trim()) return "Full Name is required.";
      if (!formData.studentId.trim()) return "Student ID is required.";
      if (!formData.department) return "Please select a department.";
      
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(formData.mobile)) return "Mobile number must be exactly 10 digits.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Async DB call
      const users = await getStoredUsers();

      if (isLogin) {
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        if (user) {
          if (user.isBlocked) {
            setError('Your account has been blocked by the administrator.');
            setIsLoading(false);
            return;
          }
          onLogin(user);
        } else {
          setError('Invalid credentials. Please try again.');
          setIsLoading(false);
        }
      } else {
        if (users.find(u => u.email === formData.email)) {
          setError('An account with this email already exists.');
          setIsLoading(false);
          return;
        }
        
        const newUser: User = {
          id: `user-${Date.now()}`,
          role: UserRole.STUDENT,
          isBlocked: false,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          studentId: formData.studentId,
          department: formData.department,
          yearSection: formData.yearSection,
          mobile: formData.mobile
        };
        
        await saveUser(newUser);
        onLogin(newUser);
      }
    } catch (err) {
      setError("Connection error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4 font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="w-full max-w-5xl z-20 absolute top-6 left-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-dark-900/50 px-4 py-2 rounded-full border border-slate-800 hover:bg-dark-900"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>

      <div className="bg-dark-900 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:min-h-[600px] animate-in fade-in zoom-in-95 duration-500 border border-slate-800 z-10">
        
        {/* Left Side */}
        <div className="md:w-5/12 bg-gradient-to-br from-emerald-600 to-teal-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-black opacity-30 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                 <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md shadow-inner border border-white/20">
                    <Library className="w-6 h-6" />
                 </div>
                 <span className="text-2xl font-bold tracking-tight">LibBook</span>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  {isLogin ? "Welcome back, Scholar!" : "Join the Library Community"}
                </h2>
                <p className="text-emerald-50 text-base leading-relaxed">
                  {isLogin 
                    ? "Access your dashboard to manage seat reservations, view history, and find the perfect spot for your study session."
                    : "Create an account to start booking seats, PC stations, and quiet zones instantly. It takes less than a minute."}
                </p>
              </div>
           </div>
           
           <div className="relative z-10 mt-12 pt-8 border-t border-white/20">
              <div className="flex gap-6 text-xs font-medium text-emerald-50">
                 {/* <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div> 
                   System Online
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-white"></div> 
                   MongoDB Ready
                 </div> */}
              </div>
           </div>
        </div>

        {/* Right Side */}
        <div className="md:w-7/12 p-8 md:p-12 bg-dark-900 flex flex-col justify-center relative">
          
          <div className="max-w-md mx-auto w-full">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white">{isLogin ? 'Sign In' : 'Create Account'}</h3>
                <p className="text-slate-400 text-sm mt-1">
                  {isLogin ? "Please enter your details." : "Fill in the information below."}
                </p>
              </div>
              
              <button 
                onClick={onSwitchMode}
                className="text-sm font-semibold text-primary hover:text-emerald-400 transition-colors flex items-center group"
              >
                {isLogin ? 'Register instead' : 'Login instead'}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 text-red-400 text-sm rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="bg-red-900/50 p-1 rounded-full flex-shrink-0 mt-0.5"><span className="block w-1.5 h-1.5 bg-red-400 rounded-full"></span></div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <UserIcon className="absolute left-3 top-3 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input required name="name" type="text" placeholder="Full Name" onChange={handleChange} 
                        className="w-full pl-10 pr-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-white text-sm" />
                    </div>
                    <div className="relative group">
                      <Hash className="absolute left-3 top-3 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input required name="studentId" type="text" placeholder="Student ID" onChange={handleChange} 
                        className="w-full pl-10 pr-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-white text-sm" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                       <Briefcase className="absolute left-3 top-3 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                       <select required name="department" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-slate-400 text-sm appearance-none cursor-pointer">
                        <option value="">Select Dept...</option>
                        <option value="CS">Comp. Sci</option>
                        <option value="EE">Electrical</option>
                        <option value="ME">Mechanical</option>
                        <option value="BA">Business</option>
                      </select>
                    </div>
                    <div className="relative group">
                      <div className="absolute left-3 top-3 text-slate-500 group-focus-within:text-primary font-bold text-xs pt-0.5">YR</div>
                      <input required name="yearSection" type="text" placeholder="Year/Sec (e.g. 3-A)" onChange={handleChange} 
                        className="w-full pl-10 pr-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-white text-sm" />
                    </div>
                  </div>

                  <div className="relative group">
                    <Phone className="absolute left-3 top-3 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input required name="mobile" type="tel" placeholder="Mobile Number (10 digits)" onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-white text-sm" />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <input required name="email" type="email" placeholder="Email Address" onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-white text-sm" />
                </div>
                
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <input required name="password" type="password" placeholder="Password (min 4 chars)" onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-white text-sm" />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3 bg-primary hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                     isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Create Account</>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500 bg-dark-950 py-2 px-4 rounded-full inline-block border border-slate-800">
                <span className="font-semibold text-slate-400">Admin Demo:</span> admin@library.edu / admin
                <br></br>
                <span className="font-semibold text-slate-400">Student Demo:</span> john@student.edu / pass
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
