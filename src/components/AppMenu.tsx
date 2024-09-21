import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { MenuView } from '@react-native-menu/menu'
import { useFavorites } from '../hooks/useLibraryStore'
import { useNavigation } from '@react-navigation/native'
import { useQueue } from '../hooks/useQueueStore'
import TrackPlayer from 'react-native-track-player'
import { QueueContext } from '../context/queueContext'
import { getQueue } from 'react-native-track-player/lib/src/trackPlayer'

export default function AppMenu({ track,swipeableRow, children }: any) {

    const { toggleTrackFavorite } = useFavorites()
    const isFavorite = track.rating == 1
    const { activeQueueId } = useQueue()
    const {activeTracks,setActiveTracks}=useContext(QueueContext)
    const navigation = useNavigation<any>()
    const handlePressAction = async (id: string) => {
       
        if (id == "add-to-playlist") {
            navigation.navigate("AddToPlaylist", {
                track: track
            })
            swipeableRow.current!?.close()
        }
        if (id == "remove-from-favorites") {
            toggleTrackFavorite(track);
            console.log("actibe queue id",activeQueueId)
            if (activeQueueId?.startsWith("Favorites")) {
                const queues=await getQueue();
                const trackToRemove=queues.findIndex((item)=>item.url==track.url);

               trackToRemove && await TrackPlayer.remove(trackToRemove);
                const queue=await TrackPlayer.getQueue()
                setActiveTracks(queue)
              
            }
            swipeableRow.current!?.close()
        }
        if (id == "add-to-favorites") {
            toggleTrackFavorite(track);
            console.log("actibe queue id",activeQueueId)
            if (activeQueueId?.startsWith("Favorites")) {
                
                await TrackPlayer.add(track)
                const queue=await TrackPlayer.getQueue()
                setActiveTracks(queue)
            }
            swipeableRow.current!?.close()
        }
       
    }


    return (
        <MenuView
            onPressAction={({ nativeEvent }) => {
                handlePressAction(nativeEvent.event);
            }}

            actions={[
                {
                    id: isFavorite ? "remove-from-favorites" : "add-to-favorites",
                    title: isFavorite ? "Remove from favorites" : "Add to Favorites",
                    image: isFavorite ? "star.fill" : "star"
                }, {
                    id: "add-to-playlist",
                    title: "Add to playlist",
                    image: "plus"
                }
            ]}>
            {
                children
            }
        </MenuView>
    )
}

const styles = StyleSheet.create({})