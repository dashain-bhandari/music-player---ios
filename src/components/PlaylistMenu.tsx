import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { MenuView } from '@react-native-menu/menu'
import { useFavorites } from '../hooks/useLibraryStore'
import { useNavigation } from '@react-navigation/native'
import { useQueue } from '../hooks/useQueueStore'
import TrackPlayer from 'react-native-track-player'
import { QueueContext } from '../context/queueContext'
import { getQueue } from 'react-native-track-player/lib/src/trackPlayer'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function PlaylistMenu({ track, playlistName, swipeableRow, children }: any) {

    const { toggleTrackFavorite } = useFavorites()
    const isFavorite = track.rating == 1
    const { activeQueueId } = useQueue()
    const { activeTracks, setActiveTracks } = useContext(QueueContext)
    const { playlists, setPlaylists } = useContext(QueueContext)
    const navigation = useNavigation<any>()
    const handlePressAction = async (id: string) => {

        if (id == "remove-from-playlist") {
            console.log(playlistName)
            console.log(playlists)
            const playlist = playlists?.find((item: any) => item.name == playlistName)
            console.log("playlist", playlist)
            const filteredSongs = playlist?.songs?.filter((item: any) => item.url !== track?.url)
            console.log("filtered", filteredSongs)

            let newArr = [...playlists]
            newArr = newArr.map((item) => {
                if (item?.name == playlistName) {
                    return { ...item, songs: filteredSongs }
                }
                return item
            })
            setPlaylists(newArr);
             AsyncStorage.setItem("Playlist",JSON.stringify(newArr))
            swipeableRow.current!?.close()
        }
        if (id == "remove-from-favorites") {
            toggleTrackFavorite(track);
            console.log("actibe queue id", activeQueueId)
            if (activeQueueId?.startsWith("Favorites")) {
                const queues = await getQueue();
                const trackToRemove = queues.findIndex((item) => item.url == track.url);

                trackToRemove && await TrackPlayer.remove(trackToRemove);
                const queue = await TrackPlayer.getQueue()
                setActiveTracks(queue)

            }
            swipeableRow.current!?.close()
        }
        if (id == "add-to-favorites") {
            toggleTrackFavorite(track);
            console.log("actibe queue id", activeQueueId)
            if (activeQueueId?.startsWith("Favorites")) {

                await TrackPlayer.add(track)
                const queue = await TrackPlayer.getQueue()
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
                    id: "remove-from-playlist",
                    title: "Remove from playlist",
                    image: "minus"
                }
            ]}>
            {
                children
            }
        </MenuView>
    )
}

const styles = StyleSheet.create({})