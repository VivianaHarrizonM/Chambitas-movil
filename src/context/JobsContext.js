import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'GLOBAL_JOBS_DATA';

const JobsContext = createContext();

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const loaded = useRef(false); 

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((data) => {
        if (data) setJobs(JSON.parse(data));
      })
      .catch((e) => console.log('Error cargando chambitas:', e))
      .finally(() => { loaded.current = true; });
  }, []);

  
  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
      .catch((e) => console.log('Error guardando chambitas:', e));
  }, [jobs]);

  const createJob = async (jobData) => {
    try {
      const newJob = {
        id: Date.now().toString(),
        ...jobData,
        createdAt: new Date().toISOString(),
      };
      setJobs((prev) => [newJob, ...prev]);
      return newJob;
    } catch (error) {
      console.log('Error creando chambita:', error);
      return null;
    }
  };

  const deleteJob = (jobId) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  return (
    <JobsContext.Provider value={{ jobs, createJob, deleteJob }}>
      {children}
    </JobsContext.Provider>
  );
}

export const useJobs = () => useContext(JobsContext);