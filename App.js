import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { AppProvider, useAppContext } from './src/context/AppContext';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfessionalsListScreen from './src/screens/ProfessionalsListScreen';
import ProfessionalDetailScreen from './src/screens/ProfessionalDetailScreen';
import CreateRequestScreen from './src/screens/CreateRequestScreen';
import ServiceInProgressScreen from './src/screens/ServiceInProgressScreen';
import MyServicesScreen from './src/screens/MyServicesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import TermsScreen from './src/screens/TermsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Chambitas' }}
      />
      <Stack.Screen
        name="ProfessionalsList"
        component={ProfessionalsListScreen}
        options={({ route }) => ({
          title: route.params?.categoryName || 'Profesionales',
        })}
      />
      <Stack.Screen
        name="ProfessionalDetail"
        component={ProfessionalDetailScreen}
        options={{ title: 'Detalle' }}
      />
      <Stack.Screen
        name="CreateRequest"
        component={CreateRequestScreen}
        options={{ title: 'Solicitar servicio' }}
      />
      <Stack.Screen
        name="ServiceInProgress"
        component={ServiceInProgressScreen}
        options={{ title: 'Servicio en curso' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar perfil' }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: 'Privacidad' }}
      />

      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{ title: 'Términos' }}
      />
    </Stack.Navigator>
    
  );
}

function MyServicesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyServicesMain"
        component={MyServicesScreen}
        options={{ title: 'Mis servicios' }}
      />
      <Stack.Screen
        name="ServiceInProgressFromList"
        component={ServiceInProgressScreen}
        options={{ title: 'Detalle de servicio' }}
      />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen
        name="MyServicesTab"
        component={MyServicesStack}
        options={{
          tabBarLabel: 'Mis servicios',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAppContext();

  if (isLoading) {
    return null; 
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppTabs />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
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
