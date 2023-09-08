import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Animated
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import  MapView, {Marker, Circle } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import firebaseConfig, { db } from '../firebaseConfig';
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

  const pingingCircleScale = new Animated.Value(1); // Add this for pinging effect
  const pingingCircleRadius = new Animated.Value(0); // Add this for pinging effect

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
        latitude: emergency.location.latitude,
        longitude: emergency.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current.animateToRegion(region, 1000);
      startPulsatingEffect();
    }
  }, [mapReady, emergency.location]);

  useEffect(() => {
    if (mapReady && mapRef.current) {
      const region = {
        latitude: emergency.location.latitude,
        longitude: emergency.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current.animateToRegion(region, 1000);
      startPulsatingEffect();
    }
  }, [mapReady, emergency.location]);
  
  useEffect(() => {
  }, []);
  const deleteReport = async () => {
    try {
      const firestore = getFirestore();
      const reportRef = doc(firestore, 'Emergencies', emergency.transactionSosId);
      await firestore.delete(reportRef);
      console.log('Report deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.log('Error deleting report:', error);
    }
  };
 
  const handleClick = async (emergency) => {
    try {
      const db = getFirestore();
      const complaintsRef = collection(db, 'Emergencies');
      const querySnapshot = await getDocs(query(complaintsRef, where('transactionSosId', '==', emergency.transactionSosId.toString())));
  
      if (querySnapshot.empty) {
        console.log('Document not found');
        return;
      }
  
      const complaintDoc = querySnapshot.docs[0];
  
      // Update the status field to "Cancel"
      await updateDoc(complaintDoc.ref, { status: 'Ongoing' });
      navigation.navigate('Police Accept SOS', {
        userSosLocation: emergency.location,
        transactionSosId: emergency.transactionSosId,
      });
      console.log('Complaint status updated to "Ongoing" successfully');
    } catch (error) {
      console.log('Error updating complaint status:', error);
    }
  };
  const handleDeleteButtonPress = () => {
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
          onPress: deleteReport,
        },
      ],
    );
  };
  useEffect(() => {
    if (emergency.location) {
      // Construct the API URL
      const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${emergency.location.latitude}&lon=${emergency.location.longitude}&apiKey=ab9f834b500a40bf9c3ed196ee1a0ead`;

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
  }, [emergency.location]);
  return (
    <ScrollView style={styles.flexContainer}>
      <View style={styles.mapContainer}>
        {emergency.location && (
          <MapView
            style={styles.map}
            ref={mapRef}
            initialRegion={{
              latitude: emergency.location.latitude,
              longitude: emergency.location.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            onMapReady={onMapReady}
          >
            {mapReady && (
              <>
              <Animated.View style={{ transform: [{ scale: circleScale }] }}>
                <Circle
                  center={emergency.location}
                  radius={300}
                  fillColor="rgba(255, 0, 0, 0.3)"
                  strokeColor="red"
                  strokeWidth={2}
                />
                </Animated.View>
                <Marker
                  coordinate={emergency.location}
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
        <Text style={styles.urgentHelpText}>Needs Urgent Help</Text>
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
        {/* ... (other emergency details) */}
        <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: 'green' }]}
        onPress={() => handleClick(emergency)}
      >
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: 'red' }]}
        onPress={handleDeleteButtonPress}
      >
        <Text style={styles.buttonText}>Reject</Text>
      </TouchableOpacity>
    </View>
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
