import TrackPlayer, { useActiveTrack } from "react-native-track-player"
import { useFavorites } from "./useLibraryStore";
import { useCallback } from "react";

export const useTrackPlayerFavorite=()=>{
    const activeTrack=useActiveTrack();
    
    const {favorites,toggleTrackFavorite}=useFavorites();
    const isFavorite=favorites.find((item)=>item.url==activeTrack?.url)?.rating==1
    const toggleFavorite=useCallback(async()=>{
       
        const id=await TrackPlayer.getActiveTrackIndex()
        if(id==null){
            return
        }
        await TrackPlayer.updateMetadataForTrack(id,{
            rating:isFavorite?0:1
        })
        console.log("active track",activeTrack)
        if(activeTrack){
            console.log("yooo")
            toggleTrackFavorite(activeTrack)
        }
    },[activeTrack,toggleTrackFavorite,isFavorite])
    return {isFavorite,toggleFavorite}
}