import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
  ActivityIndicator
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import  MapView, {Marker, Circle } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import firebaseConfig, { db, auth }from '../firebaseConfig';
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { getFirestore, deleteDoc, doc, collection, query, where, getDocs, updateDoc,getDoc,setDoc } from '@firebase/firestore';
 const getTimeAgo = (timestamp) => {
    if (!timestamp) return null;

    const now = new Date();
    const reportTime = new Date(timestamp);

    // Calculate the difference in milliseconds between the current time and the report time
    const timeDiff = now.getTime() - reportTime.getTime();

    // Convert the time difference to seconds, minutes, hours, and days
    const secondsAgo = Math.floor(timeDiff / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);

    return {
        days: daysAgo,
        hours: hoursAgo % 24,
        minutes: minutesAgo % 60,
        seconds: secondsAgo % 60
    };
};
const CustomMarkerImage = () => (
  <Image source={require('./images/SosPIN.png')} style={styles.customMarkerImage} />
);

const ViewSOSDetailsPolice = ({ route }) => {
  const { emergency } = route.params;
  const emergencyId = emergency.id;
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const timeAgo = getTimeAgo(emergency.timestamp);
  const [barangay, setBarangay] = useState(null);
  const [address, setAddress] = useState(null);
  const navigation = useNavigation();
  const circleScale = new Animated.Value(1);
  const [currentUser, setCurrentUser] = useState(null);
  const pingingCircleScale = new Animated.Value(1); // Add this for pinging effect
  const pingingCircleRadius = new Animated.Value(0); // Add this for pinging effect


  useEffect(() => {
    // Initialize Firebase auth
    const auth = getAuth();

    // Set up an authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user);
      } else {
        // User is signed out
        setCurrentUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);
  const onMapReady = () => {
    setMapReady(true);
  };
  const startPulsatingEffect = () => {
    const pulseAnimation = Animated.timing(pingingCircleScale, {
      toValue: 1.2,
      duration: 1000,
      useNativeDriver: false,
    });

    Animated.loop(pulseAnimation).start();
  };

  useEffect(() => {
    if (mapReady && mapRef.current) {
      const region = {
        latitude: emergency.citizenLocation.latitude,
        longitude: emergency.citizenLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current.animateToRegion(region, 1000);
      startPulsatingEffect();
    }
  }, [mapReady, emergency.citizenLocation]);

  useEffect(() => {
    if (mapReady && mapRef.current) {
      const region = {
        latitude: emergency.citizenLocation.latitude,
        longitude: emergency.citizenLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current.animateToRegion(region, 1000);
      startPulsatingEffect();
    }
  }, [mapReady, emergency.citizenLocation]);
  
  useEffect(() => {
  }, []);
  const updateEmergency = async (transactionSosId) => {
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
  
      // Show a success alert
      Alert.alert('Success', 'Emergency status updated to "Cancel" successfully', [
        {
          text: 'OK',
          onPress: () => {
              // Navigate back to the previous screen
              navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.log('Error updating Emergency status:', error);
      // Handle the error here, e.g., show an error message.
    }
  };
  
 
  const getCurrentUserID = () => {
    const user = auth.currentUser; // Get the currently logged-in user
    if (user) {
      // If a user is logged in, return their UID (User ID)
      return user.uid;
    } else {
      // If no user is logged in, return null or handle it as needed
      return null;
    }
  };
  
  const handleClick = async (emergency) => {
    try {
      const db = getFirestore();
      const complaintsRef = collection(db, 'Emergencies');
      const querySnapshot = await getDocs(
        query(complaintsRef, where('transactionSosId', '==', emergency.transactionSosId.toString()))
      );
  
      if (querySnapshot.empty) {
        console.log('Document not found');
        return;
      }
  
      const complaintDoc = querySnapshot.docs[0];
  
  
      // Get the ID of the currently logged-in police officer
      const auth = getAuth();
      const user = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userID = user.uid;
          console.log(userID)
          // Query the "Users" collection to get police officer's additional information
          const userDoc = await getDoc(doc(db, 'User', userID));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Add the policeAssignedID, Fname, Lname, and phone to the Firestore document
            await updateDoc(complaintDoc.ref, {
              policeAssignedID: userID,
              policeFname: userData.Fname,
              policeLname:  userData.Lname,
              policePhone:  userData.phone,
            });
  
            navigation.navigate('Police Accept SOS', {
              userSosLocation: emergency.citizenLocation,
              emergency: emergency,
              transactionSosId: emergency.transactionSosId,
              policeAssignedID:emergency.policeAssignedID,
            });
  

          } else {
            console.log('User document not found.'); // Handle the case when user document is not found
          }
        } else {
          console.log('No user is logged in.'); // Handle the case when no user is logged in
        }
      });
    } catch (error) {
      console.log('Error updating complaint status:', error);
    }
  };
  const handleDeleteButtonPress = (emergencyId) => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to cancel the report?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => updateEmergency(emergencyId),
        },
      ],
    );
  };
  useEffect(() => {
    if (emergency.citizenLocation) {
      // Construct the API URL
      const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${emergency.citizenLocation.latitude}&lon=${emergency.citizenLocation.longitude}&apiKey=ab9f834b500a40bf9c3ed196ee1a0ead`;

      // Make the API request
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          // Extract the formatted address from the response
          const formattedAddress = data.features[0]?.properties?.formatted;
          setAddress(formattedAddress || 'Unknown Address');
        })
        .catch(error => {
          console.error('Error fetching reverse geocoding data:', error);
        });
    }
  }, [emergency.citizenLocation]);
  return (
    <ScrollView style={styles.flexContainer}>
    
      <View style={styles.mapContainer}>
        {emergency.citizenLocation && (
          <MapView
            style={styles.map}
            ref={mapRef}
            initialRegion={{
              latitude: emergency.citizenLocation.latitude,
              longitude: emergency.citizenLocation.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            onLayout={() => setMapReady(true)}
          >
            {mapReady && (
              <>
              <Animated.View style={{ transform: [{ scale: circleScale }] }}>
                <Circle
                  center={emergency.citizenLocation}
                  radius={300}
                  fillColor="rgba(0, 128, 255, 0.2)"
                  strokeColor="rgba(0, 128, 255, 0.5)"
                  strokeWidth={2}
                />
                </Animated.View>
                <Marker
                  coordinate={emergency.citizenLocation}
                  title={emergency.name}
                  description={`#${emergency.transactionId}`}
                >
                  {/* Replace the default marker icon with your custom marker */}
                  <CustomMarkerImage />
                </Marker>
              </>
            )}
          </MapView>
        )}
      </View>
  
      <View style={styles.detailsContainer}>
      {emergency.status === 'Pending' && (
        <Text style={styles.urgentHelpText}>Needs Urgent Help</Text>
      )}
        <Text style={styles.normalText}>Name: <Text style={styles.boldText}> {emergency.userFirstName}</Text></Text>
        <Text style={styles.normalText}>Type of Emergency: <Text style={styles.boldText}> {emergency.type}</Text></Text>
        <Text style={styles.normalText}>Transaction ID:  <Text style={styles.boldText}> #{emergency.transactionSosId}</Text></Text>
        {address && (
          <Text style={styles.normalText}>Address: <Text style={styles.boldText}>{address}</Text></Text>
        )}
        {/* Display minutes ago using the getMinutesAgo function */}
        {emergency.timestamp && (
                <Text style={styles.timeText}>
                  {timeAgo.days > 0
                    ? `${timeAgo.days} days`
                    : timeAgo.hours > 0
                    ? `${timeAgo.hours} hours`
                    : timeAgo.minutes > 0
                    ? `${timeAgo.minutes} minutes`
                    : `${timeAgo.seconds} seconds`} ago
                </Text>
            )}
            {emergency.status === 'Pending' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: 'green' }]
                }
                onPress={() => handleClick(emergency)}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: 'red' }]
                }
                onPress={() => handleDeleteButtonPress(emergency.transactionSosId)}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
  </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    flex: 1,
    backgroundColor: '#FE0000',
    width: 250,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText:{
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
  },
  cancelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  contentContainer: {
    margin: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  normalText: {
    fontWeight: 'normal',
    marginLeft: 10,
    fontSize: 16,
  },
  timeText: {
    fontWeight: 'normal',
    textAlign: 'right',
    fontSize: 20,
    marginTop: 5,
  },
  statusContainer: {
    backgroundColor: 'black',
    padding: 2,
    borderRadius: 5,
    marginTop: 2,
    width: 65,
  },
  statusText: {
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center',
  },
  separator: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    marginTop: 10,
    marginBottom: 5,
    color: '#808080',
  },
  largeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    height: Dimensions.get('window').height * 0.6,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  mapContainer: {
    flex: 1,
    margin: 5,
  },
  detailsContainer: {
    flex:1,
    backgroundColor: 'white', // Set the background color for the emergency details view
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  urgentHelpText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 15,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  detailsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1, // Add this to make the container take remaining space
  },
  buttonContainer: {
    flexDirection: 'row', // Display buttons side by side
    justifyContent: 'center',
    marginTop: 20,
  },
  customMarkerImage: {
    width: 40, 
    height: 40,
    resizeMode: 'contain',
  },
});

export default ViewSOSDetailsPolice;
