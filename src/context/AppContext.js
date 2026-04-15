import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);

  // ── Escucha cambios de sesión automáticamente ──
  useEffect(() => {
    // Verificar sesión activa al arrancar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        loadUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Escuchar login/logout en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          await loadUserProfile(session.user.id);
          await loadServices(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUser(null);
          setServices([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Cargar profesionales al iniciar ──
  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUser({
        id: data.id,
        name: data.name,
        email: (await supabase.auth.getUser()).data.user?.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        zipCode: data.zip_code || '',
        reference: data.reference || '',
      });
    }
  };

  const loadProfessionals = async () => {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('is_active', true);

    if (data) {
      setProfessionals(data.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        rating: p.rating,
        distanceKm: p.distance_km,
        priceFrom: p.price_from,
        area: p.area,
        description: p.description,
      })));
    }
  };

  const loadServices = async (userId) => {
    const { data, error } = await supabase
      .from('services')
      .select('*, professionals(name, category, rating, area)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      setServices(data.map(s => ({
        id: s.id,
        professionalId: s.professional_id,
        description: s.description,
        address: s.address,
        whenType: s.when_type,
        date: s.scheduled_date,
        time: s.scheduled_time,
        status: s.status,
        createdAt: s.created_at,
      })));
    }
  };

  // ── Auth ──
  const login = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert('Correo o contraseña incorrectos');
      return false;
    }
    return true;
  };

  const register = async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      alert('Error al crear la cuenta: ' + error.message);
      return false;
    }

    alert('Cuenta creada. Ahora inicia sesión.');
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // ── Perfil ──
  const updateUser = async (updatedData) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: updatedData.name,
        phone: updatedData.phone,
        address: updatedData.address,
        city: updatedData.city,
        zip_code: updatedData.zipCode,
        reference: updatedData.reference,
      })
      .eq('id', user.id);

    if (!error) {
      setUser(prev => ({ ...prev, ...updatedData }));
    }
  };

  // ── Servicios ──
  const createServiceRequest = async ({
    professionalId, description, address, whenType, date, time,
  }) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('services')
      .insert({
        user_id: authUser.id,
        professional_id: professionalId,
        description,
        address,
        when_type: whenType,
        scheduled_date: date,
        scheduled_time: time,
        status: 'en_camino',
      })
      .select()
      .single();

    if (data) {
      const newService = {
        id: data.id,
        professionalId: data.professional_id,
        description: data.description,
        address: data.address,
        whenType: data.when_type,
        date: data.scheduled_date,
        time: data.scheduled_time,
        status: data.status,
        createdAt: data.created_at,
      };
      setServices(prev => [newService, ...prev]);
      return newService;
    }
    return null;
  };

  const updateServiceStatus = async (serviceId, status) => {
    await supabase
      .from('services')
      .update({ status })
      .eq('id', serviceId);

    setServices(prev =>
      prev.map(s => s.id === serviceId ? { ...s, status } : s)
    );
  };

  const isProfileComplete = user?.phone && user?.address;

  const value = useMemo(() => ({
    isAuthenticated,
    isLoading,
    user,
    professionals,
    services,
    login,
    register,
    logout,
    createServiceRequest,
    updateServiceStatus,
    updateUser,
    isProfileComplete,
  }), [isAuthenticated, isLoading, user, professionals, services]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);