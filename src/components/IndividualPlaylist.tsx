import { View, Text, TouchableOpacity, Button, Dimensions } from 'react-native'
import React, { useContext, useMemo, useState } from 'react'
import { defaultStyles } from '../styles'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, screenPadding } from '../constants/tokens'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feather from "react-native-vector-icons/Feather"
import { useNavigation, useRoute } from '@react-navigation/native'
import { play } from 'react-native-track-player/lib/src/trackPlayer'
import { TextInput } from 'react-native-gesture-handler'
import Tracklist from './Tracklist'
import { generateId } from '../helper'
import Songlist from './PlaylistSongList'
import { QueueContext } from '../context/queueContext'
import { Play, Shuffle } from './PlayingControls'

const { width } = Dimensions.get("screen")
export default function SinglePlaylist() {
  const naviagtion = useNavigation<any>()
  const [search, setSearch] = useState("");
  const route = useRoute<any>()
  const playlist = route.params?.playlist;
  const { playlists } = useContext(QueueContext)

  const filteredTracks = useMemo(() => {
    let findPlaylist = playlists?.find((item: any) => item.name == playlist?.name);
    if (!search) {
      return findPlaylist?.songs
    }
    return findPlaylist?.songs?.filter((i: any) => i.title?.toLowerCase().includes(search.toLowerCase()))
  }, [search, playlists])

  return (

    <LinearGradient
      colors={["#333", colors.background,]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ paddingHorizontal: 10, width }}>
        <TouchableOpacity onPress={() => naviagtion.navigate("PlaylistScreen")}>
          <Feather name="chevron-left" size={30} color={"#fff"} />
        </TouchableOpacity>
        {/* playlist anme */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: "#fff", fontSize: 25 }}>{playlist?.name}</Text>
        </View>
        <TextInput clearButtonMode='always' placeholder='Find in songs' placeholderTextColor={"#999"} style={{
          textAlign: 'left',

          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: 10,
          paddingHorizontal: 10,
          marginVertical: 10,
          paddingVertical: 10
        }}
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(val) => {
            setSearch(val)
          }}
        />
        {/* buttons */}
        <View style={{ flexDirection: "row", gap: 10, width: "100%", justifyContent: "center", marginTop: 10 ,marginBottom:10}}>
        <Play tracks={filteredTracks} id={generateId(playlist?.name,search)}></Play>
        <Shuffle tracks={filteredTracks} id={generateId(playlist?.name,search)}></Shuffle>
        </View>
        {/* songs */}
        {
          filteredTracks?.length > 0 && <Songlist tracks={filteredTracks} playlistName={playlist?.name} id={generateId(playlist?.name,search)}></Songlist>
        }
        {
          filteredTracks?.length == 0 && (
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 30 }}>
              <Text style={{ color: "#ccc" }}> no songs yet</Text>
            </View>
          )
        }
      </SafeAreaView>
    </LinearGradient>
  )
}