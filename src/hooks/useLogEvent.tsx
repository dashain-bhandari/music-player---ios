import { Alert } from "react-native"
import TrackPlayer, { Event, useTrackPlayerEvents } from "react-native-track-player"

const events=[
    Event.PlaybackError,Event.PlaybackState,Event.PlaybackActiveTrackChanged
]
export const useLogEvent=()=>{
    useTrackPlayerEvents(events,async(event)=>{
if(event.type==Event.PlaybackError){
    // Alert.alert("Error occurred",event.message)
}
if(event.type==Event.PlaybackState){
    // Alert.alert("Playback state",event.state)
}
if(event.type==Event.PlaybackActiveTrackChanged){
   const track=await TrackPlayer.getActiveTrack()
   console.log(track)
}
    })
}