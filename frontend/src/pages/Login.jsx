import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // User login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/user/login", { email, password });
      login(data);

      toast.success(data.message || "Login successful");

      setTimeout(()=>{
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
        console.error(err);
        const errMsg = err.response?.data?.error || "Invalid credentials!";
        setError(errMsg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome Back
        </h2>
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-xl text-blue-700"
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline cursor-pointer">
              SignUp here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
