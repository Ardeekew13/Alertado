import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getFirestore, collection, query, where, getDocs } from '@firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';

const GenerateStat = () => {
  const [crimeData, setCrimeData] = useState([]);
  const db = getFirestore();
  const [timeFrame, setTimeFrame] = useState('daily');
  const [mostReportedBarangay, setMostReportedBarangay] = useState({
    daily: '',
    weekly: '',
    monthly: '',
  });

  useEffect(() => {
    const fetchCrimeData = async () => {
      try {
        if (!timeFrame) {
          return;
        }
        const reportsCollection = collection(db, 'Reports');
        let startDate;

        if (timeFrame === 'daily') {
          const today = new Date();
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 1);
        } else if (timeFrame === 'weekly') {
          const today = new Date();
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 7);
        } else if (timeFrame === 'monthly') {
          const today = new Date();
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 1);
        }

        const querySnapshot = await getDocs(
          query(reportsCollection, where('date', '>=', startDate))
        );

        const data = querySnapshot.docs.map((doc) => {
          const reportData = doc.data();
          return {
            date: reportData.date.toDate(),
            count: 1,
            barangay: reportData.barangay,
          };
        });

        setCrimeData(data);

        // Calculate the most reported barangay for each timeframe
        const mostReportedBarangayDaily = calculateMostReportedBarangay(data, 'daily');
        const mostReportedBarangayWeekly = calculateMostReportedBarangay(data, 'weekly');
        const mostReportedBarangayMonthly = calculateMostReportedBarangay(data, 'monthly');

        setMostReportedBarangay({
          daily: mostReportedBarangayDaily,
          weekly: mostReportedBarangayWeekly,
          monthly: mostReportedBarangayMonthly,
        });
      } catch (error) {
        console.error('Error fetching crime data:', error);
      }
    };

    fetchCrimeData();
  }, [timeFrame, db]);

  const calculateMostReportedBarangay = (data, timeframe) => {
    const barangayCounts = {};

    const filteredData = data.filter((dataPoint) => {
      const date = dataPoint.date;
      const today = new Date();
      if (timeframe === 'daily') {
        return date >= today.setDate(today.getDate() - 1);
      } else if (timeframe === 'weekly') {
        return date >= today.setDate(today.getDate() - 7);
      } else if (timeframe === 'monthly') {
        return date >= today.setMonth(today.getMonth() - 1);
      }
      return false;
    });

    filteredData.forEach((dataPoint) => {
      const barangay = dataPoint.barangay;
      const count = dataPoint.count;
      if (barangay in barangayCounts) {
        barangayCounts[barangay] += count;
      } else {
        barangayCounts[barangay] = count;
      }
    });

    let mostReportedBarangay = '';
    let highestCount = 0;

    for (const barangay in barangayCounts) {
      if (barangayCounts[barangay] > highestCount) {
        highestCount = barangayCounts[barangay];
        mostReportedBarangay = barangay;
      }
    }

    return mostReportedBarangay;
  };

  const chartData = {
    labels: crimeData.map((dataPoint) => dataPoint.date.toISOString().split('T')[0]),
    datasets: [
      {
        data: crimeData.map((dataPoint) => dataPoint.count),
      },
    ],
  };

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
        {`Crime Report - ${timeFrame}`}
      </Text>
      <Picker
        selectedValue={timeFrame}
        onValueChange={(itemValue) => {
          setTimeFrame(itemValue);
        }}
      >
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Monthly" value="monthly" />
      </Picker>
    

      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
        Most Reported Barangay - Daily
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center' }}>
        {`Barangay with Most Reported Crimes (Daily): ${mostReportedBarangay.daily}`}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
        Most Reported Barangay - Weekly
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center' }}>
        {`Barangay with Most Reported Crimes (Weekly): ${mostReportedBarangay.weekly}`}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
        Most Reported Barangay - Monthly
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center' }}>
        {`Barangay with Most Reported Crimes (Monthly): ${mostReportedBarangay.monthly}`}
      </Text>
    </View>
  );
};

export default GenerateStat;