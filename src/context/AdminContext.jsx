import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [unreadLeadsCount, setUnreadLeadsCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) return;
      
      const res = await axios.get('/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data?.data?.leads) {
        const count = res.data.data.leads.filter(lead => lead.isRead !== true).length;
        setUnreadLeadsCount(count);
      }
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <AdminContext.Provider value={{ unreadLeadsCount, setUnreadLeadsCount, fetchUnreadCount }}>
      {children}
    </AdminContext.Provider>
  );
};