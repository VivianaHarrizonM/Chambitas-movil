import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServicesContext = createContext();

export function ServicesProvider({ children }) {
  const [myServices, setMyServices] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const services = await AsyncStorage.getItem('myServices');
        if (services) setMyServices(JSON.parse(services));
      } catch (error) {
        console.error('Error:', error);
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('myServices', JSON.stringify(myServices));
  }, [myServices]);

  const createServiceRequest = async (serviceData) => {
    const newService = { id: Date.now().toString(), ...serviceData, status: 'pending', createdAt: new Date().toISOString() };
    setMyServices((prev) => [newService, ...prev]);
    return { success: true, service: newService };
  };

  const updateServiceStatus = (serviceId, status) => {
    setMyServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, status } : s)));
  };

  return (
    <ServicesContext.Provider value={{ myServices, createServiceRequest, updateServiceStatus }}>
      {children}
    </ServicesContext.Provider>
  );
}

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) throw new Error('useServices debe estar dentro de ServicesProvider');
  return context;
};