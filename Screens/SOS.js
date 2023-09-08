import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { doc, addDoc, collection, getDoc, setDoc, runTransaction,getDocs,getFirestore, updateDoc, onSnapshot, query, where } from 'firebase/firestore';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { db } from '../firebaseConfig.js';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

const SOS = () => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigation = useNavigation();
  const [hasPendingSOS, setHasPendingSOS] = useState(false);
  const [emergencyType, setEmergencyType] = useState(null);
  const [userSosStatus, setUserSosStatus] = useState(null);
  const [userSosLocation, setUserSosLocation] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isWaitingForPolice, setIsWaitingForPolice] = useState(false);
  const [pingingCircleRadius, setPingingCircleRadius] = useState(0);
  const [isExpanding, setIsExpanding] = useState(false);
  const [pingingPosition, setPingingPosition] = useState(null);
  const [pingingAngle, setPingingAngle] = useState(0);
  const [mapKey, setMapKey] = useState(0);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 0, // Set default latitude here
    longitude: 0, // Set default longitude here
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef(null); // Callback ref for the MapView

  const [isMapLayoutReady, setIsMapLayoutReady] = useState(false);

  const remountMap = () => {
    setMapKey(mapKey + 1);
  };
  useEffect(() => {
    const currentUser = getAuth().currentUser;
    const db = getFirestore();
  
    // Create a query to find the emergency document for the current user
    const sosQuery = query(
      collection(db, 'Emergencies'),
      where('userId', '==', currentUser.uid)
    );
  
    const unsubscribe = onSnapshot(sosQuery, (snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.exists()) {
          const sosData = doc.data();
          console.log(sosData);
          setUserSosStatus(sosData.status);
          setUserSosLocation({
            latitude: sosData.location.latitude,
            longitude: sosData.location.longitude,
          });
        }
      });
    });
  
    return unsubscribe;
  }, []);
  // Check if there is a pending SOS for the current user and update the state accordingly.
  useEffect(() => {
    if (userSosStatus === 'Pending' && userSosLocation) {
      setHasPendingSOS(true);
    } else {
      setHasPendingSOS(false);
    }
  }, [userSosStatus, userSosLocation]);
  const fitMapToBounds = useCallback(() => {
    if (!isMapLayoutReady || !isMapReady || !isWaitingForPolice || !mapRef.current) return;

    // Calculate bounds based on markerPosition and pingingPosition (if available)
    let bounds = [markerPosition];
    if (pingingPosition) {
      bounds.push(pingingPosition);
    }

    // Fit the map to the new bounds
    mapRef.current.fitToCoordinates(bounds, {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      animated: true,
    });
  }, [isMapLayoutReady, isMapReady, isWaitingForPolice, markerPosition, pingingPosition]);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location.coords);
        setMarkerPosition(location.coords);
        setInitialRegion((prevRegion) => ({
          ...prevRegion,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));
      } catch (error) {
        console.error('Error getting current location', error);
      }
    };

    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    getLocation();

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    let animationFrameId;
  
    const updatePingingEffect = () => {
      setPingingCircleRadius((prevRadius) => {
        if (prevRadius < 2000) {
          return prevRadius + 100; // Adjust the increment as needed
        } else {
          setIsExpanding(false);
          return 0;
        }
      });
  
      setPingingAngle((prevAngle) => prevAngle + 1); // Increment the pinging angle
  
      if (markerPosition) {
        // Use the updated values directly from state
        const radiusInMeters = pingingCircleRadius;
        const angleRad = pingingAngle * (Math.PI / 180); // Convert angle to radians
        const latitude = markerPosition.latitude + (radiusInMeters / 111320) * Math.cos(angleRad);
        const longitude =
          markerPosition.longitude +
          (radiusInMeters / (111320 * Math.cos(markerPosition.latitude * (Math.PI / 180)))) *
          Math.sin(angleRad);
        setPingingPosition({ latitude, longitude });
      }
  
      animationFrameId = requestAnimationFrame(updatePingingEffect);
    };
  
    if ((isWaitingForPolice || userSosStatus === 'Pending') && markerPosition) {
      animationFrameId = requestAnimationFrame(updatePingingEffect);
    } else {
      setPingingCircleRadius(0);
      setPingingPosition(null);
      setPingingAngle(0);
    }
  
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isWaitingForPolice, userSosStatus, markerPosition, pingingAngle, pingingCircleRadius]);

  
  const handleEmergencyType = (type) => {
    setEmergencyType(type);
    setIsModalOpen(false);
  };

  const handleMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
  };

  const handleBackButton = () => {
    setEmergencyType(null);
    setMarkerPosition(currentLocation);
  };

  const handleCancel = async (emergency, currentUser) => {
    try {
      const currentUser = getAuth().currentUser;
      const db = getFirestore();
      const sosQuery = query(
        collection(db, 'Emergencies'),
        where('userId', '==', currentUser.uid)
      );
  
      const querySnapshot = await getDocs(sosQuery);
  
      if (querySnapshot.empty) {
        console.log('Document not found');
        return;
      }
  
      // Iterate through the documents to find the matching emergency
      querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        if (data.transactionSosId === emergency.transactionSosId) {
          // Update the status field to "Cancelled"
          await updateDoc(doc.ref, { status: 'Cancelled' });
          console.log('Complaint status updated to "Cancelled" successfully');
        }
      });
    } catch (error) {
      console.log('Error updating complaint status:', error);
    }
  
    // Hide the "Waiting for Police" UI
    setIsWaitingForPolice(false);
  };
  
  const submitEmergency = async () => {
    if (emergencyType && markerPosition) {
      setIsWaitingForPolice(true);
   
  
      try {
        const transactionNumberDoc = doc(db, 'TransactionSOS', 'transactionSosId');
        const transactionSnapshot = await getDoc(transactionNumberDoc);
        let transactionSosId = '00001'; // Default value if no transaction ID exists
  
        if (transactionSnapshot.exists()) {
          const { currentNumber } = transactionSnapshot.data();
          const newTransactionNumber = currentNumber + 1;
          transactionSosId = String(newTransactionNumber).padStart(5, '0');
        }
  
        // Update the transaction document with the new SOS ID
        await setDoc(transactionNumberDoc, { currentNumber: Number(transactionSosId) });
  
        const currentUser = getAuth().currentUser;
        const userId = currentUser?.uid;
        let userFirstName = 'Unknown User';
  
        if (userId) {
          const userDocRef = doc(db, 'User', userId);
          const userDocSnapshot = await getDoc(userDocRef);
  
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            userFirstName = userData?.Fname || 'Unknown User';
          }
        }
  
        const currentDate = new Date();
  
        await addDoc(collection(db, 'Emergencies'), {
          type: emergencyType,
          location: {
            latitude: markerPosition.latitude,
            longitude: markerPosition.longitude,
          },
          transactionSosId: transactionSosId,
          timestamp: currentDate.toISOString(),
          userFirstName: userFirstName,
          status: 'Pending',
          userId: currentUser.uid,
        });
  
        Alert.alert(
          'SOS Successful!',
          'Help is on the way.',
          [
            {
              text: 'OK',
              onPress: () => {}, // Remove the navigation from here
              style: 'cancel',
            },
          ],
          { textAlign: 'center' }
        );
      } catch (error) {
        console.error('Error submitting emergency:', error);
        Alert.alert(
          'Error',
          'An error occurred while submitting the emergency.',
          [
            {
              text: 'OK',
              onPress: () => {},
            },
          ],
          { textAlign: 'center' }
        );
      }
    }
  };
 
  return (
    <SafeAreaView style={styles.container}>
          <Text style={styles.text}>
            Feeling unsafe? Tap SOS alert for immediate help in emergencies. Your safety matters!
          </Text>
          <TouchableOpacity style={styles.sosButton} onPress={() => setIsModalOpen(true)}>
            <View style={styles.sosButtonInner}>
              <Text style={styles.sosButtonText}>Send SOS Alert</Text>
            </View>
          </TouchableOpacity>
      <Modal visible={isModalOpen} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setIsModalOpen(false)} style={styles.closeButton}>
              <Ionicons name="ios-close-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleEmergencyType('Fire Accident')}>
              <Text style={styles.emergencyType}>Fire Accident</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleEmergencyType('Vehicular Accident')}>
              <Text style={styles.emergencyType}>Vehicular Accident</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleEmergencyType('Robbery')}>
              <Text style={styles.emergencyType}>Robbery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {(emergencyType && currentLocation && !isWaitingForPolice) || (userSosStatus === 'Pending' && userSosLocation) ? (
        <>
          <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
            <Ionicons name="ios-arrow-back" size={24} color="black" />
          </TouchableOpacity>
  
          <View style={styles.mapContainer}>
            <MapView
              key={mapKey}
              style={styles.map}
              initialRegion={initialRegion}
              onLayout={() => setIsMapReady(true)}
              ref={mapRef}
            >
              {markerPosition  && isMapReady &&(
                <Marker
                  coordinate={markerPosition}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                />
              )}
              {currentLocation && isMapReady && (
                <Circle
                  center={currentLocation}
                  radius={200}
                  fillColor="rgba(0, 128, 255, 0.2)"
                  strokeColor="rgba(0, 128, 255, 0.5)"
                />
              )}
            </MapView>
            <TouchableOpacity style={styles.submitButton} onPress={submitEmergency}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
              
      {(emergencyType && isWaitingForPolice) || (userSosStatus === 'Pending' && userSosLocation) ? (
        <View style={styles.waitingContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            onLayout={() => setIsMapLayoutReady(true)} // Set the flag when the map layout occurs
            ref={mapRef}
          >
            {currentLocation && isMapReady && (
              <Circle
                center={currentLocation}
                radius={200}
                fillColor="rgba(0, 128, 255, 0.2)"
                strokeColor="rgba(0, 128, 255, 0.5)"
              />
            )}
            {pingingPosition && isMapReady && (
              <Circle
                center={currentLocation}
                radius={pingingCircleRadius} // Use the state variable for the pinging circle radius
                fillColor="rgba(0, 128, 255, 0.2)" // Customize the color and opacity of the circle
                strokeColor="rgba(0, 128, 255, 0.5)" // Customize the color and opacity of the circle border
              />
            )}
          </MapView>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancel(emergency, currentUser)} // Pass 'emergency' and 'currentUser'
          >
            <View style={styles.cancelButtonInner}>
              <Text style={styles.cancelButtonText}>Cancel SOS</Text>
            </View>
          </TouchableOpacity>

        </View>
      ) : null}
    </SafeAreaView>
      );
            }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    marginBottom: 50,
  },
  sosButton: {
    marginBottom: 16,
  },
  sosButtonInner: {
    backgroundColor: 'red',
    height: 300,
    width: 300,
    borderRadius: 250,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sosButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  closeButton: {
    alignItems: 'flex-end',
  },
  emergencyType: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 2,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  map: {
    flex: 1,
  },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    left: 0, 
    right: 0, 
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center', 
    marginHorizontal:10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:'center',
  },
  waitingContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  waitingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center', // Center the button horizontally
  },
  cancelButtonInner: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center', // Center the contents horizontally
    justifyContent: 'center', // Center the contents vertically
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SOS;