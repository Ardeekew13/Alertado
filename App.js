import { View, Text } from 'react-native'
import React from 'react'
import RegistrationForm from './Screens/RegistrationForm'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginForm from './Screens/LoginForm'
import HomePage from './Screens/HomePage'
import SubPage from './Screens/SubPage'

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
         name="SubPage"
         component={SubPage}
         />
         
      </Stack.Navigator>
    </NavigationContainer>
  )
}