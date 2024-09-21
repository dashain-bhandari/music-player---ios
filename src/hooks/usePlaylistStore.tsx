import AsyncStorage from "@react-native-async-storage/async-storage";
import { Track } from "react-native-track-player";
import { create } from "zustand";

type playlist = {
    name: string
    songs: Track[]
}


type playlistStore = {
    playlists: playlist[]
    getPlaylist: () => Promise<playlist[]>
    createPlaylist: (name: string) => void
    removePlaylist: (name: string) => void
}

const getPlaylists = async (): Promise<playlist[]> => {
    try {
        const playlists = await AsyncStorage.getItem("playlist");
        if (playlists) {
            return JSON.parse(playlists)
        }
        return []
    } catch (error) {
        return []
    }
}
const usePlayliststore = create<playlistStore>()((set) => ({
    playlists: []
    ,
    getPlaylist: async (): Promise<playlist[]> => {
        try {
            const playlists = await AsyncStorage.getItem("playlist");

            if (playlists) {
                set((state)=>({
                    playlists:JSON.parse(playlists)
                }))
            }
            return []
        } catch (error) {
            return []
        }
    },
    createPlaylist: (name: string) => {

        set((state) => (
            {
                playlists: [...state.playlists, {
                    name: "",
                    songs: []
                }]
            }
        ));

    },
    removePlaylist: (name: string) => {

        set((state) => (
            {
                playlists: state.playlists.filter((i) => i.name !== name)
            }
        ));

    },
}))

export const usePlaylist = () => usePlayliststore((state) => state)