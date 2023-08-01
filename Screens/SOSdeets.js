import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

export default function SOS() {
  const [initialRegion, setInitialRegion] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [waitingForPolice, setWaitingForPolice] = useState(true); // New state variable
  const mapRef = useRef(null);
  const userMovedMap = useRef(false);
  const [isSOSsubmitted, setIsSOSsubmitted] = useState(false);

  
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setInitialRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setMarkerPosition({ latitude, longitude });
        setUserLocation({ latitude, longitude });
      } catch (error) {
        console.error('Error getting current location', error);
      }
    })();
  }, []);
  const onRegionChange = (region) => {
    if (!userMovedMap.current) {
      const { latitude, longitude } = markerPosition;
      setMarkerPosition({ latitude: region.latitude, longitude: region.longitude });
    }
  };
  
  const onMarkerDragStart = () => {
    // Set the userMovedMap flag to true when the marker drag starts
    userMovedMap.current = true;
  };
  
  const onMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    userMovedMap.current = false;
};
  
 const onMapPanDrag = () => {
  userMovedMap.current = true;
};
const onUserLocationChange = (location) => {
  const { latitude, longitude } = location.coords;
  setUserLocation({ latitude, longitude });

  if (!userMovedMap.current) {
    setMarkerPosition({ latitude, longitude });
  }
};


return (
  <SafeAreaView style={styles.container}>
    {initialRegion ? (
      <>
        <MapView
          style={styles.map}
          onRegionChange={onRegionChange}
          initialRegion={initialRegion}
          ref={mapRef}
          onPanDrag={onMapPanDrag}
        >
          {markerPosition && (
            <Marker
              coordinate={markerPosition}
              draggable
              onDragEnd={onMarkerDragEnd}
              onDragStart={onMarkerDragStart} // Add onDragStart handler
            />
          )}
          {userLocation && (
            <Circle
              center={userLocation}
              radius={200}
              fillColor="rgba(0, 128, 255, 0.2)"
              strokeColor="rgba(0, 128, 255, 0.5)"
            />
          )}
        </MapView>
        {waitingForPolice && (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingText}>Waiting for the police to accept</Text>
          </View>
        )}
      </>
    ) : (
      <Text>Loading...</Text>
    )}
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
},
map: {
  flex: 1,
  marginLeft: 20,
  marginRight: 20,
  marginTop: 20,
  marginBottom: 200,
},
waitingContainer: {
  position: 'absolute',
  bottom: 16,
  left: 0,
  right: 0,
  alignItems: 'center',
},
waitingText: {
  fontSize: 18,
  color: 'red',
  fontWeight: 'bold',
},
});