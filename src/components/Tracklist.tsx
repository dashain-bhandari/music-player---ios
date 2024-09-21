import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useRef } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import library from "../assets/data/library.json"
import Song from './Song'
import { colors } from '../constants/tokens'
import TrackPlayer, { Track } from 'react-native-track-player'
import { useQueue } from '../hooks/useQueueStore'
import { QueueContext } from '../context/queueContext'
import { getQueue } from 'react-native-track-player/lib/src/trackPlayer'
import { shuffleArray } from '../helper'
import { SwipeListView } from 'react-native-swipe-list-view'
import Feather from "react-native-vector-icons/MaterialCommunityIcons"
import AppMenu from './AppMenu'
import LoaderKit from 'react-native-loader-kit'
const Separator = () => {
    return <View style={{ borderBottomColor: colors.textMuted, borderWidth: StyleSheet.hairlineWidth, opacity: 0.3, marginVertical: 9, marginLeft: 80 }}></View>
}
export default function Tracklist({ id, tracks }: any) {
console.log("tracks",tracks)

    const { activeQueue, setActiveQueue, activeTracks, setActiveTracks, shuffle, setShuffle,setQueueOffset } = useContext(QueueContext);
    const { activeQueueId, setActiveQueueId } = useQueue();
    const useQueueOffset = useRef(0);

    const onTrackSelect = async (track: Track) => {
        const trackIndex = tracks.findIndex((i: Track) => i.url== track.url)
        if (trackIndex == -1) {
            return
        }

        const isChanging = id !== activeQueueId
console.log("ischanging",isChanging)
        if (isChanging) {
            const before = tracks.slice(0, trackIndex)
            const after = tracks.slice(trackIndex + 1);
            await TrackPlayer.reset();
            setQueueOffset(1)
            await TrackPlayer.add(track);
            await TrackPlayer.play();
            const q = [track,...after, ...before];
            const p=[...after, ...before];
            console.log("length", q.length)
            setActiveTracks(q);
            if (shuffle) {
                const shuffled = shuffleArray(p);
                await TrackPlayer.add(shuffled);
            }
            else {
                await TrackPlayer.add(after)
                await TrackPlayer.add(before)
            }
            setActiveQueueId(id)
            const queue = await getQueue()

            setActiveQueue(queue)
        }
        if (!isChanging) {

            const index=activeTracks?.findIndex((item:any)=>item.url==track.url)
           await TrackPlayer.skip(index);
            await TrackPlayer.play()
        }
    }


    return (
      
        <FlatList
            contentContainerStyle={
                {
                    paddingTop: 10,
                    paddingBottom: 128
                }
            }
            ListFooterComponent={Separator}
            ItemSeparatorComponent={Separator}
            data={tracks}
            renderItem={({ item, index }) => <Song item={item} id={id} onTrackSelect={onTrackSelect}></Song>}
        >

        </FlatList>
    )
}

const styles = StyleSheet.create({
    hiddenItem: {
        alignItems: 'center',
        backgroundColor: 'red',
        justifyContent: 'center',
        height: '100%',
        width: 75, 
      },
      hiddenText: {
        color: 'white',
      },
})