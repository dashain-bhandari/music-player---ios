import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { defaultStyles } from '../styles'
import Favorite from '../components/FavoriteScreen'
import { StackScreenWIthSearch } from '../constants/layout'


export default function FavoritesScreen() {

  const stack=createStackNavigator()
  return (
    <View style={defaultStyles.container}>
    <stack.Navigator >
      <stack.Screen name='FavoriteScreen' component={Favorite} options={{...StackScreenWIthSearch,title:"Favorites"}}></stack.Screen>
    </stack.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({})