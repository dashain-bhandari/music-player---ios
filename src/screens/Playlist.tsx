import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { defaultStyles } from '../styles'
import PlaylistScreen from '../components/PlaylistScreen'
import { StackScreenWIthSearch } from '../constants/layout'
import SinglePlaylist from '../components/IndividualPlaylist'
import { colors } from '../constants/tokens'

export default function Playlist() {
  const stack=createStackNavigator()
  return (
    <View style={defaultStyles.container}>
    <stack.Navigator >
      <stack.Screen name='PlaylistScreen' component={PlaylistScreen} options={{...StackScreenWIthSearch,title:"Playlists"}}></stack.Screen>
      <stack.Screen name='SinglePlaylist' component={SinglePlaylist} 
     // options={{...StackScreenWIthSearch,title:"",headerBackTitleStyle:{color:colors.primary}}}
      options={{headerShown:false}}
      ></stack.Screen>
    
    </stack.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({})