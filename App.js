import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from './src/hooks/useNotifications';

import { AppProvider, useAppContext } from './src/context/AppContext';
import { COLORS } from './src/theme';

// — Auth screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

// — Customer screens
import HomeScreen from './src/screens/customer/HomeScreen';
import ProfessionalListScreen from './src/screens/customer/ProfessionalsListScreen';
import ProfessionalDetailScreen from './src/screens/customer/ProfessionalDetailScreen';
import CreateRequestScreen from './src/screens/customer/CreateRequestScreen';
import ServiceInProgressScreen from './src/screens/customer/ServiceInProgressScreen';
import MyRequestsScreen from './src/screens/customer/MyRequestsScreen';

// — Professional screens
import MyServicesScreen from './src/screens/professional/MyServicesScreen';
import CreateJobsScreen from './src/screens/professional/CreateJobsScreen';
import AssignedServicesScreen from './src/screens/professional/AssignedServicesScreen';

// — Profile & Legal screens
import ProfileScreen from './src/screens/profile/ProfileScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import PrivacyPolicyScreen from './src/screens/legal/PrivacyPolicyScreen';
import TermsScreen from './src/screens/legal/TermsScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ─────────────────────────────────────────────
// HEADER GLOBAL
// ─────────────────────────────────────────────
const HEADER_OPTIONS = {
  headerTitle: 'Chambitas',
  headerTitleStyle: {
    color:         COLORS.primary,
    fontWeight:    '700',
    fontSize:      20,
    letterSpacing: 1,
  },
  headerTintColor:     COLORS.primaryDark,
  headerBackTitle:     '',
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: COLORS.background,
  },
};

// ─────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingTitle}>Chambitas</Text>
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={{ marginTop: 24 }}
      />
      <Text style={styles.loadingSubtitle}>Cargando...</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────
function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// ─────────────────────────────────────────────
// CUSTOMER
// ─────────────────────────────────────────────
function CustomerStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTIONS}>
      <Stack.Screen name="HomeCust"    component={HomeScreen} />
      <Stack.Screen name="ProfsList"   component={ProfessionalListScreen} />
      <Stack.Screen name="ProfsDetail" component={ProfessionalDetailScreen} />
      <Stack.Screen name="CreateReq"   component={CreateRequestScreen} />
      <Stack.Screen name="ServiceProg" component={ServiceInProgressScreen} />
    </Stack.Navigator>
  );
}

function MyRequestsStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTIONS}>
      <Stack.Screen name="MyRequests"    component={MyRequestsScreen} />
      <Stack.Screen name="ServiceDetail" component={ServiceInProgressScreen} />
    </Stack.Navigator>
  );
}

function CustomerNavigator() {
  const { services } = useAppContext();
  const activeCount = services.filter(
    s => s.status !== 'finalizado' && s.status !== 'rechazado'
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

// ─────────────────────────────────────────────
// PROFESSIONAL
// ─────────────────────────────────────────────
function ProfessionalStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTIONS}>
      <Stack.Screen name="MyJobsMain" component={MyServicesScreen} />
    </Stack.Navigator>
  );
}

function AssignedServicesStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTIONS}>
      <Stack.Screen name="AssignedMain" component={AssignedServicesScreen} />
    </Stack.Navigator>
  );
}

function ProfessionalNavigator() {
  const { pendingAssignedCount } = useAppContext();

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
        name="AssignedTab"
        component={AssignedServicesStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Solicitudes',
          tabBarBadge: pendingAssignedCount > 0 ? pendingAssignedCount : undefined,
          tabBarIcon: ({ color }) => <Ionicons name="notifications" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="CreateJobTab"
        component={CreateJobsScreen}
        options={{
          ...HEADER_OPTIONS,
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

// ─────────────────────────────────────────────
// PROFILE (compartido entre customer y professional)
// ─────────────────────────────────────────────
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTIONS}>
      <Stack.Screen name="ProfileMain"   component={ProfileScreen} />
      <Stack.Screen name="EditProfile"   component={EditProfileScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="Terms"         component={TermsScreen} />
    </Stack.Navigator>
  );
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
function RootNavigator() {
  const { isAuthenticated, isLoading, user } = useAppContext();
  
  // Activar cuando se haga build de producción
  // useNotifications(user?.id);
  
  if (isLoading) return <LoadingScreen />;
  return (
    <NavigationContainer>
      {isAuthenticated
        ? (user?.userType === 'professional'
            ? <ProfessionalNavigator />
            : <CustomerNavigator />)
        : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  loadingSubtitle: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});