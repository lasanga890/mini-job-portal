import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log(error)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const setRole = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // 2. Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: serverTimestamp()
      });

      // 3. Redirect to login
      navigate("/login");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
    setError("This email is already registered. Please sign in.");
  } else if (err.code === "auth/invalid-email") {
    setError("Please enter a valid email address.");
  } else if (err.code === "auth/weak-password") {
    setError("Password should be at least 6 characters.");
  } else {
    setError("Something went wrong. Please try again.");
  }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8 font-sans relative z-10">
      <div className="max-w-md w-full space-y-2 bg-card-bg backdrop-blur-xl p-8 rounded-2xl shadow-glow border border-border-dim animate-slide-up">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">Create Account</h1>
          <p className="mt-2 text-text-dim text-sm">Join JobPortal and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="form-group text-center">
            <label className="block text-sm font-semibold text-text-dim mb-2 text-center">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  formData.role === 'candidate' 
                    ? 'border-accent-purple bg-accent-purple/10 shadow-[0_0_15px_rgba(124,58,237,0.2)]' 
                    : 'border-border-dim bg-white/5 hover:border-accent-purple/50'
                }`}
                onClick={() => setRole('candidate')}
              >
                <div className="text-2xl mb-1">👤</div>
                <div className={`text-sm font-bold ${formData.role === 'candidate' ? 'text-accent-purple' : 'text-text-dim'}`}>Candidate</div>
              </div>
              <div
                className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  formData.role === 'employer' 
                    ? 'border-accent-purple bg-accent-purple/10 shadow-[0_0_15px_rgba(124,58,237,0.2)]' 
                    : 'border-border-dim bg-white/5 hover:border-accent-purple/50'
                }`}
                onClick={() => setRole('employer')}
              >
                <div className="text-2xl mb-1">🏢</div>
                <div className={`text-sm font-bold ${formData.role === 'employer' ? 'text-accent-purple' : 'text-text-dim'}`}>Employer</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-dim mb-1 text-left">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-3 bg-white/5 border border-border-dim rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent outline-none transition-all placeholder-text-dim/50 text-text-main"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 bg-white/5 border border-border-dim rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent outline-none transition-all placeholder-text-dim/50 text-text-main"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-accent-gradient hover:opacity-90 text-white font-bold rounded-xl transition-all transform cursor-pointer active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-accent-purple/20"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
           {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded text-sm text-red-400 animate-pulse">
            {error}
          </div>
        )}
        </form>

        <div className="text-center text-text-dim text-sm mt-8">
  Already have an account? 
  <span 
    onClick={() => navigate("/login")} 
    className="text-accent-light font-bold hover:underline ml-1 transition-colors cursor-pointer"
  >
    Sign in
  </span>
</div>
      </div>
    </div>
  );
};

export default Register;
