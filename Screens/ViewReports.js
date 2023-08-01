import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ImageBackground, ScrollView, Alert} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { collection, query, where, onSnapshot, getFirestore, updateDoc, doc, deleteDoc, getDocs, getDoc, setDoc } from '@firebase/firestore';
import { formatDistanceToNow } from 'date-fns';


const ViewReports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [reports, setReports] = useState([]);

  const navigation = useNavigation();

  const fetchUserReports = (userId) => {
    const db = getFirestore();
    const reportsRef = collection(db, 'Reports');
    const userReportsQuery = query(reportsRef, where('userId', '==', userId));

    const unsubscribeReports = onSnapshot(userReportsQuery, (snapshot) => {
      const reportsData = snapshot.docs.map((doc) => doc.data());
      setReports(reportsData);
    });

    return () => {
      unsubscribeReports();
    };
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(user);
        fetchUserReports(user.uid);
      } else {
        setUserData(null);
        setReports([]);
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
    navigation.navigate('Report Crime');
  };
  const handleClick = (report) => {
    navigation.navigate('View Report Details',{report});
  };
  const handleDeleteButtonPress = (reportId) => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete the report?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteReport(reportId),
        },
      ],
    );
  };
  const deleteReport = async (transactionId) => {
    try {
      const db = getFirestore();
      const reportsRef = collection(db, 'Reports');
      const querySnapshot = await getDocs(query(reportsRef, where('transactionId', '==', transactionId.toString())));
  
      if (querySnapshot.empty) {
        console.log('Document not found');
        return;
      }
  
      const reportDoc = querySnapshot.docs[0];
      const reportData = reportDoc.data();
      const location = reportData.barangay;
  
      // Delete the report document
      await deleteDoc(reportDoc.ref);
      console.log('Report deleted successfully');
  
      // Fetch the updated reports after deletion
      fetchUserReports(userData.uid);
  
      // Update the count in the barangayCounts collection
      const barangayCountsRef = doc(db, 'barangayCounts', location);
      const barangaySnapshot = await getDoc(barangayCountsRef);
      if (barangaySnapshot.exists()) {
        const currentCount = barangaySnapshot.data().count;
  
        // Update the count by subtracting 1
        await setDoc(barangayCountsRef, { count: currentCount - 1 }, { merge: true });
        console.log('Count updated successfully');
      }
    } catch (error) {
      console.log('Error deleting report:', error);
    }
  };
  return (
 
    <View className="flex-1">
    <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex:1 }}>
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
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Report Crime</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

  {reports.map((report) => (
    <View key={report.transactionId} className="flex flex-col mt-5">
      <TouchableOpacity onPress={() => handleClick(report)}>
        <View className="bg-white h-28 mx-4 rounded-lg">
          <Text className="text-lg font-bold ml-2">{report.name}</Text>
          <TouchableOpacity onPress={() => handleDeleteButtonPress(report.transactionId)}>
          <Text style={{
          fontWeight: 'bold',
          position: 'absolute',
          right: 10,
          color: 'red',
          fontSize: 20,
          transform: [{ translateY: -30 }], }}>X</Text>
        </TouchableOpacity>
          <Text className="ml-2">{report.date}</Text>
          <View>
            <Text className="ml-2">
              {report.barangay}, {report.street}
            </Text>
            <Text className="text-lg ml-2 text-red-500">#REPORT_{report.transactionId}</Text>
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

export default ViewReports;