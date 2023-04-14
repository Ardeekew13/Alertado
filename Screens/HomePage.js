import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import BottomTabs from '../Screens/BottomTabs'
export default function HomePage() {
  return (
    <View>
      <Text>HomePage</Text>
      <BottomTabs/>

    </View>
  )
}