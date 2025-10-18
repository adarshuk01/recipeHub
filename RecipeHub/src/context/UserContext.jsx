// context/UserContext.js
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null); // currently viewed profile
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
    const navigate=useNavigate()


  // 🔹 Fetch user profile by ID
  const fetchUserById = async (id, token) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch followers of a user
  const fetchFollowers = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${id}/followers`);
      setFollowers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load followers");
    }
  };

  // 🔹 Fetch following list of a user
  const fetchFollowing = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${id}/following`);
      setFollowing(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load following");
    }
  };

  // 🔹 Toggle follow/unfollow
  const toggleFollow = async (targetUserId, token, currentUserId) => {
    try {
      const toastId = toast.loading("Updating follow...");
      const res = await axios.put(
        `http://localhost:5000/api/users/${targetUserId}/follow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.dismiss(toastId);
      toast.success(res.data.message);

      // Optional: update selectedUser.followers list immediately
      setSelectedUser((prev) => {
        if (!prev) return prev;
        let updatedFollowers;

        if (res.data.isFollowing) {
          // Add current user to followers
          updatedFollowers = [...prev.followers, currentUserId];
        } else {
          // Remove current user from followers
          updatedFollowers = prev.followers.filter((id) => id !== currentUserId);
        }

        return { ...prev, followers: updatedFollowers };
      });

      return res.data.isFollowing;
    } catch (err) {
      toast.dismiss();
      toast.error("Follow action failed");
      if(err.response?.status==401){
      navigate('/signup')
      }
      console.error(err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        followers,
        following,
        loading,
        fetchUserById,
        fetchFollowers,
        fetchFollowing,
        toggleFollow,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
