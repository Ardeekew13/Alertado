import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, TouchableOpacity} from 'react-native';
import { collection, doc, onSnapshot, getFirestore } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    const db = getFirestore();
    const userRef = doc(db, 'User', currentUser.uid);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      const data = doc.data();
      setUserData(data);
    });

    return unsubscribe;
  }, []);

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView>
    <View className="flex">
    <Image
        className="w-45 h-72 mb-3 items-center justify-center mx-auto"
        source={require('./images/user.jpg')}
      />
      <View className="flex mx-auto mb-4">
      <Text className=" text-xl">Name: {userData.name}</Text>
      <Text className=" text-xl">Email: {userData.email}</Text>
      <Text className=" text-xl">Role: {userData.role}</Text>
      <Text className=" text-xl">Status: {userData.status}</Text>
      </View>
      <TouchableOpacity
          className="w-11/12 mt-4 px-6 py-3 rounded-lg bg-red-700 items-center mx-auto"  
        >
          <Text className="text-white text-lg font-medium mx-auto">Verify your account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="w-11/12 mt-4 px-4 py-3 rounded-lg bg-red-700 items-center mx-auto"
        >
          <Text className="text-white text-lg font-medium mx-auto">Update Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-11/12 mt-4 px-4 py-3 rounded-lg bg-red-700 items-center mx-auto"
        >
          <Text className="text-white text-lg font-medium mx-auto">Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-11/12 mt-4 px-4 py-3 rounded-lg bg-red-700 items-center mx-auto"
        >
          <Text className="text-white text-lg font-medium mx-auto">Sign Out</Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView> 
  );
};

export default Profile;