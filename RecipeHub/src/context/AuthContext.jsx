import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  console.log('my profile',user);
  
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()

  // 🔹 Fetch user profile
  const fetchProfile = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      
      setUser(res.data);
      
      
    } catch (err) {
      toast.error("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  console.log(user);
  
  // ✅ Register
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      await fetchProfile(); // load profile after register
      toast.success("Registration successful 🎉");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };
  

  // ✅ Login
  const login = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      await fetchProfile(); // load profile after login
      toast.success("Login successful 🚀");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    toast("Logged out 👋", { icon: "👋" });
  };

// in AuthContext.js
const editProfile = async (formData) => {
  if (!token) return;
  setLoading(true);

  try {
    const res = await axios.put(
      "http://localhost:5000/api/users/profile",
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setUser(res.data);
    toast.success("Profile Updated");
    fetchProfile();
    navigate('/profile')
  } catch (err) {
    toast.error("Failed to Update profile");
    console.error(err);
  } finally {
    setLoading(false);
  }
};



  
  // 🔹 Auto-fetch profile on app load if token exists
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, logout, fetchProfile ,editProfile}}
    >
      {children}
    </AuthContext.Provider>
  );
}
