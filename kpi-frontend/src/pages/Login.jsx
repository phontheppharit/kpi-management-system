import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      localStorage.setItem("username", res.data.username);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(
        "Login ล้มเหลว: " +
          (err.response?.data?.msg || "ไม่สามารถเข้าสู่ระบบได้")
      );
    } finally {
      setIsLoading(false);
    }
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
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        {/* Animated mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-transparent to-purple-600/30 animate-pulse" />

        {/* Floating particles */}
        {mounted && (
          <>
            <FloatingParticle
              delay={0}
              duration={6}
              size={2}
              left={10}
              top={20}
            />
            <FloatingParticle
              delay={1}
              duration={8}
              size={1}
              left={80}
              top={10}
            />
            <FloatingParticle
              delay={2}
              duration={7}
              size={3}
              left={60}
              top={70}
            />
            <FloatingParticle
              delay={3}
              duration={9}
              size={2}
              left={20}
              top={80}
            />
            <FloatingParticle
              delay={4}
              duration={5}
              size={1}
              left={90}
              top={60}
            />
            <FloatingParticle
              delay={5}
              duration={10}
              size={2}
              left={40}
              top={30}
            />
          </>
        )}

        {/* Geometric shapes */}
        <div
          className="absolute top-20 left-20 w-32 h-32 border border-white/20 rotate-45 animate-spin opacity-30"
          style={{ animationDuration: "20s" }}
        />
        <div
          className="absolute bottom-40 right-20 w-24 h-24 border-2 border-white/10 rounded-full animate-bounce opacity-40"
          style={{ animationDuration: "3s" }}
        />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 transform rotate-12 animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div
          className={`
          bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20
          transform transition-all duration-1000 ease-out
          ${
            mounted
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          }
        `}
        >
          {/* Logo/Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl mb-4 shadow-lg animate-pulse">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300">Sign in to your account</p>
          </div>

          <div className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-gray-200 font-medium">
                Username
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className="
                    w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl 
                    text-white placeholder-gray-400 backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                    transition-all duration-300 ease-out
                    group-hover:bg-white/15
                  "
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-gray-200 font-medium">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="
                    w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl 
                    text-white placeholder-gray-400 backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                    transition-all duration-300 ease-out
                    group-hover:bg-white/15
                  "
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-.588-.686m5.832 5.832l-.684-.588M14.121 14.121L15.536 15.536M14.121 14.121l.588.686M18.536 9.464L17.122 8.05M14.709 14.709L13.293 13.293"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-300 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-cyan-400 bg-white/10 border-white/20 rounded focus:ring-cyan-400 focus:ring-2 mr-2"
                />
                <span className="group-hover:text-white transition-colors duration-200">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="
                w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl
                hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400
                transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl
                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                relative overflow-hidden group
              "
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </div>
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-300">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200 hover:underline"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
