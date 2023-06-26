import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ViewReportDetails = ({ route }) => {
  const { report } = route.params;

  return (
    <SafeAreaView>
      <View className="ml-4">
            <Text className="font-bold ">Reported By:  <Text className="font-normal"> {report.name}</Text></Text>
            <Text className="font-bold ">Date Reported:  <Text className="font-normal"> {report.date}</Text></Text>
            <Text className="font-bold ">Complainee:  <Text className="font-normal"> {report.complainee}</Text></Text>
            <Text className="font-bold ">Wanted or not?  <Text className="font-normal"> {report.wanted}</Text></Text>
            <Text className="font-bold ">Details:  <Text className="font-normal"> {report.message}</Text></Text>
            <Text className="font-bold ">Status:</Text>
            <View style={{ backgroundColor: report.status === 'Pending' ? 'orange' : 'black', padding: 2, borderRadius: 5, marginTop: 2 , width: 70}}>
            <Text style={{ color: 'white' }}>{report.status}</Text>
          </View>
          <Text>Address Information</Text>
          <Text>{report.barangay}, {report.street}</Text>

      </View>
    </SafeAreaView>
  );
};

export default ViewReportDetails;