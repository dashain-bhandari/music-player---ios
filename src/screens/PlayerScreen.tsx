import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import TrackPlayer, { Track, useActiveTrack, useProgress } from 'react-native-track-player'
import { defaultStyles } from '../styles';
import { colors, fontSize, screenPadding } from '../constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';
import { UnknownTrack } from '../assets/image';
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { ViewStyle } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import { PlayerProgressBar, PlayerControls, PlayerVolume, PlayerRpeatToggle } from "../components/PlayingControls"
import { LinearGradient } from 'expo-linear-gradient';
import { useBackgroundColor } from '../hooks/useBackgroundColor';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist'
import { useActiveQueue } from '../hooks/useActiveQueue';
import { getActiveTrackIndex, getQueue } from 'react-native-track-player/lib/src/trackPlayer';
import Song from '../components/Song';
import { QueueContext } from '../context/queueContext';
import { shuffleArray } from '../helper';
import { useFavorites } from '../hooks/useLibraryStore';
import { useTrackPlayerFavorite } from '../hooks/useTrackPlayerFavorite';
import { MovingText } from '../components/MovingText';

export default function PlayerScreen() {
    const activeTrack = useActiveTrack();

    const [activeQ, setActiveQ] = useState<Track[] | null>()
    const { activeQueue, setActiveQueue, showQueue, setShowQueue, shuffle, setShuffle, activeTracks, setActiveTracks, queueOffset, setQueueOffset } = useContext(QueueContext);

    useEffect(() => {
        const getQ = async () => {

            const queue = await getQueue()
          
            const index = queue.findIndex((i: any) => i?.url == activeTrack?.url)

            let q = queue && [...queue.slice(index + 1), ...queue.slice(0, index)]
            setActiveQ(q);

        }
        getQ()
    }, [activeTrack])


    const play = async (item: any) => {
        const queue = await TrackPlayer.getQueue()
        const index = queue?.findIndex((i: any) => i.url == item.url)
      
        if (index !== -1) {
           
            await TrackPlayer.skip(index);
            await TrackPlayer.play()
            activeQ?.length && setQueueOffset((index + queueOffset + 1) % (activeQ?.length + 1))
        }
    }

    const shuffleToggle = async () => {
        const queue = await getQueue()
        if (shuffle) {
            setShuffle(false);
         
            const qindex = queue.findIndex((i: any) => i?.url == activeTrack?.url);
           
            const index = activeTracks.findIndex((i: any) => i?.url == activeTrack?.url);
     
            let q = [...activeTracks.slice(index + 1), ...activeTracks.slice(0, index)]
            const before = activeTracks.slice(0, index)
            const after = activeTracks.slice(index + 1);
            setActiveQ(q);
            let removed = [...queue.slice(0, qindex)]
            let removeIndexes = removed.map((i, index) => index)
            removed && await TrackPlayer.remove(removeIndexes)
            await TrackPlayer.removeUpcomingTracks();
            await TrackPlayer.add(after)
            await TrackPlayer.add(before)
        }
        else {
            setShuffle(true);
          
            const index = queue.findIndex((i: any) => i?.url == activeTrack?.url);
           
            let q = queue && [...queue.slice(index + 1), ...queue.slice(0, index)]
           
           
            let shuffled = shuffleArray(q);
            let removed = [...queue.slice(0, index)]
            let removeIndexes = removed.map((i, index) => index)
            removed && await TrackPlayer.remove(removeIndexes)
          
            setActiveQ(shuffled);
            setActiveQueue(shuffled);
            await TrackPlayer.removeUpcomingTracks();
            // setActiveTracks([activeTrack, ...shuffled])
            await TrackPlayer.add(shuffled)

        }
    }

    const handleQueueToggle = () => {
        setShowQueue(!showQueue)
    }
    const { isFavorite, toggleFavorite } = useTrackPlayerFavorite()
    const { top, bottom } = useSafeAreaInsets()
    const { imgcolors } = useBackgroundColor(activeTrack?.artwork ?? UnknownTrack)
    if (!activeTrack) {
        return <View>
            <ActivityIndicator color={colors.icon}></ActivityIndicator>
        </View>
    }


    const renderItem = ({ item, getIndex, drag, isActive }: RenderItemParams<any>) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onPress={() => play(item)}
                    onLongPress={drag}
                    disabled={isActive}
                    style={[

                        {
                            backgroundColor: isActive
                                ? "#ccc"
                                : item.backgroundColor
                            ,
                            padding: 10,
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center"
                        }
                    ]}

                >
                    <Image source={{ uri: item.artwork ?? UnknownTrack }} style={{ height: 40, width: 40, borderRadius: 10 }}></Image>

                    <Text style={{ color: "#fff" }}>{item.title}</Text>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };


    return (
        <LinearGradient
            style={{ ...defaultStyles.container, paddingHorizontal: screenPadding.horizontal }}
            colors={
                imgcolors ? [imgcolors.background, imgcolors.primary] : ["#AAA"]
            }
        >
            {/* <View style={styles.overlay}> */}
            <DismissPlayer />
            <View style={{
                flex: 1,
                marginBottom: bottom,
                marginTop: top + 37
            }}>
                {
                    showQueue ? (<>
                        <View style={{ height: 370, marginBottom: 30 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ color: imgcolors?.primary ?? "#fff", fontSize: 15 }}>
                                    Playing next
                                </Text>
                                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                    <TouchableOpacity onPress={shuffleToggle} style={{ backgroundColor: `${shuffle ? "#aaa" : "transparent"}`, borderRadius: 10, padding: 3 }}>
                                        <MaterialIcons name='shuffle' color={"white"} size={30}></MaterialIcons>
                                    </TouchableOpacity>
                                    <PlayerRpeatToggle />
                                </View>
                            </View>
                            {
                                activeQ && (<DraggableFlatList showsVerticalScrollIndicator={false} data={activeQ}

                                    onDragEnd={async ({ data }) => {
                                        console.log("data",data)
                                        setActiveQ(data)
                                        setActiveQueue(data)
                                        const queue=await getQueue()
                                        const index=await TrackPlayer.getActiveTrackIndex()
                                        console.log("queue",queue)
                                        let removed = [...queue.slice(0, index)]
                                        let removeIndexes = removed.map((i, index) => index)
                                        removed && await TrackPlayer.remove(removeIndexes)
                                        await TrackPlayer.removeUpcomingTracks();
                                        await TrackPlayer.add(data)
                                      
                                    }

                                    }
                                    keyExtractor={(item, index) => String(index)}

                                    renderItem={renderItem}
                                ></DraggableFlatList>)
                            }
                        </View>
                    </>) : (
                        <View style={styles.artworkContainer}>
                            <Image source={{ uri: activeTrack.artwork ?? UnknownTrack }} style={styles.artwork}></Image>
                        </View>
                    )
                }
                <View style={{ flex: 1 }}>
                    <View style={{ marginTop: 'auto' }}>
                        {/* track title */}
                        <View style={{ marginBottom: 5, justifyContent: "space-between", alignItems: "center", flexDirection: "row", gap: 10 }}>

                            <View style={{
                                flex: 1,
                                overflow: 'hidden',
                            }}>

                                <MovingText text={activeTrack?.title ?? ""} animationThreshold={25} style={{ ...defaultStyles.text, fontSize: fontSize.lg }}></MovingText>

                            </View>
                            <TouchableOpacity onPress={toggleFavorite} style={{
                                paddingLeft: 16,
                            }}>
                                <FontAwesome color={"white"} size={25} name={isFavorite ? "heart" : "heart-o"} />
                            </TouchableOpacity>
                        </View>
                        <Text numberOfLines={1} style={{ color: "#ccc" }}>{activeTrack?.artist}</Text>
                    </View>
                    <PlayerProgressBar style={{ marginTop: 32 }} />
                    <PlayerControls style={{ marginTop: 40 }} />

                    <PlayerVolume style={{ marginTop: "auto", marginBottom: "auto" }} />

                </View>
                <View style={{
                    flexDirection: "row", justifyContent: "center"
                }}>
                    <TouchableOpacity
                        onPress={handleQueueToggle}
                    ><MaterialIcons name="queue-music" color={"white"} size={30} /></TouchableOpacity>
                </View>

            </View>
            {/* </View> */}
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...defaultStyles.container,

        paddingHorizontal: screenPadding.horizontal
    },
    artworkContainer: {
        marginTop: 10,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        height: "45%",
        shadowOpacity: 0.44,
        shadowRadius: 11,
        shadowOffset: {
            width: 0, height: 8
        }
    },
    artwork: {
        borderRadius: 10,
        height: "100%",
        width: "80%",
        resizeMode: "cover"
    }
})
const DismissPlayer = () => {
    const { top } = useSafeAreaInsets()
    return (
        <>
            <View style={{ position: "absolute", top: top + 7, left: 0, right: 0, flexDirection: "row", justifyContent: "center" }}>
                <View accessible={false}
                    style={{
                        backgroundColor: "#fff",
                        width: 50, height: 8, borderRadius: 8, opacity: 0.7
                    }} />
            </View>
        </>
    )
}


