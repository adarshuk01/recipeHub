import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login, loading, error } = useContext(AuthContext);
    const navigate=useNavigate()


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData);
    if (res) {
      navigate('/')
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center md:text-left">
        Login
      </h2>
      <p className="text-gray-600 mb-8 text-center md:text-left">
        Hey enter your details to login to your account
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter your Email"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 6h.01M3 8v8a2 2 0 002 2h14a2 2 0 002-2V8m-9 6h.01"
              ></path>
            </svg>
          </span>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter Password"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
          </span>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition duration-300"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
