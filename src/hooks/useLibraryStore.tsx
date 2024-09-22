import { Track } from "react-native-track-player"
import { create } from "zustand"
import { TrackWithPlaylist } from "../types"
import {library} from "../assets/songs/new.ts"
type LibraryStore = {
    tracks: any[],
    toggleTrackFavorite: (track: Track) => void,
    addToPlaylist: (track: Track, playlistName: string) => void

}

const useLibraryStore = create<LibraryStore>()((set) => ({
    tracks: library,
    toggleTrackFavorite: (track) => set((state) => ({
        tracks: state.tracks.map((item) => {

            if (item.url == track.url) {
                
                return {
                    ...item, 
                    rating:item.rating? 0 :1
                }
            }
            return item
        })
    })),
    addToPlaylist: () => { }
}))

export const useTracks = () => useLibraryStore((state) => state.tracks);

export const useFavorites = () => {
    const tracks = useLibraryStore((state) =>
        state.tracks
    )
    const favorites = tracks?.filter((i) => i.rating == 1)

    const toggleTrackFavorite = useLibraryStore((state) => state.toggleTrackFavorite)

    return { favorites, toggleTrackFavorite }
}