import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { defaultStyles } from '../styles'
import Tracklist from './Tracklist'
 import { useFavorites, useTracks } from '../hooks/useLibraryStore'
import { TextInput } from 'react-native-gesture-handler'
import { generateId } from '../helper'
import { colors } from '../constants/tokens'
import { Play, Shuffle } from './PlayingControls'

export default function Favorite() {
  const favorites=useFavorites().favorites
const tracks=useTracks()
const fav=tracks.filter((i)=>i.rating==1)
console.log("first")
  const [search,setSearch]=useState("");

const filteredTracks =useMemo(()=>{
  if(!search){
    return favorites
  }
  return favorites.filter((i)=>i.title?.toLowerCase().includes(search.toLowerCase()))
},[search,favorites])

  return (
    <View style={{...defaultStyles.container, paddingHorizontal: 10}}>
       <TextInput clearButtonMode='always' placeholder='Find in songs'  placeholderTextColor={"#aaa"} style={{
        textAlign: 'left',
        paddingHorizontal:10,
        backgroundColor: "#222",
        borderRadius: 10,
       color:"#fff",
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
<Play tracks={filteredTracks} id={generateId("Favorites",search)}></Play>
<Shuffle tracks={filteredTracks} id={generateId("Favorites",search)}></Shuffle>
        </View>
 <Tracklist id={generateId("Favorites",search)} tracks={filteredTracks}/>
    </View>
  )
}

const styles = StyleSheet.create({})