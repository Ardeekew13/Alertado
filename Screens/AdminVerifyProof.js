import { View,Alert, Text,Image, ImageBackground, TouchableOpacity, Touchable,ScrollView} from 'react-native'
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, where, onSnapshot,doc,updateDoc } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons'; 


const AdminVerifyProof = ({ route }) => {
    const { user } = route.params;
    const navigation=useNavigation()
    const handleCheckUser = async userId => {
      const db = getFirestore();
      const userRef = doc(db, 'User', userId);
  
      await updateDoc(userRef, { status: 'Verified' });
      Alert.alert('Verification Successful!', 'This user has been verified.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
          style: 'cancel'
        }
      ], { textAlign: 'center' });
    };
  
    return (
      <SafeAreaView>
        <ScrollView>
          <Text className="text-4xl font-bold text-center">Profile</Text>
        <View className="bg-white m-4 flex items-center justify-center rounded-md">
        <View style={{ borderColor: 'gray'}} className="border rounded-full mt-2">
          <Image className="m-2 w-[150] h-[150] rounded-full" source={{ uri: user.selfiePicture }} />
        </View>
          <Text className="text-2xl font-bold">{user.Lname}, {user.Fname}</Text>
          <Text className="text-l">{user.role}</Text>
          <Text className="mb-2 font-bold text-l">email: {user.email}</Text>
        </View>
        <View className="border-0.5 mx-5"></View>
          <Text className="mx-5 text-xl text-center">Proof of Identity</Text>
        <View className="border-0.5 mx-5"></View>
        <View className="flex-row items-center justify-center">
        <View className="m-4">
          <Image className="w-[120] h-[120]" source={{ uri: user.idPicture }} />
          <Text className="text-xl font-bold mx-auto">ID</Text>
        </View>
        <View>
          <Image className="w-[120] h-[120]" source={{ uri: user.selfiePicture }} />
          <Text className="text-xl font-bold mx-auto">Selfie</Text>
        </View>
        </View>
        <View className="flex-row items-center justify-center m-4">
        <TouchableOpacity className="text-center justify-end mr-20" onPress={() => handleCheckUser(user.id)}>
          <AntDesign name="checkcircle" size={40} color="green" />
        </TouchableOpacity>
        <TouchableOpacity className="text-center justify-end">
          <AntDesign name="closecircle" size={40} color="red" />
        </TouchableOpacity>
        </View>

        </ScrollView>
      </SafeAreaView>
    );
};
  
export default AdminVerifyProof;