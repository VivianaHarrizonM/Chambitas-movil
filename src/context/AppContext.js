import React, { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext();

const INITIAL_PROFESSIONALS = [
  {
    id: '1',
    name: 'Juan Pérez',
    category: 'Plomería',
    rating: 4.8,
    distanceKm: 1.2,
    priceFrom: 300,
    area: 'Roma Norte, CDMX',
    description: 'Plomero certificado con más de 10 años de experiencia en plomería residencial.',
  },
  {
    id: '2',
    name: 'María López',
    category: 'Plomería',
    rating: 4.6,
    distanceKm: 2.0,
    priceFrom: 400,
    area: 'Condesa, CDMX',
    description: 'Especialista en fugas e instalación de calentadores.',
  },
  {
    id: '3',
    name: 'Carlos Ramírez',
    category: 'Carpintería',
    rating: 4.7,
    distanceKm: 1.8,
    priceFrom: 500,
    area: 'Del Valle, CDMX',
    description: 'Carpintería fina, muebles a medida y reparaciones.',
  },
];

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    name: 'Viviana',
    email: 'viviana@example.com',
  });

  const [professionals] = useState(INITIAL_PROFESSIONALS);
  const [services, setServices] = useState([]); // solicitudes de servicio

  const login = (email) => {
    setUser((prev) => ({ ...prev, email: email || prev.email }));
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const createServiceRequest = ({
    professionalId,
    description,
    address,
    whenType,
    date,
    time,
  }) => {
    const id = String(Date.now());
    const newService = {
      id,
      professionalId,
      description,
      address,
      whenType,
      date,
      time,
      status: 'en_camino', // directo a "en camino" para la demo
      createdAt: new Date().toISOString(),
    };
    setServices((prev) => [newService, ...prev]);
    return newService;
  };

  const updateServiceStatus = (serviceId, status) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status } : s))
    );
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      professionals,
      services,
      login,
      logout,
      createServiceRequest,
      updateServiceStatus,
    }),
    [isAuthenticated, user, professionals, services]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);
