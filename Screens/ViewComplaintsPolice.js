import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { collection, query, onSnapshot, getFirestore } from '@firebase/firestore';

const ViewComplaintsPolice = () => {
  const [userData, setUserData] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const navigation = useNavigation();

  const fetchAllComplaints = () => {
    const db = getFirestore();
    const complaintsRef = collection(db, 'Complaints');
    const allComplaintsQuery = query(complaintsRef);

    const unsubscribeComplaints = onSnapshot(allComplaintsQuery, (snapshot) => {
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
        fetchAllComplaints();
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
      // Additional cleanup if needed
    }, [])
  );

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  const handleClick = (complaint) => {
    navigation.navigate('View Complaint Details Police', { complaint });
  };

  return (
    <View className="flex-1">
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
                  backgroundColor: complaint.status === 'Pending' ? 'orange' : 'white',
                  padding: 8,
                  borderRadius: 4,
                  zIndex: 1,
                }}
              >
                {complaint.status}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default ViewComplaintsPolice;