import { View, Text,Image, ImageBackground, TouchableOpacity, Touchable,ScrollView} from 'react-native'
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot,doc,updateDoc } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';



const AdminVerify = () => {
    const [users, setUsers] = useState([]);
    const navigation=useNavigation()
    useEffect(() => {
      const db = getFirestore();
      const usersCollection = collection(db, 'User');
      const unverifiedUsersQuery = query(usersCollection, where('status', '==', 'Pending',));
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
   
    const handleClick = (user)=>{
      navigation.navigate('AdminVerifyProof',{user});
    };
    return (
      <SafeAreaView className="mt-1">
      <ScrollView>
        <View>
          {users.map(user => (
            <View key={user.id} className="flex flex-col bg-white m-3 rounded-lg">
            <TouchableOpacity onPress={() => handleClick(user)}>
                <ImageBackground className="list-item mb-2 h-28 mx-2">
                <View className="flex-1 flex-row">
      <Image className="w-20 h-20 mx-4 my-4 rounded-full" source={{ uri: user.selfiePicture }}/>
      <View className="flex-1 flex-col justify-between m-2">
        
        <Text className="justify-center text-lg font-bold">{user.Lname}, {user.Fname}</Text>
        <Text className="justify-center">{user.role}</Text>
        <Text className="justify-center">Account Status: <Text style={{fontWeight:'bold'}}>{user.status}</Text></Text>
      </View>
      </View>

      <View className="border-0.5 mx-5"></View>
              </ImageBackground>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  
    );
  };
  
  export default AdminVerify;