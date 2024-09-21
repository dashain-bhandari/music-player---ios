import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import SongScreen from './src/screens/SongScreen'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import Layout from './src/tabs/layout'
import { defaultStyles } from './src/styles'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useSetUpTrackPlayer } from './src/hooks/useSetUpTrackPlayer'
import SplashScreen from 'react-native-splash-screen'
import { useLogEvent } from './src/hooks/useLogEvent'
import PlayerScreen from './src/screens/PlayerScreen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { QueueContextProvider } from './src/context/queueContext'
import AddToPlaylist from './src/screens/AddToPlaylist'


export default function App() {
  useLogEvent()
  const handleSplashScreen = useCallback(() => {
    SplashScreen.hide()
  }, [])
  useSetUpTrackPlayer({
    onLoad: handleSplashScreen
  })
  const Stack = createStackNavigator()
  return (
    <SafeAreaProvider>

      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueueContextProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, headerShown: false
            }}>
              <Stack.Screen component={Layout} name='Home'></Stack.Screen>
              <Stack.Screen component={PlayerScreen} name='Player' options={{

                gestureDirection: "vertical",
                headerMode: "screen",
                gestureEnabled: true,
                animationTypeForReplace: "push"

              }}></Stack.Screen>

              <Stack.Group screenOptions={{
                presentation: "modal", headerShown: true, title:
                  "Add to Playlist", 
                  headerShadowVisible:false,
                  headerStyle:{
                    backgroundColor:"#000"
                  },
                  headerTintColor:"#fff",
                  headerBackTitleVisible:false
              }} >
                <Stack.Screen component={AddToPlaylist} name='AddToPlaylist'
                  options={{


              
                  }}

                ></Stack.Screen>
              </Stack.Group>

            </Stack.Navigator>
          </NavigationContainer>
        </QueueContextProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>


  )
}

const styles = StyleSheet.create({})