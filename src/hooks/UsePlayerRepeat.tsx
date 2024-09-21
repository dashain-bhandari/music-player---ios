import { useCallback, useEffect, useState } from "react"
import TrackPlayer, { RepeatMode } from "react-native-track-player"

export const usePlayerRepeatMode=()=>{
    const [repeatMode,setRepeat]=useState<RepeatMode>()
console.log(repeatMode)
    const changeRepeatMode=useCallback(async(mode:RepeatMode)=>{
await TrackPlayer.setRepeatMode(mode)
setRepeat(mode)
    },[])
    useEffect(()=>{
TrackPlayer.getRepeatMode().then(setRepeat)
    },[])

    return {repeatMode,changeRepeatMode}
}