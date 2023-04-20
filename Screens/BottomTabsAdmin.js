import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminHomepage from './AdminHomepage';
import { Entypo } from '@expo/vector-icons'; 
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';
import AdminVerify from './AdminVerify';




const Tab = createBottomTabNavigator();
function BottomTabsAdmin(){
  return (
      <Tab.Navigator screenOptions={ {headerShown:false}}>
      <Tab.Screen name="Home Page" component={AdminHomepage} options=
      {{tabBarIcon:({color,size}) =>(<Entypo name="home" size={24} color="black" />)}}/>
      <Tab.Screen name="Verify" component={AdminVerify} options=
      {{tabBarIcon:({color,size}) =>(<Entypo name="user" size={24} color="black" />)}}/>
     </Tab.Navigator>
  );
}
export default BottomTabsAdmin;