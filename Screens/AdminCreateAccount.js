import { useNavigation } from '@react-navigation/core';
import React from 'react'
import { View, Text, Image, Button, TouchableOpacity,TextInput, Alert, Modal, ScrollView} from 'react-native';
const AdminCreateAccount =()=>{
const navigation=useNavigation();
const handleRegister = () => {
    navigation.navigate('AdminRegisterPolice');
};
  return (
    <ScrollView>
        <View className="mt-2">
          <View className="bg-white m-2 rounded-md">
            <TouchableOpacity onPress={handleRegister}>
                <Text className="text-xl font-bold mx-auto p-4">Register Account</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white m-2 rounded-md">
            <Text className="text-xl font-bold mx-auto p-4">Log Out</Text>
          </View>
        </View>
    </ScrollView>
    
  )
}
  export default AdminCreateAccount;