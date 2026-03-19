import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useJobs } from './JobsContext';

const STORAGE_KEY = 'SERVICES_DATA';

const SEED_PROFESSIONALS = [
  { id: 'seed-1', name: 'Juan Pérez', category: 'Plomería', rating: 4.8, distanceKm: 1.2, priceFrom: 300, area: 'Roma Norte, CDMX', description: 'Plomero certificado con más de 10 años de experiencia en plomería residencial.' },
  { id: 'seed-2', name: 'María López', category: 'Plomería', rating: 4.6, distanceKm: 2.0, priceFrom: 400, area: 'Condesa, CDMX', description: 'Especialista en fugas e instalación de calentadores.' },
  { id: 'seed-3', name: 'Carlos Ramírez', category: 'Carpintería', rating: 4.7, distanceKm: 1.8, priceFrom: 500, area: 'Del Valle, CDMX', description: 'Carpintería fina, muebles a medida y reparaciones.' },
];

const ServicesContext = createContext();

export function ServicesProvider({ children }) {
  const [services, setServices] = useState([]);
  const loaded = useRef(false);
  const { jobs } = useJobs();

  const jobsAsProfessionals = jobs.map((job) => ({
    id: 'job-' + job.id,
    name: job.authorName || 'Profesional',
    category: job.category || 'Otro',
    rating: 5.0,
    distanceKm: 0,
    priceFrom: Number(job.price) || 0,
    area: job.area || 'Sin área especificada',
    description: job.description || '',
    jobTitle: job.title || '',
  }));

  const professionals = [...SEED_PROFESSIONALS, ...jobsAsProfessionals];

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((data) => { if (data) setServices(JSON.parse(data)); })
      .catch((e) => console.log('Error cargando servicios:', e))
      .finally(() => { loaded.current = true; });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(services))
      .catch((e) => console.log('Error guardando servicios:', e));
  }, [services]);

  // customerEmail identifica a qué consumidor pertenece cada solicitud
  const createServiceRequest = ({ professionalId, description, address, whenType, date, time, customerEmail }) => {
    if (!description.trim()) { alert('Por favor describe lo que necesitas'); return null; }
    const id = String(Date.now());
    const newService = {
      id,
      professionalId,
      description,
      address,
      whenType,
      date,
      time,
      customerEmail,   // <-- guarda el email del consumidor
      status: 'en_camino',
      createdAt: new Date().toISOString(),
    };
    setServices((prev) => [newService, ...prev]);
    return newService;
  };

  const updateServiceStatus = (serviceId, status) => {
    setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, status } : s)));
  };

  return (
    <ServicesContext.Provider value={{ services, professionals, createServiceRequest, updateServiceStatus }}>
      {children}
    </ServicesContext.Provider>
  );
}

export const useServices = () => useContext(ServicesContext);