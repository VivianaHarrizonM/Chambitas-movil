import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH: 'AUTH_ACTIVE_EMAIL',
  userKey: (email) => 'USER_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_'),
};

const EMPTY_USER = {
  name: '', email: '', phone: '', address: '',
  city: '', zipCode: '', reference: '', type: 'customer',
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('customer');
  const [user, setUser] = useState(EMPTY_USER);
  const loaded = useRef(false);

  // Carga el usuario activo al arrancar
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const activeEmail = await AsyncStorage.getItem(KEYS.AUTH);
        if (activeEmail) {
          const userData = await AsyncStorage.getItem(KEYS.userKey(activeEmail));
          if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setUserType(parsed.type || 'customer');
            setIsAuthenticated(true);
          }
        }
      } catch (e) {
        console.log('Error cargando auth:', e);
      } finally {
        loaded.current = true;
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const stored = await AsyncStorage.getItem(KEYS.userKey(email));
      if (!stored) {
        alert('No existe una cuenta con ese correo');
        return;
      }
      const userData = JSON.parse(stored);
      if (userData.password !== password) {
        alert('Contraseña incorrecta');
        return;
      }
      // Guarda qué email está activo
      await AsyncStorage.setItem(KEYS.AUTH, email);
      setUser(userData);
      setUserType(userData.type || 'customer');
      setIsAuthenticated(true);
    } catch (error) {
      console.log('Error en login:', error);
      alert('Error al iniciar sesión');
    }
  };

  const register = async ({ name, email, password, type = 'customer' }) => {
    try {
      // Verifica que no exista ya una cuenta con ese email
      const existing = await AsyncStorage.getItem(KEYS.userKey(email));
      if (existing) {
        alert('Ya existe una cuenta con ese correo');
        return;
      }
      const userData = { name, email, password, type, phone: '', address: '', city: '', zipCode: '', reference: '' };
      await AsyncStorage.setItem(KEYS.userKey(email), JSON.stringify(userData));
      alert('Cuenta creada. Ahora inicia sesión');
    } catch (error) {
      console.log('Error en registro:', error);
      alert('Error al crear la cuenta');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(KEYS.AUTH);
      setIsAuthenticated(false);
      setUserType('customer');
      setUser(EMPTY_USER);
    } catch (error) {
      console.log('Error en logout:', error);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      await AsyncStorage.setItem(KEYS.userKey(user.email), JSON.stringify(updatedUser));
    } catch (error) {
      console.log('Error actualizando usuario:', error);
    }
  };

  const isProfileComplete = !!(user.phone && user.address);

  return (
    <AuthContext.Provider value={{
      isLoading, isAuthenticated, userType,
      user, login, register, logout, updateUser, isProfileComplete,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);