import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useMemo, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { defaultStyles } from '../styles'
import { FlatList, TextInput } from 'react-native-gesture-handler'
import Tracklist from '../components/Tracklist'
import { QueueContext } from '../context/queueContext'
import { Image } from 'react-native'
import { UnknownTrack } from '../assets/image'
import { screenPadding } from '../constants/tokens'
import { addToPlaylist } from '../helper'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function AddToPlaylist() {
    const navigation = useNavigation<any>()
    const route = useRoute<any>()
    const track = route.params?.track

    const [search, setSearch] = useState("");

    const { playlists,setPlaylists } = useContext(QueueContext);
    const filtered = playlists.filter((item: any) => {
        return item?.songs?.every((song: any) => { return song.url !== track.url})
    })
    const filteredTracks =useMemo(()=>{
        if(!search){
          return filtered
        }
        return filtered.filter((i:any)=>i.name?.toLowerCase().includes(search.toLowerCase()))
      },[search,filtered])
    console.log("filtered",filtered);
    console.log("trackf",track);
    const RenderItem = ({ item }: any) => {
        return (
         <TouchableOpacity onPress={async()=>{addToPlaylist(track,item?.name,playlists,setPlaylists);

          navigation.goBack()
          
         }}>
               <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 10 }} >
                <Image source={{ uri: UnknownTrack }} style={{ width: 50, height: 50, borderRadius: 10, marginTop: 10, paddingHorizontal: screenPadding.horizontal }}></Image>
                <Text style={{ color: "#fff" }}>{item?.name}</Text>
            </View>
         </TouchableOpacity>
        )
    }
    return (
        <View style={{ ...defaultStyles.container }}>
            <TextInput clearButtonMode='always' placeholder='Find in playlists' placeholderTextColor={"#555"} style={{
                textAlign: 'left',
                marginHorizontal: 10,
                backgroundColor: "#bbb",
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
            <FlatList
                data={filteredTracks}
                renderItem={({ item }) => <RenderItem item={item}></RenderItem>}
            >

            </FlatList>
        </View>
    )
}

const styles = StyleSheet.create({})