import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import SongScreen from '../screens/SongScreen'
import FavoritesScreen from '../screens/FavoritesScreen'
import Playlist from '../screens/Playlist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { defaultStyles } from '../styles'
import { colors } from '../constants/tokens'
import { BlurView } from 'expo-blur'
import Feather from "react-native-vector-icons/Feather"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import FloatingPlayer from '../components/FloatingPlayer'

export default function Layout() {
  const tabs = createBottomTabNavigator()
  return (
   <>
      <tabs.Navigator screenOptions={{
         headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: { position: 'absolute', paddingTop: 8, borderTopRightRadius: 20, borderTopLeftRadius: 20, borderTopWidth: 0 },
        tabBarBackground: () => (
          <BlurView tint="dark" intensity={90} style={[StyleSheet.absoluteFillObject, { borderTopRightRadius: 20, borderTopLeftRadius: 20, overflow: "hidden" }]} />
        ),
      }}>
        <tabs.Screen component={SongScreen} name='Songs'
          options={{ tabBarIcon: ({ color }) => { return <FontAwesome name="music" color={color} size={25}></FontAwesome> } }}

        ></tabs.Screen>
        <tabs.Screen component={FavoritesScreen} name='Favorites'
          options={{ tabBarIcon: ({ color }) => { return <FontAwesome name="heart" color={color} size={25}></FontAwesome> } }}
        ></tabs.Screen>
        <tabs.Screen component={Playlist} name='Playlists'
          options={{ tabBarIcon: ({ color }) => { return <Feather name="list" color={color} size={25}></Feather> } }}
        ></tabs.Screen>
      </tabs.Navigator>
      <FloatingPlayer style={{
        position:'absolute',bottom:78,flexDirection:"row",alignItems:"center",justifyContent:"space-between", 
        backgroundColor:"#444",paddingVertical:10,paddingLeft:10,borderRadius:20,paddingHorizontal:10,left:10,right:10
      }}/>
   </>
  )
}

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
   
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
})