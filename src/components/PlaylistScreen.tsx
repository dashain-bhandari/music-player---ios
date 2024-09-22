import { Alert, Button, Dimensions, Image, KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { defaultStyles } from '../styles'
import { usePlaylist } from '../hooks/usePlaylistStore'
import { UnknownTrack } from '../assets/image';
import { colors, screenPadding } from '../constants/tokens';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Feather from "react-native-vector-icons/Feather"
import { QueueContext } from '../context/queueContext';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
const { width } = Dimensions.get("window");


const Separator = () => {
  return <View style={{ borderBottomColor: colors.textMuted, borderWidth: StyleSheet.hairlineWidth, opacity: 0.3, marginVertical: 9, marginLeft: 60 }}></View>
}

export default function PlaylistScreen() {
  // const { playlists, createPlaylist, getPlaylist, removePlaylist } = usePlaylist();
  const [modalVisible, setModalVisible] = useState(false);
  // getPlaylist();
  const { playlists, setPlaylists } = useContext(QueueContext)
  const [value, setValue] = useState<any>("");
  useEffect(() => {
    const getPlaylist = async () => {
      try {
        let playlist = await AsyncStorage.getItem("Playlist")
        console.log(playlist)
        playlist && setPlaylists(JSON.parse(playlist))
      } catch (error) {
        console.log(error)
      }

    }
    getPlaylist()
  }, [])
  const create = async () => {
    console.log("val", value)
    let newPlaylist = [...playlists, {
      name: value,
      songs: []
    }]
    console.log("neww", newPlaylist)
    setPlaylists(newPlaylist);
    setModalVisible(false);
    try {
      await AsyncStorage.setItem("Playlist", JSON.stringify(newPlaylist))
    } catch (error) {
      console.log(error)
    }
  }
  const deletePlaylist = async (name: string) => {
    console.log(name)
    const newPlay = playlists.filter((item: any) => item?.name !== name)
    setPlaylists(newPlay);
    try {
      await AsyncStorage.setItem("Playlist", JSON.stringify(newPlay))
    } catch (error) {
      console.log(error)
    }
  }

  const navigation = useNavigation<any>();

  const RenderItem = ({ item }: any) => {
    console.log(item)
    const swipeableRow = useRef<SwipeableMethods>(null);

    const rightActions = (swipeableRow: any) => {

      console.log("row", swipeableRow)
      return (<View

        style={{
          backgroundColor: colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          width: 100,
          height: '100%',
        }}

      >
        <TouchableOpacity onPress={() => deletePlaylist(item?.name)}>
          <Feather name="trash" color="#fff" size={20}></Feather>
        </TouchableOpacity>


      </View>)
    }
    return (
      <Swipeable
        ref={swipeableRow}
        renderRightActions={() => rightActions(swipeableRow)}
        leftThreshold={0}
        rightThreshold={10}

      >
        <TouchableHighlight onPress={() => navigation.navigate("SinglePlaylist", {
          playlist: item
        })}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 10, backgroundColor: "#000" }}>
            <Image source={{ uri: UnknownTrack }} style={{ width: 50, height: 50, borderRadius: 10, marginTop: 10, paddingHorizontal: screenPadding.horizontal }}></Image>
            <Text style={{ color: "#fff" }}>{item?.name}</Text>
          </View>
        </TouchableHighlight>
      </Swipeable>

    )


  }
  return (
    <View style={{ ...defaultStyles.container }}>
      <Pressable onPress={() => setModalVisible(true)} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10, paddingHorizontal: 10, marginBottom: 10 }}>
        {/* <Image source={{ uri: UnknownTrack }} style={{ width: 50, height: 50, borderRadius: 10, marginTop: 10, paddingHorizontal: screenPadding.horizontal }}></Image> */}
        <View style={{ width: 50, height: 50, backgroundColor: "#333", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
          <Feather name="plus" color="#fff" size={30}></Feather>
        </View>
        <Text style={{ color: "#fff" }}>Create Playlist</Text>
      </Pressable>
      {
        playlists && <FlatList ItemSeparatorComponent={Separator} data={playlists} renderItem={({ item }) => <RenderItem item={item}></RenderItem>}></FlatList>
      }

      <Modal transparent visible={modalVisible}>
        <KeyboardAvoidingView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: 0.8 * width, height: 180, backgroundColor: "#222", borderRadius: 20, flexDirection: "column", gap: 20, paddingHorizontal: 10, paddingVertical: 10, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontSize: 16 }}>Playlist name</Text>
            <TextInput value={value} onChangeText={(text) => setValue(text)} placeholder='Type in here..' placeholderTextColor={"#777"} style={{ width: "100%", color: "#fff", backgroundColor: "#000", paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10 }}></TextInput>
            <View style={{ flexDirection: "row", justifyContent: "center", width: "100%", gap: width * 0.08 }}>
              <View style={{ paddingHorizontal: 10, backgroundColor: "#ccc", borderRadius: 10, paddingVertical: 5 }}>
                <Button title='Create' color={colors.primary} onPress={() => create()}></Button>
              </View>
              <View style={{ paddingHorizontal: 10, backgroundColor: "black", borderRadius: 10, paddingVertical: 5 }}>
                <Button title='Cancel' color={"#aaa"} onPress={() => setModalVisible(false)}></Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

