import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { getFirestore, collection, onSnapshot, getDocs, query, where,updateDoc } from '@firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

const ViewSOSPolice = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [emergencies, setEmergencies] = useState([]); 

  const navigation = useNavigation();

  const fetchEmergencies = () => {
    const db = getFirestore();
    const emergenciesRef = collection(db, 'Emergencies');

    const unsubscribeEmergencies = onSnapshot(emergenciesRef, (snapshot) => {
      const emergenciesData = snapshot.docs.map((doc) => doc.data());
      setEmergencies(emergenciesData);
    });

    return () => {
      unsubscribeEmergencies();
    };
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(user);
        fetchEmergencies();
      } else {
        setUserData(null);
        setEmergencies([]);
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
  const handleClick = (emergency) => {
    navigation.navigate('View SOS Details Police', { emergency });
  };
  const getMinutesAgo = (timestamp) => {
    if (!timestamp) return null;
  
    const now = new Date();
    const reportTime = new Date(timestamp);
  
    // Calculate the difference in milliseconds between the current time and the report time
    const timeDiff = now.getTime() - reportTime.getTime();
  
    // Convert the time difference to minutes
    const minutesAgo = Math.floor(timeDiff / (1000 * 60));
  
    // Convert to human-readable format
    if (minutesAgo < 60) {
      return `${minutesAgo} minutes ago`;
    } else if (minutesAgo >= 60 && minutesAgo < 1440) {
      const hoursAgo = Math.floor(minutesAgo / 60);
      return `${hoursAgo} hr ago`;
    } else {
      const daysAgo = Math.floor(minutesAgo / 1440);
      return `${daysAgo} days ago`;
    }
  };
  const handleCancelButtonPress = (emergencyId) => {
    Alert.alert(
      'Cancel Emergency',
      'Are you sure you want to cancel the emergency?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm ',
          style: 'destructive',
          onPress: () => updateComplaintStatus(emergencyId),
        },
      ],
    );
  };
  const updateComplaintStatus = async (transactionSosId) => {
    try {
      const db = getFirestore();
      const complaintsRef = collection(db, 'Emergencies');
      const querySnapshot = await getDocs(query(complaintsRef, where('transactionSosId', '==', transactionSosId.toString())));
  
      if (querySnapshot.empty) {
        console.log('Document not found');
        return;
      }
  
      const complaintDoc = querySnapshot.docs[0];
  
      // Update the status field to "Cancel"
      await updateDoc(complaintDoc.ref, { status: 'Cancelled' });
  
      console.log('Complaint status updated to "Cancel" successfully');
    } catch (error) {
      console.log('Error updating complaint status:', error);
    }
  };
  return (
    <View className="flex-1">
      {emergencies.map((emergency) => (
        <View key={emergency.transactionSosId} className="flex flex-col mt-5 ">
          <TouchableOpacity onPress={() => handleClick(emergency)}>
            <View style={styles.emergencyContainer}>
              <Text style={styles.emergencyHeader}>{emergency.userFirstName}</Text>
              <TouchableOpacity onPress={() => handleCancelButtonPress(emergency.transactionSosId)}>
              <Text style={{
                fontSize: 25,
              fontWeight: 'bold',
              position: 'absolute',
              right: 10,
              color: 'red',
              transform: [{ translateY: -30 }], }}>X</Text>
            </TouchableOpacity>
              <Text style={styles.normalText}>{emergency.type}</Text>
              <View>
                <Text style={styles.emergencyId}>#EMERGENCY_{emergency.transactionSosId}</Text>
              </View>
              {emergency.timestamp && (
                <Text style={styles.normalText}>{getMinutesAgo(emergency.timestamp)}</Text>
              )}
              <Text
                style={[
                  styles.statusText,
                  { backgroundColor: emergency.status === 'Pending' ? 'orange' : 'white' },
                ]}
              >
                {emergency.status}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  emergencyContainer: {
    backgroundColor: 'white',
    height: 120,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 8,
  },
  emergencyHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emergencyTimestamp: {
    marginLeft: 8,
  },
  emergencyId: {
    fontSize: 18,
    marginLeft: 8,
    color: 'red',
  },
  normalText: {
    marginLeft: 8,
    fontSize: 16,
  },
  statusText: {
    position: 'absolute',
    top: '50%',
    right: 8,
    transform: [{ translateY: -8 }],
    padding: 8,
    borderRadius: 4,
    zIndex: 1,
  },
});

export default ViewSOSPolice;