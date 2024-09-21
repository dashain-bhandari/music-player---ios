import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Songs from '../components/SongScree'
import { defaultStyles } from '../styles'
import { StackScreenWIthSearch } from '../constants/layout'
export default function SongScreen() {
  const stack=createStackNavigator()
  return (
    <View style={defaultStyles.container}>
    <stack.Navigator >
      <stack.Screen name='Song' component={Songs} 
      options={{...StackScreenWIthSearch,title:"Songs",
      
      }}
      
      ></stack.Screen>
    </stack.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({})