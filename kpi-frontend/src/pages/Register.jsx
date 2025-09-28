import { useState, useEffect } from "react";

export default function Register() {
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Password strength calculator
  useEffect(() => {
    let strength = 0;
    if (form.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(form.password)) strength += 1;
    if (/[a-z]/.test(form.password)) strength += 1;
    if (/[0-9]/.test(form.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) strength += 1;
    setPasswordStrength(strength);
  }, [form.password]);

  const handleSubmit = async () => {
    // Validation checks
    if (!agreedToTerms) {
      alert("Please accept the terms and conditions");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    if (passwordStrength < 3) {
      alert("Password is too weak. Please use a stronger password.");
      return;
    }

    if (!form.username || !form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Registration successful
        if (data.token) {
          // Store token if provided
          // Note: localStorage not available in artifacts, would work in real environment
          alert("Registration successful! 🎉 Welcome aboard!");
          // Redirect to login or dashboard
          window.location.href = "/login";
        } else {
          alert("Registration successful! Please login with your credentials.");
          window.location.href = "/login";
        }
      } else {
        // Handle server errors
        alert(data.message || data.msg || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Server error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "from-red-400 to-red-600";
    if (passwordStrength <= 2) return "from-orange-400 to-orange-600";
    if (passwordStrength <= 3) return "from-yellow-400 to-yellow-600";
    if (passwordStrength <= 4) return "from-blue-400 to-blue-600";
    return "from-green-400 to-green-600";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Very Weak";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    if (passwordStrength <= 4) return "Good";
    return "Strong";
  };

  const FloatingParticle = ({ delay, duration, size, left, top }) => (
    <div
      className={`absolute w-${size} h-${size} bg-white/20 rounded-full animate-pulse`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-800">
        {/* Animated mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-transparent to-blue-600/30 animate-pulse" />
        
        {/* Floating particles */}
        {mounted && (
          <>
            <FloatingParticle delay={0} duration={7} size={2} left={15} top={25} />
            <FloatingParticle delay={1} duration={9} size={1} left={85} top={15} />
            <FloatingParticle delay={2} duration={6} size={3} left={65} top={75} />
            <FloatingParticle delay={3} duration={8} size={2} left={25} top={85} />
            <FloatingParticle delay={4} duration={10} size={1} left={95} top={65} />
            <FloatingParticle delay={5} duration={11} size={2} left={45} top={35} />
            <FloatingParticle delay={6} duration={7} size={1} left={75} top={45} />
          </>
        )}

        {/* Geometric shapes */}
        <div className="absolute top-32 left-16 w-24 h-24 border border-white/20 rotate-45 animate-spin opacity-30" style={{ animationDuration: '25s' }} />
        <div className="absolute bottom-32 right-16 w-20 h-20 border-2 border-white/10 rounded-full animate-bounce opacity-40" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-r from-purple-400/20 to-pink-500/20 transform rotate-12 animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-28 h-28 border border-white/10 transform rotate-12 animate-pulse opacity-20" style={{ animationDuration: '6s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <div className={`
          bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-white/20
          transform transition-all duration-1000 ease-out
          ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}
        `}>
          {/* Logo/Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl mb-4 shadow-lg animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-300">Join us today and start your journey</p>
          </div>

          <div className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-gray-200 font-medium">Username</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="
                    w-full px-4 py-3 pl-11 bg-white/10 border border-white/20 rounded-xl 
                    text-white placeholder-gray-400 backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                    transition-all duration-300 ease-out
                    group-hover:bg-white/15
                  "
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-gray-200 font-medium">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="
                    w-full px-4 py-3 pl-11 bg-white/10 border border-white/20 rounded-xl 
                    text-white placeholder-gray-400 backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                    transition-all duration-300 ease-out
                    group-hover:bg-white/15
                  "
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-gray-200 font-medium">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="
                    w-full px-4 py-3 pl-11 pr-12 bg-white/10 border border-white/20 rounded-xl 
                    text-white placeholder-gray-400 backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                    transition-all duration-300 ease-out
                    group-hover:bg-white/15
                  "
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-.588-.686m5.832 5.832l-.684-.588M14.121 14.121L15.536 15.536M14.121 14.121l.588.686M18.536 9.464L17.122 8.05M14.709 14.709L13.293 13.293" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              
              {/* Password Strength Indicator */}
              {form.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Password Strength</span>
                    <span className={`font-medium ${passwordStrength >= 4 ? 'text-green-400' : passwordStrength >= 3 ? 'text-blue-400' : passwordStrength >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getPasswordStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-gray-200 font-medium">Confirm Password</label>
              <div className="relative group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`
                    w-full px-4 py-3 pl-11 pr-12 bg-white/10 border rounded-xl 
                    text-white placeholder-gray-400 backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:border-transparent
                    transition-all duration-300 ease-out
                    group-hover:bg-white/15
                    ${form.confirmPassword && form.password !== form.confirmPassword 
                      ? 'border-red-400 focus:ring-red-400' 
                      : form.confirmPassword && form.password === form.confirmPassword
                      ? 'border-green-400 focus:ring-green-400'
                      : 'border-white/20 focus:ring-purple-400'
                    }
                  `}
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showConfirmPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-.588-.686m5.832 5.832l-.684-.588M14.121 14.121L15.536 15.536M14.121 14.121l.588.686M18.536 9.464L17.122 8.05M14.709 14.709L13.293 13.293" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-red-400 text-xs flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Passwords don't match
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <label className="flex items-start text-gray-300 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 text-purple-400 bg-white/10 border-white/20 rounded focus:ring-purple-400 focus:ring-2 mr-3 mt-0.5 flex-shrink-0" 
                />
                <span className="text-sm group-hover:text-white transition-colors duration-200">
                  I agree to the{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-300 font-medium underline">
                    Terms of Service
                  </a>
                  {" "}and{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-300 font-medium underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="
                w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl
                hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400
                transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl
                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                relative overflow-hidden group
              "
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </div>
            </button>
          </div>

          

          {/* Login Link */}
          <p className="text-center text-gray-300">
            Already have an account?{" "}
            <a href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}