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
      const unverifiedUsersQuery = query(usersCollection, where('status', '==', 'Pending'));
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
      <SafeAreaView className="mt-14">
      <ScrollView>
        <View>
          <Text className="text-xl font-bold mx-auto mb-4">Verify Users</Text>
          {users.map(user => (
            <View key={user.id} className="flex flex-col">
            <TouchableOpacity onPress={() => handleClick(user)}>
                <ImageBackground className="list-item mb-2 h-28 mx-2" source={require('./images/banner.png')}>
                  <View className="flex-1 flex-row">
                    <Image className="w-20 h-20 mx-4 my-4 rounded-full" source={{ uri: user.selfiePicture }} />
                    <Text className="text-lg text-white mt-10 h-10 text-center justify-center mx-auto">{user.name}</Text>
                    <Text className="text-lg text-white mt-10 h-10 text-center justify-center mx-auto">{user.role}</Text>
                  </View>
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