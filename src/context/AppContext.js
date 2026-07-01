import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isLoading, setIsLoading]               = useState(true);
  const [isAuthenticated, setIsAuthenticated]   = useState(false);
  const [userType, setUserType]                 = useState('customer');
  const [user, setUser]                         = useState(null);
  const [professionals, setProfessionals]       = useState([]);
  const [services, setServices]                 = useState([]);
  const [assignedServices, setAssignedServices] = useState([]);
  const [jobs, setJobs]                         = useState([]);

  const isRegistering = useRef(false);

  // ─────────────────────────────────────────────
  // SESIÓN
  // ─────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error || !session) {
        if (error) supabase.auth.signOut();
        setIsLoading(false);
        return;
      }
      setIsAuthenticated(true);
      loadUserProfile(session.user.id);
      loadServices(session.user.id);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          if (isRegistering.current) return;
          setIsAuthenticated(true);
          await loadUserProfile(session.user.id);
          await loadServices(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUserType('customer');
          setUser(null);
          setServices([]);
          setAssignedServices([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ─────────────────────────────────────────────
  // CARGAR DATOS PÚBLICOS
  // ─────────────────────────────────────────────
  useEffect(() => {
    loadProfessionals();
    loadJobs();
  }, []);

  // ─────────────────────────────────────────────
  // LOADERS
  // ─────────────────────────────────────────────
  const loadUserProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const tipo = data.user_type || 'customer';
      setUserType(tipo);
      setUser({
        id:        data.id,
        name:      data.name      || '',
        email:     authUser?.email || '',
        phone:     data.phone     || '',
        address:   data.address   || '',
        city:      data.city      || '',
        zipCode:   data.zip_code  || '',
        reference: data.reference || '',
        userType:  tipo,
      });

      if (tipo === 'professional') {
        await loadAssignedServices(userId);
      }
    }
  };

  const loadProfessionals = async () => {
    const { data } = await supabase
      .from('professionals')
      .select('*')
      .eq('is_active', true);

    if (data) {
      setProfessionals(data.map(p => ({
        id:          p.id,
        name:        p.name,
        category:    p.category,
        rating:      p.rating,
        distanceKm:  p.distance_km,
        priceFrom:   p.price_from,
        area:        p.area,
        description: p.description,
      })));
    }
  };

  const loadServices = async (userId) => {
    const { data } = await supabase
      .from('services')
      .select('*, professionals(name, category, rating, area)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      setServices(data.map(s => ({
        id:                   s.id,
        professionalId:       s.professional_id,
        description:          s.description,
        address:              s.address,
        whenType:             s.when_type,
        date:                 s.scheduled_date,
        time:                 s.scheduled_time,
        status:               s.status,
        rating:               s.rating ?? null,
        createdAt:            s.created_at,
        professionalName:     s.professionals?.name     || '',
        professionalCategory: s.professionals?.category || '',
        professionalRating:   s.professionals?.rating   || 0,
        professionalArea:     s.professionals?.area     || '',
      })));
    }
  };

  const loadAssignedServices = async (userId) => {
    const { data: proData } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!proData) return;

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('professional_id', proData.id)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error al cargar servicios asignados:', error?.message);
      return;
    }

    const userIds = [...new Set(data.map(s => s.user_id))];
    let profilesMap = {};

    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, phone, address')
        .in('id', userIds);

      (profilesData || []).forEach(p => { profilesMap[p.id] = p; });
    }

    setAssignedServices(data.map(s => ({
      id:            s.id,
      userId:        s.user_id,
      description:   s.description,
      address:       s.address,
      whenType:      s.when_type,
      date:          s.scheduled_date,
      time:          s.scheduled_time,
      status:        s.status,
      rating:        s.rating ?? null,
      createdAt:     s.created_at,
      clientName:    profilesMap[s.user_id]?.name    || 'Cliente',
      clientPhone:   profilesMap[s.user_id]?.phone   || '',
      clientAddress: profilesMap[s.user_id]?.address || '',
    })));
  };

  const loadJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setJobs(data.map(j => ({
        id:          j.id,
        title:       j.title,
        category:    j.category,
        description: j.description,
        price:       j.price,
        area:        j.area,
        authorName:  j.author_name,
        authorId:    j.author_id,
        createdAt:   j.created_at,
      })));
    }
  };

  // ─────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert('Correo o contraseña incorrectos');
      return false;
    }
    return true;
  }, []);

  const register = useCallback(async ({ name, email, password, type = 'customer' }) => {
    isRegistering.current = true;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, user_type: type } },
    });

    if (error) {
      isRegistering.current = false;
      alert(error.message.includes('already registered')
        ? 'Ya existe una cuenta con ese correo'
        : 'Error al crear la cuenta: ' + error.message);
      return false;
    }

    if (data.user) {
      await supabase
        .from('profiles')
        .update({ user_type: type, name })
        .eq('id', data.user.id);

      await loadUserProfile(data.user.id);
      await loadServices(data.user.id);
      setIsAuthenticated(true);
    }

    isRegistering.current = false;
    return true;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // ─────────────────────────────────────────────
  // PERFIL
  // ─────────────────────────────────────────────
  const updateUser = useCallback(async (updatedData) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name:      updatedData.name,
        phone:     updatedData.phone,
        address:   updatedData.address,
        city:      updatedData.city,
        zip_code:  updatedData.zipCode,
        reference: updatedData.reference,
      })
      .eq('id', user.id);

    if (!error) {
      setUser(prev => ({ ...prev, ...updatedData }));
    }
  }, [user?.id]);

  // ─────────────────────────────────────────────
  // SERVICIOS (cliente)
  // ─────────────────────────────────────────────
  const createServiceRequest = useCallback(async ({
    professionalId, description, address, whenType, date, time,
  }) => {
    if (!description?.trim()) {
      alert('Por favor describe lo que necesitas');
      return null;
    }

    let realProfessionalId = professionalId;
    if (String(professionalId).startsWith('job-')) {
      const jobId = String(professionalId).replace('job-', '');

      const { data: jobData } = await supabase
        .from('jobs')
        .select('author_id')
        .eq('id', jobId)
        .single();

      if (!jobData) {
        alert('No se encontró al profesional');
        return null;
      }

      const { data: proData } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', jobData.author_id)
        .single();

      if (!proData) {
        alert('Este profesional aún no tiene perfil completo en la plataforma');
        return null;
      }

      realProfessionalId = proData.id;
    }

    const { data: { user: authUser } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('services')
      .insert({
        user_id:         authUser.id,
        professional_id: realProfessionalId,
        description,
        address,
        when_type:       whenType,
        scheduled_date:  date,
        scheduled_time:  time,
        status:          'pendiente',
        rating:          null,
      })
      .select('*, professionals(name, category, rating, area)')
      .single();

    if (error) {
      console.error('Error al crear servicio:', error.message);
      alert('No se pudo crear la solicitud. Intenta de nuevo.');
      return null;
    }

    if (data) {
      const newService = {
        id:                   data.id,
        professionalId:       data.professional_id,
        description:          data.description,
        address:              data.address,
        whenType:             data.when_type,
        date:                 data.scheduled_date,
        time:                 data.scheduled_time,
        status:               data.status,
        rating:               null,
        createdAt:            data.created_at,
        professionalName:     data.professionals?.name     || '',
        professionalCategory: data.professionals?.category || '',
        professionalRating:   data.professionals?.rating   || 0,
        professionalArea:     data.professionals?.area     || '',
      };
      setServices(prev => [newService, ...prev]);
      return newService;
    }

    return null;
  }, []);

  const updateServiceStatus = useCallback(async (serviceId, status) => {
    const { error } = await supabase
      .from('services')
      .update({ status })
      .eq('id', serviceId);

    if (!error) {
      setServices(prev =>
        prev.map(s => s.id === serviceId ? { ...s, status } : s)
      );
      setAssignedServices(prev =>
        prev.map(s => s.id === serviceId ? { ...s, status } : s)
      );
    }
  }, []);

  const acceptService = useCallback(async (serviceId) => {
    await updateServiceStatus(serviceId, 'en_camino');
  }, [updateServiceStatus]);

  const rejectService = useCallback(async (serviceId) => {
    await updateServiceStatus(serviceId, 'rechazado');
  }, [updateServiceStatus]);

  const rateService = useCallback(async (serviceId, rating) => {
    const { error } = await supabase
      .from('services')
      .update({ rating })
      .eq('id', serviceId);

    if (!error) {
      setServices(prev =>
        prev.map(s => s.id === serviceId ? { ...s, rating } : s)
      );
    }
  }, []);

  // Refrescar servicios del cliente desde Supabase
  const refreshServices = useCallback(async () => {
    if (user?.id) {
      await loadServices(user.id);
    }
  }, [user?.id]);

  // Refrescar servicios asignados al profesional
  const refreshAssignedServices = useCallback(async () => {
    if (user?.id && userType === 'professional') {
      await loadAssignedServices(user.id);
    }
  }, [user?.id, userType]);

  // ─────────────────────────────────────────────
  // CHAMBITAS (jobs)
  // ─────────────────────────────────────────────
  const createJob = useCallback(async (jobData) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title:       jobData.title,
        category:    jobData.category,
        description: jobData.description,
        price:       jobData.price,
        area:        jobData.area,
        author_name: user?.name || 'Profesional',
        author_id:   authUser.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear job:', error.message);
      return null;
    }

    if (data) {
      const newJob = {
        id:          data.id,
        title:       data.title,
        category:    data.category,
        description: data.description,
        price:       data.price,
        area:        data.area,
        authorName:  data.author_name,
        authorId:    data.author_id,
        createdAt:   data.created_at,
      };
      setJobs(prev => [newJob, ...prev]);
      return newJob;
    }
    return null;
  }, [user?.name]);

  const deleteJob = useCallback(async (jobId) => {
    await supabase.from('jobs').delete().eq('id', jobId);
    setJobs(prev => prev.filter(j => j.id !== jobId));
  }, []);

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────
  const jobsAsProfessionals = useMemo(() => jobs.map(j => ({
    id:          'job-' + j.id,
    name:        j.authorName || 'Profesional',
    category:    j.category   || 'Otro',
    rating:      5.0,
    distanceKm:  0,
    priceFrom:   Number(j.price) || 0,
    area:        j.area         || 'Sin área',
    description: j.description  || '',
    jobTitle:    j.title        || '',
  })), [jobs]);

  const allProfessionals = useMemo(() => (
    [...professionals, ...jobsAsProfessionals]
  ), [professionals, jobsAsProfessionals]);

  const isProfileComplete    = !!(user?.phone && user?.address);
  const activeServicesCount  = services.filter(
    s => s.status !== 'finalizado' && s.status !== 'rechazado'
  ).length;
  const pendingAssignedCount = assignedServices.filter(
    s => s.status === 'pendiente'
  ).length;

  // ─────────────────────────────────────────────
  // CONTEXT VALUE
  // ─────────────────────────────────────────────
  const value = useMemo(() => ({
    isAuthenticated,
    isLoading,
    userType,
    user,
    professionals: allProfessionals,
    services,
    assignedServices,
    jobs,
    isProfileComplete,
    activeServicesCount,
    pendingAssignedCount,
    login,
    register,
    logout,
    updateUser,
    createServiceRequest,
    updateServiceStatus,
    acceptService,
    rejectService,
    rateService,
    refreshServices,
    refreshAssignedServices,
    createJob,
    deleteJob,
  }), [
    isAuthenticated, isLoading, userType, user,
    allProfessionals, services, assignedServices, jobs,
    isProfileComplete, activeServicesCount, pendingAssignedCount,
    login, register, logout, updateUser,
    createServiceRequest, updateServiceStatus,
    acceptService, rejectService, rateService,
    refreshServices, refreshAssignedServices,
    createJob, deleteJob,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);