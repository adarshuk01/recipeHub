import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosInstance';
import { toast } from "react-hot-toast";


const CookSnapContext = createContext();

export const CookSnapProvider = ({ children }) => {
  const [cookSnaps, setCookSnaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userCookSnaps,setuserCookSnaps]=useState([])

  const baseUrl = '/api/cooksnaps'; // Adjust if using a different API path

  // Fetch all cook snaps
  const fetchCookSnaps = async (recipeId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/cooksnap?recipeId=${recipeId}`);
      setCookSnaps(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching cook snaps');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all cook snaps
  const fetchuserCookSnaps = async (id) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/cooksnap/mycooksnap/${id}`);
      console.log(res);
      
      setuserCookSnaps(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching cook snaps');
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  // Create a cook snap
  const createCookSnap = async (snapData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/cooksnap', snapData);
      console.log(res);
      toast.success('CookSnap Added!')
      
      setCookSnaps(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
              toast.error('Failed to create snap');

      throw new Error(err.response?.data?.message || 'Failed to create snap');
    }finally {
      setLoading(false);
    }
  };

  // Update cook snap
  const updateCookSnap = async (id, updatedData) => {
    try {
      const res = await axiosInstance.put(`/cooksnap/${id}`, updatedData);
      setCookSnaps(prev => prev.map(snap => snap._id === id ? res.data : snap));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update snap');
    }
  };

  // Delete cook snap
  const deleteCookSnap = async (id) => {
    try {
      await axiosInstance.delete(`/cooksnap/${id}`);
      setCookSnaps(prev => prev.filter(snap => snap._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete snap');
    }
  };

  // Get snap by ID
  const getCookSnapById = async (id) => {
    try {
      const res = await axios.get(`/cooksnap/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to fetch snap');
    }
  };

 

  return (
    <CookSnapContext.Provider value={{
      cookSnaps,
      userCookSnaps,
      loading,
      error,
      fetchCookSnaps,
      createCookSnap,
      updateCookSnap,
      deleteCookSnap,
      getCookSnapById,
      fetchuserCookSnaps

    }}>
      {children}
    </CookSnapContext.Provider>
  );
};

// Hook
export const useCookSnap = () => useContext(CookSnapContext);
