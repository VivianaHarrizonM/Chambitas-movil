import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH: 'AUTH_STATE',
  USER: 'USER_DATA',
  SERVICES: 'SERVICES_DATA',
  JOBS: 'JOBS_DATA', 
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    reference: '',
  }); 

  const [professionals] = useState(INITIAL_PROFESSIONALS);
  const [services, setServices] = useState([]); 
  const [jobs, setJobs] = useState([]);

  // ✅ CORREGIDO: ahora usa el estado jobs y guarda en AsyncStorage
  const createJob = async (jobData) => {
    try {
      const storedJobs = await AsyncStorage.getItem(STORAGE_KEYS.JOBS);
      const jobsList = storedJobs ? JSON.parse(storedJobs) : [];

      const newJob = {
        id: Date.now().toString(), 
        ...jobData,
        createdAt: new Date().toISOString(),
      };

      jobsList.push(newJob);
      setJobs(jobsList); 
      await AsyncStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobsList));
    } catch (error) {
      console.log('Error creando chambita', error);
    }
  };

  const login = async ({ email, password }) => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);

      if (!storedUser) {
        alert('No existe ninguna cuenta');
        return;
      }

      const userData = JSON.parse(storedUser);

      if (userData.email !== email || userData.password !== password) {
        alert('Correo o contraseña incorrectos');
        return;
      }

      await AsyncStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.log('Error en login:', error);
      alert('Error al iniciar sesión');
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const userData = {
        name,
        email,
        password,
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        reference: '',
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      alert('Cuenta creada. Ahora inicia sesión');
    } catch (error) {
      console.log('Error en registro:', error);
      alert('Error al crear la cuenta');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH,
        STORAGE_KEYS.SERVICES,
        STORAGE_KEYS.JOBS, 
      ]);

      setUser({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        reference: '',
      }); 

      setServices([]);
      setJobs([]); 
      setIsAuthenticated(false);
    } catch (error) {
      console.log('Error en logout:', error);
    }
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
      status: 'en_camino',
      createdAt: new Date().toISOString(),
    };
    setServices((prev) => [newService, ...prev]);
    return newService;
  };

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = {
        ...user,
        ...updatedData,
      };

      setUser(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } catch (error) {
      console.log('Error actualizando usuario:', error);
    }
  };

  const updateServiceStatus = (serviceId, status) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status } : s))
    );
  };

  // ✅ CORREGIDO: agregar jobs a la carga inicial
  useEffect(() => {
    const loadData = async () => {
      try {
        const auth = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        const servicesData = await AsyncStorage.getItem(STORAGE_KEYS.SERVICES);
        const jobsData = await AsyncStorage.getItem(STORAGE_KEYS.JOBS); 

        if (auth === 'true' && userData) {
          setIsAuthenticated(true);
          setUser(JSON.parse(userData));
        }

        if (servicesData) setServices(JSON.parse(servicesData));
        if (jobsData) setJobs(JSON.parse(jobsData)); 
      } catch (e) {
        console.log('Error loading data', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.AUTH, isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    if (user?.email) {
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  const isProfileComplete = user.phone && user.address;

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      professionals,
      services,
      jobs, 
      login,
      register,
      logout,
      createServiceRequest,
      updateServiceStatus,
      updateUser,
      isProfileComplete,
      createJob,
    }),
    [isAuthenticated, user, professionals, services, jobs] 
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);