import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { JobsProvider } from './src/context/JobsContext';
import { ServicesProvider, useServices } from './src/context/ServicesContext';

import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/customer/HomeScreen';
import ProfessionalListScreen from './src/screens/customer/ProfessionalsListScreen';
import ProfessionalDetailScreen from './src/screens/customer/ProfessionalDetailScreen';
import CreateRequestScreen from './src/screens/customer/CreateRequestScreen';
import ServiceInProgressScreen from './src/screens/customer/ServiceInProgressScreen';
import MyRequestsScreen from './src/screens/customer/MyRequestsScreen';
import MyServicesScreen from './src/screens/professional/MyServicesScreen';
import CreateJobsScreen from './src/screens/professional/CreateJobsScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import PrivacyPolicyScreen from './src/screens/legal/PrivacyPolicyScreen';
import TermsScreen from './src/screens/legal/TermsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}


function CustomerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeCust" component={HomeScreen} options={{ title: 'Chambitas' }} />
      <Stack.Screen name="ProfsList" component={ProfessionalListScreen} options={{ title: 'Profesionales' }} />
      <Stack.Screen name="ProfsDetail" component={ProfessionalDetailScreen} options={{ title: 'Perfil' }} />
      <Stack.Screen name="CreateReq" component={CreateRequestScreen} options={{ title: 'Solicitar servicio' }} />
      <Stack.Screen name="ServiceProg" component={ServiceInProgressScreen} options={{ title: 'Servicio en curso' }} />
    </Stack.Navigator>
  );
}

// Stack de perfil compartido (cliente y profesional)
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Mi perfil' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar perfil' }} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Privacidad' }} />
      <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Términos' }} />
    </Stack.Navigator>
  );
}

function MyRequestsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyRequests" component={MyRequestsScreen} options={{ title: 'Mis servicios' }} />
      <Stack.Screen name="ServiceDetail" component={ServiceInProgressScreen} options={{ title: 'Detalle del servicio' }} />
    </Stack.Navigator>
  );
}

function CustomerNavigator() {
  const { services } = useServices();
  const { user } = useAuth();

  // Cuenta servicios activos del consumidor para el badge
  const activeCount = services.filter(
    (s) => s.customerEmail === user.email && s.status !== 'finalizado'
  ).length;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={CustomerStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="MyServicesTab"
        component={MyRequestsStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Servicios',
          tabBarBadge: activeCount > 0 ? activeCount : undefined,
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Stack del profesional
function ProfessionalStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyJobsMain" component={MyServicesScreen} options={{ title: 'Mis chambitas' }} />
    </Stack.Navigator>
  );
}

function ProfessionalNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="MyJobsTab"
        component={ProfessionalStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Mis chambitas',
          tabBarIcon: ({ color }) => <Ionicons name="briefcase" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="CreateJobTab"
        component={CreateJobsScreen}
        options={{
          tabBarLabel: 'Publicar',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading, userType } = useAuth();

  if (isLoading) return null;

  return (
    <NavigationContainer>
      {isAuthenticated
        ? (userType === 'professional' ? <ProfessionalNavigator /> : <CustomerNavigator />)
        : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <JobsProvider>
        <ServicesProvider>
          <RootNavigator />
        </ServicesProvider>
      </JobsProvider>
    </AuthProvider>
  );
}