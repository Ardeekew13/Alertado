import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminHomepage from './AdminHomepage';
import { Entypo } from '@expo/vector-icons'; 
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import AdminVerify from './AdminVerify';
import AdminCreateAccount from './AdminCreateAccount';
import ViewSOSAdmin from './ViewSOSAdmin';




const Tab = createBottomTabNavigator();
function BottomTabsAdmin(){
  return (
    <Tab.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#FE0000',
      },
      headerTitleStyle: {
        color: '#fff',
      },
      headerTitleAlign: 'center',
      tabBarLabelStyle: {
        color: '#fff',
      },
      tabBarActiveTintColor: '#FF0000',
      tabBarLabelPosition: 'below-icon',
    }}
  >
    <Tab.Screen
      name="Home Page"
      component={AdminHomepage}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Entypo name="home" size={24} color="black" />
        ),
      }}
    />
    <Tab.Screen
      name="Verify Users"
      component={AdminVerify}
      options={{
        tabBarLabel: 'Verify',
        tabBarIcon: ({ color, size }) => (
          <Entypo name="user" size={24} color="black" />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={AdminCreateAccount}
      options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings" size={24} color="black" />
        ),
      }}
    />
    <Tab.Screen
    name="View SOS"
    component={ViewSOSAdmin}
    options={{
      tabBarLabel: 'SOS',
      tabBarIcon: ({ color, size }) => (
        <Ionicons
          name="notifications-outline"
          size={27}
          color={color}
        />
      ),
    }}
  />
    
  </Tab.Navigator>  
  );
}
export default BottomTabsAdmin;