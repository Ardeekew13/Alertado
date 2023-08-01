import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';
import { getFirestore, deleteDoc, doc, collection, query, where, getDocs } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig, { db } from '../firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';

const mapCustomStyle = [ { "elementType": "geometry", "stylers": [ { "color": "#242f3e" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#746855" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#242f3e" } ] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#263c3f" } ] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#6b9a76" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#38414e" } ] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [ { "color": "#212a37" } ] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "color": "#9ca5b3" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#746855" } ] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#1f2835" } ] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#f3d19c" } ] }, { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#2f3948" } ] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#17263c" } ] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#515c6d" } ] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [ { "color": "#17263c" } ] } ]
const ViewReportDetailsPolice = ({ route }) => {
  const { report } = route.params;
  const reportId = report.id;
  const [mapReady, setMapReady] = useState(false);
  const [mapLayout, setMapLayout] = useState(false);
  const mapRef = useRef(null);
  const navigation = useNavigation();

  const handleMapLayout = () => {
    setMapLayout(true);
  };
  const onMapReady = () => {
    setMapReady(true);
  };

  useEffect(() => {
    if (mapLayout && mapRef.current) {
      mapRef.current.fitToElements(true);
    }
  }, [mapLayout]);

  useEffect(() => {
  }, []);
  const deleteReport = async () => {
    try {
      const firestore = getFirestore();
      const reportRef = doc(firestore, 'Reports', report.transactionId);
      await firestore.delete(reportRef);
      console.log('Report deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.log('Error deleting report:', error);
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

  return (
    <ScrollView style={styles.flexContainer}>
      <View style={styles.flexContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.boldText}>Reported By: </Text>
          <Text style={styles.normalText}>{report.name}</Text>
          <Text style={styles.boldText}>Date Reported: </Text>
          <Text style={styles.normalText}>{report.date}</Text>
          <Text style={styles.boldText}>Complainee: </Text>
          <Text style={styles.normalText}>{report.complainee}</Text>
          <Text style={styles.boldText}>Wanted or not? </Text>
          <Text style={styles.normalText}>{report.wanted}</Text>
          <Text style={styles.boldText}>Details: </Text>
          <Text style={styles.normalText}>{report.message}</Text>
          <Text style={styles.boldText}>Report Transaction ID: </Text>
          <Text style={styles.largeText}>#{report.transactionId}</Text>
          <Text style={styles.boldText}>Status:</Text>
          <View style={[styles.statusContainer, { backgroundColor: report.status === 'Pending' ? 'orange' : 'black' }]}>
            <Text style={styles.statusText}>{report.status}</Text>
          </View>

          <View>
            <View style={styles.separator} />
            <Text style={styles.largeText}>Address Information</Text>
            <View style={styles.separator} />
          </View>
          <Text style={styles.normalText}>{report.barangay}, {report.street}</Text>
        </View>

        {report.location && (
          <MapView
            customMapStyle= {mapCustomStyle}
            style={styles.map}
            ref={mapRef}
            onLayout={handleMapLayout}
            initialRegion={{
              latitude: report.location.latitude,
              longitude: report.location.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            onMapReady={onMapReady}
          >
            {mapReady && (
              <Marker
                coordinate={report.location}
                title={report.name}
                description={`#${report.transactionId}`}
              />
            )}
            {/* Add more Marker components for additional markers */}
          </MapView>
        )}

        <View>
          <View style={styles.separator} />
          <Text style={styles.largeText}>Police Feedbacks</Text>
          <View style={styles.separator} />
          <Text>No Police Feedback available</Text>
          <View style={styles.separator} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
    <TouchableOpacity>
        <View className="bg-cyan-500 p-2 rounded-sm">
            <Text className="text-white">Change Status</Text>
        </View>
    </TouchableOpacity>
    <TouchableOpacity>
        <View className="bg-slate-800 p-2 rounded-sm">
            <Text className="text-white">Give Feedback</Text>
        </View>
    </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    margin: 5,
  },
  button: {
    flex: 1,
    backgroundColor: '#FE0000',
    width: 250,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
    height: Dimensions.get('window').height * 0.3,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default ViewReportDetailsPolice;