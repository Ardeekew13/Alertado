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
          <View className="mb-2 items-center justify-center">
            <Image className="w-[150] h-[150]" source={{ uri: user.selfiePicture }} />
            <Text className="text-2xl font-bold mt-4">{user.name}</Text>
            <Text className="text-l mt-2">{user.role}</Text>
            <Text className="text-l mt-2">{user.email}</Text>
            <Text className="text-l mt-2">{user.status}</Text>
            <Text className="text-xl font-bold mt-4">Proof of Identity</Text>
            <Text className="text-xl font-bold mt-4">ID</Text>
            <Image className="w-[200] h-[200]" source={{ uri: user.idPicture }} />
            <Text className="text-xl font-bold mt-4">Selfie</Text>
            <Image className="w-[200] h-[200]" source={{ uri: user.selfiePicture }} />
            <View className="flex-row mt-6">
              <TouchableOpacity className="text-center justify-end mr-20" onPress={() => handleCheckUser(user.id)} >
                <AntDesign name="checkcircle" size={40} color="green" />
              </TouchableOpacity>
              <TouchableOpacity className="text-center justify-end">
                <AntDesign name="closecircle" size={40} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
};
  
export default AdminVerifyProof;