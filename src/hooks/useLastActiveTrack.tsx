import { useEffect, useState } from "react";
import TrackPlayer, { Track, useActiveTrack } from "react-native-track-player"

export const useLastActiveTrack=()=>{

const activeTrack=useActiveTrack();
const [lastTrack,setLastTrack]=useState<Track>()

useEffect(()=>{
const getTrack=()=>{
    if(!activeTrack){
        return;
    }
    setLastTrack(activeTrack);
    return lastTrack
}
getTrack()
},[activeTrack])

}