import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH: 'AUTH_STATE',
  USER: 'USER_DATA',
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('customer'); // 'customer' | 'professional'
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    reference: '',
    type: 'customer',
  });

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const auth = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        if (auth === 'true' && userData) {
          const parsed = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsed);
          setUserType(parsed.type || 'customer');
        }
      } catch (e) {
        console.log('Error cargando auth:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (!storedUser) {
        alert('No existe ninguna cuenta registrada');
        return;
      }
      const userData = JSON.parse(storedUser);
      if (userData.email !== email || userData.password !== password) {
        alert('Correo o contraseña incorrectos');
        return;
      }
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH, 'true');
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
      const userData = {
        name,
        email,
        password,
        type,
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
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH);
      setUser({
        name: '', email: '', phone: '', address: '',
        city: '', zipCode: '', reference: '', type: 'customer',
      });
      setIsAuthenticated(false);
      setUserType('customer');
    } catch (error) {
      console.log('Error en logout:', error);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } catch (error) {
      console.log('Error actualizando usuario:', error);
    }
  };

  const isProfileComplete = !!(user.phone && user.address);

  return (
    <AuthContext.Provider value={{
      isLoading,
      isAuthenticated,
      userType,
      user,
      login,
      register,
      logout,
      updateUser,
      isProfileComplete,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);