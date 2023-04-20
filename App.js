import { View, Text } from 'react-native'
import React from 'react'
import RegistrationForm from './Screens/RegistrationForm'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginForm from './Screens/LoginForm'
import HomePage from './Screens/HomePage'
import ReportCrime from './Screens/ReportCrime'
import FileComplaint from './Screens/FileComplaint'
import ProfilePage from './Screens/ProfilePage'
import BottomTabs from './Screens/BottomTabs'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminVerify from './Screens/AdminVerify'
import BottomTabsAdmin from './Screens/BottomTabsAdmin'

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='LoginForm'>
      <Stack.Screen options={{headerShown: false}}
        name='BottomTabs'
        component={BottomTabs}
        />
        <Stack.Screen
         name="BottomTabsAdmin"
         component={BottomTabsAdmin}
         options={{ headerShown: false }}
         />
        <Stack.Screen
         name="LoginForm"
         component={LoginForm}
         />
         <Stack.Screen
         name="RegistrationForm"
         component={RegistrationForm}
         />
         <Stack.Screen
         name="HomePage"
         component={HomePage}
         />
         <Stack.Screen
         name="Profile"
         component={ProfilePage}
         />
         <Stack.Screen
         name="ReportCrime"
         component={ReportCrime}
         />
         <Stack.Screen
         name="AdminVerify"
         component={AdminVerify}
         />
         
      </Stack.Navigator>
     
    </NavigationContainer>
  )
}