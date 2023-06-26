import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/core';
import ReportCrime from './ReportCrime'
import { View, Text, Image, Button, TouchableOpacity,TextInput, Alert, Modal, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, doc, onSnapshot, getFirestore,updateDoc,getDoc } from '@firebase/firestore';
import { getAuth, signOut, onAuthStateChanged  } from '@firebase/auth';
import { ref,getDownloadURL, uploadBytes,storageRef,getStorage ,uploadStrings} from 'firebase/storage';
import firebaseConfig from '../firebaseConfig';

const barangays = [
  "Alegria",
  "Bicao",
  "Buenavista",
  "Buenos Aires",
  "Calatrava",
  "El Progreso",
  "El Salvador",
  "Guadalupe",
  "Katipunan",
  "La Libertad",
  "La Paz",
  "La Salvacion",
  "La Victoria",
  "Matin-ao",
  "Montehermoso",
  "Montesuerte",
  "Montesunting",
  "Montevideo",
  "Nueva Fuerza",
  "Nueva Vida Este",
  "Nueva Vida Norte",
  "Nueva Vida Sur",
  "Poblacion Norte",
  "Poblacion Sur",
  "Tambo-an",
  "Vallehermoso",
  "Villaflor",
  "Villafuerte",
  "Villacayo",
];
const storage = getStorage(firebaseConfig);
const auth = getAuth();
let currentUser = null;
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});
const HomePage =()=>{
  const [userData, setUserData] = useState(null);
  const [barangayCounts, setBarangayCounts] = useState({});
  const navigation=useNavigation()
  useEffect(() => {
    const fetchBarangayCounts = async () => {
      // Fetch the initial counts from Firestore
      const db = getFirestore();
      const countsSnapshot = await getDoc(doc(collection(db, 'barangayCounts')));
      const initialCounts = countsSnapshot.exists() ? countsSnapshot.data() : {};
  
      // Update the local state with the initial counts
      setBarangayCounts(initialCounts);
  
      // Listen for real-time updates on the counts
      const unsubscribeCounts = onSnapshot(collection(db, 'barangayCounts'), (snapshot) => {
        const updatedCounts = {};
        snapshot.forEach((doc) => {
          updatedCounts[doc.id] = doc.data().count;
        });
        setBarangayCounts(updatedCounts);
      });
  
      // Clean up the counts listener on unmount
      return () => unsubscribeCounts();
    };
  
    const currentUser = getAuth().currentUser;
    const db = getFirestore();
    const userRef = doc(db, 'User', currentUser.uid);
  
    const unsubscribeUser = onSnapshot(userRef, (doc) => {
      const data = doc.data();
      setUserData(data);
    });
  
    // Fetch the barangay counts and listen for user updates
    fetchBarangayCounts();
  
    // Clean up the user listener on unmount
    return () => unsubscribeUser();
  }, []);
  
  if (!userData) {
    return <Text>Loading...</Text>;
  }
  return (
    <ScrollView>
      <SafeAreaView className="flex-1">
      <View className="flex-row justify-start items-center">
        <Text className="mx-4 text-lg font-light">Hello,</Text>
        <Text className="text-[#EF4444] font-bold text-lg">{userData.Fname} {userData.Lname}</Text>
      </View>
      <View className="mx-4">
           <Text className="text-[#817E7E] text-md">Check your activities in this dashboard</Text>
      </View>
      <View className="m-5 bg-white rounded-md p-5">
        <Text className ="font-bold text-base ">0</Text>
        <Text className ="font-bold text-base">Crime</Text>
      </View>
      <View className="mx-5 bg-white p-5 rounded-md">
        <Text className ="font-bold text-base">0</Text>
        <Text className ="font-bold text-base">Emergency</Text>
      </View>
      <View className="m-5 bg-white p-5 rounded-md">
        <Text className ="font-bold text-base">0</Text>
        <Text className ="font-bold text-base">Complaint</Text>
      </View>
      <View className="border-0.5 mx-5"></View>
      <Text className="mx-5 text-xl text-center">Reports by Location (Barangays)</Text>
      <View className="border-0.5 mx-5 mb-5"></View>
      <View>
      {barangays.map((barangay, index) => {
        const barangayData = barangayCounts[barangay];
        const count = barangayCounts[barangay] || 0;
        return (
          <View className="mx-5 bg-white p-4 mb-3 rounded-md" key={index}>
          <View className="flex flex-row justify-between ">
            <Text className="font-bold">{barangay}</Text>
            <Text className="text-right font-bold">{count}</Text>
          </View>
          </View>
        );
      })}
</View>
    </SafeAreaView>
    </ScrollView>
    
  )
};
export default HomePage;
