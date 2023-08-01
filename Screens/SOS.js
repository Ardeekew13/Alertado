import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { doc, addDoc, collection, getDoc, setDoc } from 'firebase/firestore';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { db } from '../firebaseConfig.js';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

const SOS = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigation=useNavigation();
  const [emergencyType, setEmergencyType] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isWaitingForPolice, setIsWaitingForPolice] = useState(false);
  const [pingingPosition, setPingingPosition] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 0, // Set default latitude here
    longitude: 0, // Set default longitude here
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef(null); // Callback ref for the MapView

  const fitMapToBounds = useCallback(() => {
    if (!isMapReady || !isWaitingForPolice || !mapRef.current) return;

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
  }, [isMapReady, isWaitingForPolice, markerPosition, pingingPosition]);

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
        setInitialRegion(prevRegion => ({
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
    if (isWaitingForPolice) {
      const pingInterval = setInterval(() => {
        const offsetLatitude = Math.random() * 0.001 - 0.0005;
        const offsetLongitude = Math.random() * 0.001 - 0.0005;
        setPingingPosition({
          latitude: markerPosition.latitude + offsetLatitude,
          longitude: markerPosition.longitude + offsetLongitude,
        });
      }, 1000);

      return () => {
        clearInterval(pingInterval);
      };
    } else {
      setPingingPosition(null);
    }
  }, [isWaitingForPolice, markerPosition]);

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

  const handleCancel = () => {
    setIsWaitingForPolice(false);
  };

  const submitEmergency = async () => {
    if (emergencyType && markerPosition) {
      setIsWaitingForPolice(true);
      setMarkerPosition(currentLocation);

      const transactionNumberDoc = doc(db, 'TransactionSOS', 'transactionSosId');
      const transactionSnapshot = await getDoc(transactionNumberDoc);
      let transactionSosId = '00001'; // Default value if no transaction ID exists

      if (transactionSnapshot.exists()) {
        const { currentNumber } = transactionSnapshot.data();
        transactionSosId = (currentNumber + 1).toString().padStart(5, '0');
      }

      addDoc(collection(db, 'emergencies'), {
        type: emergencyType,
        location: {
          latitude: markerPosition.latitude,
          longitude: markerPosition.longitude,
        },
        transactionSosId: transactionSosId,
      })
        .then(() => {
          Alert.alert(
            'SOS Successful!',
            'Help is on the way.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
                style: 'cancel',
              },
            ],
            { textAlign: 'center' }
          );
        })
        .catch((error) => {
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
        });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {!emergencyType && !isWaitingForPolice && (
        <>
          <Text style={styles.text}>
            Feeling unsafe? Tap SOS alert for immediate help in emergencies. Your safety matters!
          </Text>
          <TouchableOpacity style={styles.sosButton} onPress={() => setIsModalOpen(true)}>
            <View style={styles.sosButtonInner}>
              <Text style={styles.sosButtonText}>Send SOS Alert</Text>
            </View>
          </TouchableOpacity>
        </>
      )}

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

      {emergencyType && currentLocation && !isWaitingForPolice && (
        <>
          <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
            <Ionicons name="ios-arrow-back" size={24} color="black" />
          </TouchableOpacity>
  
          <View style={styles.mapContainer}>
            <MapView
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
      )}
     
    </SafeAreaView>
  );
};

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
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  waitingContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  waitingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default SOS;