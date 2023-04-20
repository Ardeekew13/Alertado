import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/core';
import ReportCrime from './ReportCrime'
import { SafeAreaView } from 'react-native-safe-area-context'
 
const HomePage =({userData})=>{
  const navigation=useNavigation()
const CrimeNav = () => {
  navigation.navigate('Report Crime');
};
  return (
    <SafeAreaView className="flex-1">
    <View className="flex-1 my-auto items-center justify-center ">
    <TouchableOpacity
    className="w-56 mt-4 px-4 py-3 rounded-lg bg-red-700 items-center mx-auto"
    onPress={CrimeNav}
    >
    <Text className="text-white text-lg font-medium mx-auto">Report A Crime</Text>
        </TouchableOpacity>
        <TouchableOpacity
    className="w-56 mt-4 px-4 py-3 rounded-lg bg-red-700 items-center mx-auto"
    
    >
    <Text className="text-white text-lg font-medium mx-auto">File Complaint</Text>
        </TouchableOpacity>
        <TouchableOpacity
    className="w-56 mt-4 px-4 py-3 rounded-lg bg-red-700 items-center mx-auto"
    
    >
    <Text className="text-white text-lg font-medium mx-auto">SEND SOS</Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView>
  )
};
export default HomePage;