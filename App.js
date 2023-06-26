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
import CitizenVerification from './Screens/CitizenVerification'
import AdminVerifyProof from './Screens/AdminVerifyProof'
import ProfilePageChange from './Screens/ProfilePageChange'
import ViewReports from './Screens/ViewReports'
import SOS from './Screens/SOS'
import ViewReportDetails from './Screens/ViewReportDetails'

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='LoginForm'>
      <Stack.Screen
        name='BottomTabs'
        component={BottomTabs}
        options={{
          headerShown: false
        }}
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
         options={{
          title: 'Sign up',
          headerStyle: {
            backgroundColor: '#FE0000',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center', 
        }}
         />
         <Stack.Screen
         name="Profile PageChange"
         component={ProfilePageChange}
         options={{
          title: 'Edit Profile',
          headerStyle: {
            backgroundColor: '#FE0000',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center', 
        }}
         />
         <Stack.Screen
         name="HomePage"
         component={HomePage}
         options={{
          title: 'Dashboard',
          headerStyle: {
            backgroundColor: '#FE0000',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center', 
        }}
         />
         <Stack.Screen
         name="ViewReports"
         component={ViewReports}
         options={{
          title: 'View Reports',
          headerStyle: {
            backgroundColor: '#FE0000',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center', 
        }}
         />
         <Stack.Screen
         name="View Report Details"
         component={ViewReportDetails}
         options={{
          title: 'View Report Details',
          headerStyle: {
            backgroundColor: '#FE0000',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center', 
        }}
         />
         <Stack.Screen
         name="Profile"
         component={ProfilePage}
         />
         <Stack.Screen
         name="Report Crime"
         component={ReportCrime}
         options={{
          title: 'Report Crime',
          headerStyle: {
            backgroundColor: '#FE0000',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center', 
        }}
         />
         <Stack.Screen
         name="File Complaint"
         component={FileComplaint}
         options={{
          title: 'File Complaint',
          headerStyle: {
            backgroundColor: '#FE0000',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center', 
        }}
         />
         <Stack.Screen
         name="Send SOS"
         component={SOS}
         options={{
          title: 'Send SOS',
          headerStyle: {
            backgroundColor: '#FE0000',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center', 
        }}
         />
         <Stack.Screen
         name="AdminVerify"
         component={AdminVerify}
         />
         <Stack.Screen
         name="Citizen Verification"
         component={CitizenVerification}
         options={{ headerShown: false }}
         />
         <Stack.Screen
         name="AdminVerifyProof"
         component={AdminVerifyProof}
         />
         
         
      </Stack.Navigator>
     
    </NavigationContainer>
  )
}