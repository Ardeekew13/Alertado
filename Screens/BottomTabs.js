import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './HomePage';
import SubPage from './ReportCrime'
import ProfilePage from './ProfilePage';
import { Entypo } from '@expo/vector-icons'; 
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';
import FileComplaint from './FileComplaint';
import ReportCrime from './ReportCrime';
import AdminVerify from './AdminVerify';




const Tab = createBottomTabNavigator();
function BottomTabs(){
  return (
      <Tab.Navigator screenOptions={ {headerShown:false}}>
      <Tab.Screen name="Home Page" component={HomePage} options=
      {{tabBarIcon:({color,size}) =>(<Entypo name="home" size={24} color="black" />)}}/>
      <Tab.Screen name="Report Crime" component={ReportCrime} options=
      {{tabBarIcon:({color,size}) =>(<FontAwesome name="file" size={24} color="black" />)}}/>
      <Tab.Screen name="File Complaint" component={FileComplaint} options=
      {{tabBarIcon:({color,size}) =>(<Ionicons name="notifications" size={24} color="black" />)}}/>
      <Tab.Screen name="Profile Page" component={ProfilePage} options=
      {{tabBarIcon:({color,size}) =>(<FontAwesome name="user" size={24} color="black" />)}}/>
     </Tab.Navigator>
  );
}
export default BottomTabs;