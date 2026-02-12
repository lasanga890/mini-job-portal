import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ROLE-BASED REDIRECTION
  useEffect(() => {
    if (user && role) {
      if (role === "candidate") {
        navigate("/candidate");
      } else if (role === "employer") {
        navigate("/employer");
      } else if (role === "admin") {
        navigate("/admin");
      }
    }
  }, [user, role, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-2 px-4 sm:px-6 lg:px-8 font-sans relative z-10">
      <div className="max-w-md w-full space-y-2 bg-card-bg backdrop-blur-xl p-8 rounded-2xl shadow-glow border border-border-dim animate-slide-up">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">Login</h1>
          <p className="mt-2 text-text-dim text-sm">Welcome back! Please enter your details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 mt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-dim mb-1 text-left">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 bg-white/5 border border-border-dim rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent outline-none transition-all placeholder-text-dim/50 text-text-main"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dim mb-1 text-left">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full px-4 py-3 bg-white/5 border border-border-dim rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent outline-none transition-all placeholder-text-dim/50 text-text-main pr-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-white transition-colors p-1"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.5 4.5m9 9L19.5 19.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-accent-gradient hover:opacity-90 text-white font-bold rounded-xl transition-all transform cursor-pointer active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-accent-purple/20 mt-4"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded text-sm text-red-400 animate-pulse mt-4">
              {error}
            </div>
          )}
        </form>

        <div className="text-center text-text-dim text-sm mt-8">
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            className="text-accent-light font-bold hover:underline ml-1 transition-colors cursor-pointer"
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
