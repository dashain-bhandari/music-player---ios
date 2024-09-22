import { useEffect, useRef } from "react";
import TrackPlayer, { Capability, RatingType, RepeatMode } from "react-native-track-player"


const SetUpTrackPlayer = async () => {

    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions(
        {
            ratingType:RatingType.Heart,
            capabilities:[Capability.Play,Capability.Pause,Capability.SkipToNext,Capability.SkipToPrevious,Capability.Stop]
        }
    )
    await TrackPlayer.setRepeatMode(RepeatMode.Queue)
}


export const useSetUpTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {

    const isSet = useRef(false)

    useEffect(() => {
        if (isSet.current) return;
        SetUpTrackPlayer().then(() => {
            isSet.current = true
            console.log("isset",isSet.current)
             onLoad?.()
        }).catch((error) => {
            console.log(error)
            isSet.current = false
          
        })

    }, [onLoad])
}
