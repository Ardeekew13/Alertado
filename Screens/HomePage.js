import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/core';
import ReportCrime from './ReportCrime'
import { View, Text, Image, Button, TouchableOpacity,TextInput, Alert, Modal, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { collection, doc, onSnapshot, getFirestore,updateDoc } from '@firebase/firestore';
import { getAuth, signOut, onAuthStateChanged  } from '@firebase/auth';
import { ref,getDownloadURL, uploadBytes,storageRef,getStorage ,uploadStrings} from 'firebase/storage';
import firebaseConfig from '../firebaseConfig';


const storage = getStorage(firebaseConfig);
const auth = getAuth();
let currentUser = null;
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});
const HomePage =()=>{
  const [userData, setUserData] = useState(null);
  const navigation=useNavigation()
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
    <SafeAreaView className="flex-1">
      <View className="flex-row justify-start items-center">
        <Text className="mx-4 text-lg font-light">Hello,</Text>
          <Text className="text-[#EF4444] font-bold text-lg">{userData.Fname} {userData.Lname}</Text>
      </View>
         <View className="mx-4">
           <Text className="text-[#817E7E] text-md">Check your activities in this dashboard</Text>
         </View>
    </SafeAreaView>
  )
};
export default HomePage;