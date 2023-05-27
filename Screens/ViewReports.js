import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut, onAuthStateChanged  } from '@firebase/auth';
import { collection, doc, onSnapshot, getFirestore,updateDoc } from '@firebase/firestore';
const ViewReports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

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

  useFocusEffect(
    React.useCallback(() => {
      setIsModalOpen(false);
    }, [])
  );

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  const handleButton = () => {
    navigation.navigate('Report Crime');
  };

  return (
    <View className="flex-1">
      <View style={{ position: 'absolute', right: 6, bottom: 12, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          style={{ backgroundColor: '#EF4444', height: 60, width: 60, justifyContent: 'center', alignItems: 'center', borderRadius: 30 }}
          onPress={() => setIsModalOpen(true)}
        >
          <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalOpen} transparent={true} animationType='slide'>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 16, marginHorizontal: 16, marginBottom: 16 }}>
            <TouchableOpacity onPress={() => setIsModalOpen(false)} style={{ alignItems: 'flex-end' }}>
              <Ionicons name="ios-close-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleButton}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Report Crime</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ViewReports;