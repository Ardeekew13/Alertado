import { View, Text,Image, ImageBackground, TouchableOpacity, Touchable} from 'react-native'
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot,doc,updateDoc } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons'; 

import { SafeAreaView } from 'react-native-safe-area-context';



const AdminVerify = () => {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      const db = getFirestore();
      const usersCollection = collection(db, 'User');
      const unverifiedUsersQuery = query(usersCollection, where('status', '==', 'Unverified'));
      const unsubscribe = onSnapshot(unverifiedUsersQuery, querySnapshot => {
        const users = [];
  
        querySnapshot.forEach(documentSnapshot => {
          const user = documentSnapshot.data();
          user.id = documentSnapshot.id;
          users.push(user);
        });
  
        setUsers(users);
      });
  
      return () => unsubscribe();
    }, []);
    const handleCheckUser = async userId => {
      const db = getFirestore();
      const userRef = doc(db, 'User', userId);
  
      await updateDoc(userRef, { status: 'Verified' });
    };
    return (
        <SafeAreaView className="mt-14">
      <View className="flex-col">
      <Text className="text-xl font-bold mx-auto mb-4">Verify Users</Text>
      
      
      
      {users.map(user => (
        
        <ImageBackground key={user.id} className="list-item mb-2 h-32 ml-2 mr-2"  source={require('./images/userbanner.png')}>
        <View className="flex-col">
        <Text className="text-lg text-white w-11/12 mt-10 h-10 ml-5 text-center justify-center items-end" > {user.name} </Text>
          <View className="flex-row justify-end mr-5">
        <TouchableOpacity className="text-center justify-end mr-5" onPress={() => handleCheckUser(user.id)} >
          <AntDesign name="checkcircle" size={28} color="green" />
          </TouchableOpacity>
          <TouchableOpacity className="text-center justify-end">
          <AntDesign name="closecircle" size={28} color="red" />
          </TouchableOpacity>
          </View>
          </View>
          </ImageBackground>
          
          ))}
       
      </View>
      </SafeAreaView>
    );
  };
  
  export default AdminVerify;