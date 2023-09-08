import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Button, Image } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig, { db } from '../firebaseConfig';

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
const CustomMarker = ({ coordinate, zoomLevel }) => {
  const defaultMarkerSize = 30; // Increase the marker size value
  const maxZoom = 20;

  const calculateMarkerSize = (zoom) => {
    const baseSize = defaultMarkerSize * (1 + (1 - zoom / maxZoom));
    const aspectRatio = originalImageWidth / originalImageHeight;
    let width, height;

    if (baseSize / aspectRatio > defaultMarkerSize) {
      width = baseSize;
      height = baseSize / aspectRatio;
    } else {
      width = defaultMarkerSize * aspectRatio;
      height = defaultMarkerSize;
    }

    return { width, height };
  };

  const originalImageWidth = 860; // Replace with the actual width of your image
  const originalImageHeight = 1060; // Replace with the actual height of your image

  const markerSize = calculateMarkerSize(zoomLevel);

  return (
    <Marker coordinate={coordinate}>
      <Image
        source={require('./images/SosPIN.png')}
        style={markerSize}
        resizeMode="contain" // This ensures the image maintains its aspect ratio and doesn't crop
      />
    </Marker>
  );
};

const PoliceAccept = ({route}) => {
  const [policeLocation, setPoliceLocation] = useState(null);
  const [routeInstructions, setRouteInstructions] = useState([]);
  const { userSosLocation } = route.params;
  const [zoomLevel, setZoomLevel] = useState(1);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
   
    const fetchInitialLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          // Fetch the current location of the police 
          const location = await Location.getCurrentPositionAsync({});
          if (location) {
            setPoliceLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        } else {
          console.log('Permission to access location was denied');
        }
      } catch (error) {
        console.error('Error getting current location:', error);
      }
    };
   
    fetchInitialLocation();
  }, []); 
   

  const handlePoliceMarkerDragEnd = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setPoliceLocation({ latitude, longitude });

    try {
      const policeLocationRef = doc(db, 'PoliceLocations', 'police_location_id'); // Replace with actual collection and document ID
      await setDoc(policeLocationRef, {
        latitude,
        longitude,
      });
      console.log('Police location updated successfully');
    } catch (error) {
      console.error('Error updating police location:', error);
    }
  }; 
  const listenForPoliceLocation = () => {
    const policeLocationDocRef = doc(db, 'PoliceLocations', 'police_location_id'); // Replace with actual collection and document ID
    return onSnapshot(policeLocationDocRef, (doc) => {
      if (doc.exists()) {
        const policeData = doc.data();
        setPoliceLocation({
          latitude: policeData.latitude,
          longitude: policeData.longitude,
        });
      } else {
        console.log('Police location document not found');
      }
    });
  };

  useEffect(() => {
    const unsubscribe = listenForPoliceLocation();
    return () => {
      unsubscribe();
    };
  }, []);
  const fetchDirectionsGeoapify = async () => {
    if (!policeLocation || !userSosLocation) return;
  
    try {
      const apiKey = 'ab9f834b500a40bf9c3ed196ee1a0ead'; // Replace with your actual Geoapify API key
      const origin = `${policeLocation.latitude},${policeLocation.longitude}`;
      const destination = `${userSosLocation.latitude},${userSosLocation.longitude}`;
      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${origin}|${destination}&mode=drive&apiKey=${apiKey}`
      );
  
      const data = await response.json();
      if (data && data.features && data.features.length > 0) {
        const route = data.features[0].geometry.coordinates;
        const routeCoordinate = route[0].map((coordinate) => ({
          latitude: coordinate[1],
          longitude: coordinate[0],
        }));
        console.log(routeCoordinate)
        // console.log('Route coordinates set:', routeCoordinates);
        setRouteCoordinates(routeCoordinate); // Update the state with the route coordinates
      } else {
        console.log("No route found.");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };
  // console.log(routeCoordinates)
  

  return (
    <View style={{ flex: 1 }}>
    <MapView
    ref={mapRef}
    style={styles.map}
    initialRegion={{
      latitude: userSosLocation ? userSosLocation.latitude : 9.8500,
      longitude: userSosLocation ? userSosLocation.longitude : 124.1430,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }}
    onRegionChange={(region) => {
      const calculatedZoomLevel = 1 / region.latitudeDelta;
      setZoomLevel(calculatedZoomLevel);
    }}
  >
        {policeLocation && (
          <Marker
            coordinate={policeLocation}
            title="Police"
            draggable
            onDragEnd={handlePoliceMarkerDragEnd}
          />
        )}
        {userSosLocation && (
          <Circle
            center={userSosLocation}
            radius={500}
            strokeColor="blue"
            fillColor="rgba(0,255,255)"
          />
        )}
        {userSosLocation && (
          <CustomMarker
            coordinate={userSosLocation}
            zoomLevel={zoomLevel}
          />
        )}
        {routeCoordinates && (
          <Polyline
          coordinates={routeCoordinates}
          strokeColor="blue" // Change the color to blue
          strokeWidth={4}    // Adjust the width of the polyline
        />
        )}
      </MapView>
      <Button title="Submit" onPress={fetchDirectionsGeoapify} />
    </View>
  );
};

export default PoliceAccept;