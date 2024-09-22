import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { useRef } from 'react'
import { UnknownTrack } from '../assets/image'
import { colors, screenPadding } from '../constants/tokens'
import { defaultStyles } from '../styles'
import { Track, useActiveTrack, useIsPlaying } from 'react-native-track-player'
import FloatingPlayer from './FloatingPlayer'
import Feather from "react-native-vector-icons/MaterialCommunityIcons"
import AppMenu from './AppMenu'
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import LoaderKit from 'react-native-loader-kit'
import { useQueue } from '../hooks/useQueueStore'
export type Songitem = {
    item: any,
    id: string,
    onTrackSelect: (track: Track) => void
}
export default function Song({ item, id, onTrackSelect }: Songitem) {

    const rightActions = (swipeableRow: any) => {

      
        return (<View

            style={{
                backgroundColor: '#ccc',
                justifyContent: 'center',
                alignItems: 'center',
                width: 100,
                height: '100%',
            }}

        >
            <AppMenu track={item} swipeableRow={swipeableRow}>
                <Feather name="dots-horizontal" color="#555" size={20}></Feather>
            </AppMenu>
        </View>)
    }
   
    const isActive = useActiveTrack()?.url == item?.url
    const { playing } = useIsPlaying();
    const { activeQueueId } = useQueue()
    const swipeableRow = useRef<SwipeableMethods>(null);
    const openedRow = useRef<SwipeableMethods | null>(null);  // To keep track of the opened row

    let rowRefs = new Map();
    return (
        <Swipeable
            ref={swipeableRow}
            renderRightActions={() => rightActions(swipeableRow)}
            leftThreshold={0}
            rightThreshold={10}

        >

            <TouchableHighlight onPress={() => onTrackSelect(item)}
                style={{ ...styles.contaner, width: '100%', backgroundColor: "#000" }}
            >
                <View style={{ ...styles.contaner, width: "100%" }}

                >

                    <View style={{ position: "relative", height: 60, width: 60 }}>
                        <Image source={{ uri: item?.artwork ? item.artwork : UnknownTrack }} style={{ height: 60, width: 60, borderRadius: 10 }}></Image>
                        {
                            isActive && activeQueueId==id && (playing ? (
                                <View style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <LoaderKit

                                        style={{ width: 30, height: 30 }}
                                        name={'LineScale'} // Optional: see list of animations below
                                        color={'white'} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                                    />
                                </View>

                            ) : (
                                <View style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <Feather name='play' size={50} color={"#fff"} />
                                </View>
                            ))
                        }
                    </View>

                    <View>
                        <Text numberOfLines={1} style={[styles.tracktitle, { color: isActive && activeQueueId==id ? colors.primary : colors.text }]}>{item.title}</Text>
                    </View>


                </View>

            </TouchableHighlight>
        </Swipeable>


    )
}

const styles = StyleSheet.create({
    tracktitle: {
        color: colors.text,

    },
    contaner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,

        // paddingHorizontal: screenPadding.horizontal
    }
})

