import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ViewComplaintDetailsPolice = ({ route }) => {
  const { complaint } = route.params;

  return (
    <SafeAreaView>
      <View className="ml-4">
            <Text className="font-bold ">Reported By:  <Text className="font-normal"> {complaint.name}</Text></Text>
            <Text className="font-bold ">Date Reported:  <Text className="font-normal"> {complaint.date}</Text></Text>
            <Text className="font-bold ">Complainee:  <Text className="font-normal"> {complaint.complainee}</Text></Text>
            <Text className="font-bold ">Wanted or not?  <Text className="font-normal"> {complaint.wanted}</Text></Text>
            <Text className="font-bold ">Details:  <Text className="font-normal"> {complaint.message}</Text></Text>
            <Text className="font-bold ">Status:</Text>
            <View style={{ backgroundColor: complaint.status === 'Pending' ? 'orange' : 'black', padding: 2, borderRadius: 5, marginTop: 2 , width: 70}}>
            <Text style={{ color: 'white' }}>{complaint.status}</Text>
          </View>
          <Text>Address Information</Text>
          <Text>{complaint.barangay}, {complaint.street}</Text>

      </View>
    </SafeAreaView>
  );
};

export default ViewComplaintDetailsPolice;