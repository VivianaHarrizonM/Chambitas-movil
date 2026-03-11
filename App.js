import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './src/Context/AuthContext';
import { JobsProvider } from './src/Context/JobsContext';
import { ServicesProvider } from './src/context/ServicesContext';

import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/customer/HomeScreen';
import ProfessionalListScreen from './src/screens/customer/ProfessionalListScreen';
import ProfessionalDetailScreen from './src/screens/customer/ProfessionalDetailScreen';
import CreateRequestScreen from './src/screens/customer/CreateRequestScreen';
import ServiceInProgressScreen from './src/screens/customer/ServiceInProgressScreen';
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
      <Stack.Screen name="ProfsList" component={ProfessionalListScreen} />
      <Stack.Screen name="ProfsDetail" component={ProfessionalDetailScreen} />
      <Stack.Screen name="CreateReq" component={CreateRequestScreen} />
      <Stack.Screen name="ServiceProg" component={ServiceInProgressScreen} />
    </Stack.Navigator>
  );
}

function CustomerNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeTab" component={CustomerStack} options={{ headerShown: false, tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tab.Screen name="MyServicesTab" component={ServiceInProgressScreen} options={{ headerShown: false, tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ headerShown: false, tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tab.Navigator>
  );
}

function ProfessionalNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="MyJobsTab" component={MyServicesScreen} options={{ headerShown: false, tabBarIcon: ({ color }) => <Ionicons name="briefcase" size={24} color={color} /> }} />
      <Tab.Screen name="CreateJobTab" component={CreateJobsScreen} options={{ headerShown: false, tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} /> }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ headerShown: false, tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading, userType } = useAuth();

  if (isLoading) return null;

  return (
    <NavigationContainer>
      {isAuthenticated ? (userType === 'professional' ? <ProfessionalNavigator /> : <CustomerNavigator />) : <AuthNavigator />}
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