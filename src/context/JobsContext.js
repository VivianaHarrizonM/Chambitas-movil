import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobsContext = createContext();

export function JobsProvider({ children }) {
  const [myJobs, setMyJobs] = useState([]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobs = await AsyncStorage.getItem('myJobs');
        if (jobs) setMyJobs(JSON.parse(jobs));
      } catch (error) {
        console.error('Error:', error);
      }
    };
    loadJobs();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('myJobs', JSON.stringify(myJobs));
  }, [myJobs]);

  const createJob = async (jobData) => {
    const newJob = { id: Date.now().toString(), ...jobData, status: 'active', createdAt: new Date().toISOString() };
    setMyJobs((prev) => [newJob, ...prev]);
    return { success: true, job: newJob };
  };

  const updateJob = (jobId, updates) => {
    setMyJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, ...updates } : job)));
  };

  return (
    <JobsContext.Provider value={{ myJobs, createJob, updateJob }}>
      {children}
    </JobsContext.Provider>
  );
}

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) throw new Error('useJobs debe estar dentro de JobsProvider');
  return context;
};