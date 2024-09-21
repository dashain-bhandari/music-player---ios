import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { defaultStyles } from '../styles'
import Tracklist from './Tracklist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import FloatingPlayer from './FloatingPlayer'
import { useTracks } from '../hooks/useLibraryStore'
import { SearchBar } from 'react-native-screens'
import { useNavigation } from '@react-navigation/native'
import { generateId, shuffleArray } from '../helper'
import { colors } from '../constants/tokens'
import { Play, Shuffle } from './PlayingControls'
import { QueueContext } from '../context/queueContext'
import TrackPlayer from 'react-native-track-player'
export default function Songs() {
  const tracks = useTracks()
const [search,setSearch]=useState("");
const { activeTracks, activeQ, setActiveQ, setActiveTracks } = useContext(QueueContext)
const filteredTracks =useMemo(()=>{
  if(!search){
    return tracks
  }
  return tracks.filter((i)=>i.title?.toLowerCase().includes(search.toLowerCase()))
},[search,tracks])


const play=async()=>{
 
  await TrackPlayer.setQueue(tracks);
  await TrackPlayer.play()
  setActiveTracks(filteredTracks)
}

const shuffle = async () => {
  const shuffled=[...tracks].sort(()=>Math.random()-0.5)
 
  await TrackPlayer.setQueue(shuffled)
  await TrackPlayer.play();
  setActiveTracks(shuffled);
}

  return (
    <View style={{...defaultStyles.container, paddingHorizontal: 10}}>
      <TextInput clearButtonMode='always' placeholder='Find in songs'  placeholderTextColor={"#aaa"} style={{
        textAlign: 'left',
      paddingHorizontal:10,
        backgroundColor: "#222",
        color:"#fff",
        borderRadius: 10,
      
        marginVertical: 10,
        paddingVertical: 10
      }} 
      autoCapitalize='none'
      autoCorrect={false}
      onChangeText={(val)=>{
        setSearch(val)
      }}
      />
      <View style={{ flexDirection: "row", gap: 10, width: "100%", justifyContent: "center", marginTop: 10 ,marginBottom:10}}>
     
        <Play tracks={filteredTracks} id={generateId("Songs",search)}></Play>
        <Shuffle tracks={filteredTracks} id={generateId("Songs",search)}></Shuffle>
        </View>
      <Tracklist id={generateId("Songs",search)} tracks={filteredTracks} />
    </View>
  )
}

const styles = StyleSheet.create({})