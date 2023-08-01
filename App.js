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
import ProfilePagePolice from './Screens/ProfilePagePolice'
import BottomTabs from './Screens/BottomTabs'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminVerify from './Screens/AdminVerify'
import AdminCreateAccount from './Screens/AdminCreateAccount'
import BottomTabsAdmin from './Screens/BottomTabsAdmin'
import BottomTabsPolice from './Screens/BottomTabsPolice'
import CitizenVerification from './Screens/CitizenVerification'
import AdminVerifyProof from './Screens/AdminVerifyProof'
import ProfilePageChange from './Screens/ProfilePageChange'
import ViewReports from './Screens/ViewReports'
import ViewComplaints from './Screens/ViewComplaints'
import ViewReportsPolice from './Screens/ViewReportsPolice'
import ViewComplaintsPolice from './Screens/ViewComplaintsPolice'
import ViewReportsAdmin from './Screens/ViewReportsAdmin'
import ViewComplaintsAdmin from './Screens/ViewComplaintsAdmin'
import SOS from './Screens/SOS'
import ViewSOS from './Screens/ViewSOS'
import AdminRegisterPolice from './Screens/AdminRegisterPolice'
import ViewReportDetails from './Screens/ViewReportDetails'
import ViewReportDetailsPolice from './Screens/ViewReportDetailsPolice'
import ViewReportDetailsAdmin from './Screens/ViewReportDetailsAdmin'
import ViewComplaintDetails from './Screens/ViewComplaintDetails'
import ViewComplaintDetailsPolice from './Screens/ViewComplaintDetailsPolice'
import ViewComplaintDetailsAdmin from './Screens/ViewComplaintDetailsAdmin'
import PoliceHomepage from './Screens/PoliceHomepage'


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
         name="BottomTabsPolice"
         component={BottomTabsPolice}
         options={{ headerShown: false }}
         />
        <Stack.Screen
         name="LoginForm"
         component={LoginForm}
         />
         <Stack.Screen
         name="AdminCreateAccount"
         component={AdminCreateAccount}
         
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
         name="View Report Details Police"
         component={ViewReportDetailsPolice}
         options={{
          title: 'View Report Details Police',
          headerStyle: {
            backgroundColor: '#FE0000',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center', 
        }}
         />
         <Stack.Screen
         name="View Report Details Admin"
         component={ViewReportDetailsAdmin}
         options={{
          title: 'View Report Details Admin',
          headerStyle: {
            backgroundColor: '#FE0000',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center', 
        }}
         />
         <Stack.Screen
          name="View Complaint Details"
          component={ViewComplaintDetails}
          options={{
            title: 'View Complaint Details',
            headerStyle: {
              backgroundColor: '#FE0000',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center', 
          }}
        />
        <Stack.Screen
          name="View Complaint Details Police"
          component={ViewComplaintDetailsPolice}
          options={{
            title: 'View Complaint Details Police',
            headerStyle: {
              backgroundColor: '#FE0000',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center', 
          }}
        />
        <Stack.Screen
          name="View Complaint Details Admin"
          component={ViewComplaintDetailsAdmin}
          options={{
            title: 'View Complaint Details Admin',
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
         name="AdminRegisterPolice"
         component={AdminRegisterPolice}
         options={{
          title: 'Create Police Account',
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
         name="PoliceHomepage"
         component={PoliceHomepage}
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
          name="ViewComplaints"
          component={ViewComplaints}
          options={{
            title: 'View Complaints',
            headerStyle: {
              backgroundColor: '#FE0000',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center', 
          }}
        />
         <Stack.Screen
         name="ViewReportsPolice"
         component={ViewReportsPolice}
         options={{
          title: 'View Reports Police',
          headerStyle: {
            backgroundColor: '#FE0000',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center', 
        }}
         />
         <Stack.Screen
         name="ViewComplaintsPolice"
         component={ViewComplaintsPolice}
         options={{
          title: 'View Complaints Police',
          headerStyle: {
            backgroundColor: '#FE0000',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center', 
        }}
         />
         <Stack.Screen
         name="ViewReportsAdmin"
         component={ViewReportsAdmin}
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
         name="ViewComplaintsAdmin"
         component={ViewComplaintsAdmin}
         options={{
          title: 'View Complaints Admin',
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
         name="Profile Page Police"
         component={ProfilePagePolice}
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
         name="View SOS Police"
         component={ViewSOS}
         options={{
          title: 'View SOS Police',
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