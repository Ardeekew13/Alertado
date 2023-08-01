import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { getFirestore, collection, onSnapshot } from '@firebase/firestore';
import { formatDistanceToNow } from 'date-fns';


const ViewReportsPolice = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [reports, setReports] = useState([]);

  const navigation = useNavigation();

  const fetchUserReports = () => {
    const db = getFirestore();
    const reportsRef = collection(db, 'Reports');

    const unsubscribeReports = onSnapshot(reportsRef, (snapshot) => {
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
        fetchUserReports();
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
    navigation.navigate('View Report Details', { report });
  };

  return (
    <View className="flex-1">
      {reports.map((report) => (
        <View key={report.id} className="flex flex-col mt-5">
          <TouchableOpacity onPress={() => handleClick(report)}>
            <View className="bg-white h-28 mx-4 rounded-lg">
              <Text className="text-lg font-bold ml-2">{report.name}</Text>
              <Text className="ml-2">{report.date}</Text>
              <View>
                <Text className="ml-2">
                  {report.barangay}, {report.street}
                </Text>
                <Text className="text-lg ml-2 text-red-500">
                  #REPORT_{report.transactionId}
                </Text>
              </View>
              <Text
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 8,
                  transform: [{ translateY: -8 }],
                  backgroundColor:
                    report.status === 'Pending' ? 'orange' : 'white',
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

export default ViewReportsPolice;