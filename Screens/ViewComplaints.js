import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { collection, query, where, onSnapshot, getFirestore } from '@firebase/firestore';


const ViewComplaints = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const navigation = useNavigation();

  const fetchUserComplaints = (userId) => {
    const db = getFirestore();
    const complaintsRef = collection(db, 'Complaints');
    const userComplaintsQuery = query(complaintsRef, where('userId', '==', userId));

    const unsubscribeReports = onSnapshot(userComplaintsQuery, (snapshot) => {
      const complaintsData = snapshot.docs.map((doc) => doc.data());
      setComplaints(complaintsData);
    });

    return () => {
      unsubscribeComplaints();
    };
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(user);
        fetchUserComplaints(user.uid);
      } else {
        setUserData(null);
        setComplaints([]);
      }
    });

    return () => {
      unsubscribeAuth();
    };
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
    navigation.navigate('File Complaint');
  };
  const handleClick = (complaint) => {
    navigation.navigate('View Complaint Details',{complaint});
  };



  return (
    <View className="flex-1">
    <View className="absolute right-4 bottom-4 justify-center items-center">
      <TouchableOpacity
        style={{
          backgroundColor: '#EF4444',
          height: 60,
          width: 60,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 30,
        }}
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
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>File Complaint</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

  {complaints.map((complaint) => (
    <View key={complaint.id} className="flex flex-col mt-5">
      <TouchableOpacity onPress={() => handleClick(complaint)}>
        <View className="bg-white h-28 mx-4 rounded-lg">
          <Text className="text-lg font-bold ml-2">{complaint.name}</Text>
          <Text className="ml-2">{complaint.date}</Text>
          <View>
            <Text className="ml-2">
              {complaint.barangay}, {complaint.street}
            </Text>
            <Text className="text-lg ml-2 text-red-500">#Complaints_{complaint.transactionId}</Text>
          </View>
          <Text
            style={{
              position: 'absolute',
              top: '50%',
              right: 8,
              transform: [{ translateY: -8 }],
              backgroundColor: report.status === 'Pending' ? 'orange' : 'white',
              padding: 8,
              borderRadius: 4,
              zIndex: 1,
            }}
          >
            {report.status}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  ))}
</View>
  );
};

export default ViewComplaints;