import { useContext, useEffect, useState, createContext } from 'react';
import { socket } from '../socket';
import axiosInstance from '../axiosInstance';
import { AuthContext } from './AuthContext'; // Make sure this is the correct path

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext); // ⬅️ Get logged-in user


   // 1. Fetch notifications from API
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get('/notification');
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

  useEffect(() => {
    if (!user) return; // Don't connect or fetch if not logged in

   
  fetchNotifications()
   

    // 2. Listen for new notifications from server
    socket.on('new_notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      
    });

    return () => {
      socket.off('new_notification');
    };
  }, [user]); // ⬅️ Important: Re-run when user logs in

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications,fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
