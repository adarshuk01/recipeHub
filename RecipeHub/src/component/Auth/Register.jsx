import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Register() {
  const { register, loading, error } = useContext(AuthContext);
  const navigate=useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(formData);
    if (res) {
      navigate('/')
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center md:text-left">
        Signup
      </h2>
      <p className="text-gray-600 mb-8 text-center md:text-left">
        Hey enter your details to create your account
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="relative">
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter your Name"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </span>
        </div>

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

        {/* Phone */}
        <div className="relative">
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter your Phone"
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
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
            placeholder="Create Password"
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

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition duration-300"
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default Register;
