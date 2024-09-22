import { Button, StyleSheet, StyleSheetProperties, TouchableOpacity, View, ViewStyle } from "react-native"
import TrackPlayer, { RepeatMode, useIsPlaying } from "react-native-track-player"
import { useActiveTrack, useProgress } from 'react-native-track-player'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from "../constants/tokens"
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';
import { Text } from "react-native"
import { defaultStyles } from "../styles"
import { useTrackPlayerVolume } from "../hooks/useTrackPlayerVolume"
import { usePlayerRepeatMode } from "../hooks/UsePlayerRepeat"
import { useTracks } from "../hooks/useLibraryStore"
import { useQueue } from "../hooks/useQueueStore"
import { QueueContext } from "../context/queueContext"
import { useContext } from "react"
import { shuffleArray } from "../helper"
export type PlayPauseButton = {
    style?: ViewStyle,
    iconSize?: number
}

export const PlayPause = ({ style, iconSize }: PlayPauseButton) => {
    const { playing } = useIsPlaying()
    return <View>
        <TouchableOpacity activeOpacity={0.7} onPress={playing ? TrackPlayer.pause : TrackPlayer.play}>
            <FontAwesome name={playing ? "pause" : "play"} style={style} size={iconSize} color={colors.text}></FontAwesome>
        </TouchableOpacity>
    </View>
}

export const SkipNext = ({ iconSize }: { iconSize?: number }) => {
    return (<View>
        <TouchableOpacity onPress={async () => { await TrackPlayer.skipToNext() }}>
            <MaterialCommunity name={"skip-next"} size={iconSize} color={colors.text}></MaterialCommunity>
        </TouchableOpacity>
    </View>)
}

export const SkipPrevious = ({ style, iconSize }: PlayPauseButton) => {
    return (<View>
        <TouchableOpacity onPress={async () => { await TrackPlayer.skipToPrevious() }}>
            <MaterialCommunity name={"skip-previous"} style={style} size={iconSize} color={colors.text}></MaterialCommunity>
        </TouchableOpacity>
    </View>)
}


export const PlayerProgressBar = ({ style }: { style: ViewStyle }) => {
    const { duration, position } = useProgress(250)

    const progress = useSharedValue(0);
    const min = useSharedValue(0)
    const max = useSharedValue(1);
    const isSliding = useSharedValue(false);
    if (!isSliding.value) {
        progress.value = duration > 0 ? position / duration : 0
    }
    const elapsedTime = new Date(position * 1000).toISOString().substring(14, 19);
    const remaining = new Date((duration - position) * 1000).toISOString().substring(14, 19);
    return (<View style={style}>

        <Slider
            progress={progress}
            minimumValue={min}
            maximumValue={max}
            
            renderBubble={() => null}
            thumbWidth={0}
            onSlidingStart={() => isSliding.value = true}
            onValueChange={async (value) => {
                await TrackPlayer.seekTo(value * duration)
            }}
            onSlidingComplete={async (value) => {
                if (!isSliding.value) {
                    return;
                }
                isSliding.value = true;
                await TrackPlayer.seekTo(value * duration)
            }}
            theme={
                {
                    maximumTrackTintColor: colors.maximumTrackTintColor,
                    minimumTrackTintColor: colors.minimumTrackTintColor
                }
            }
        ></Slider>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <Text style={{ color: "white" }}>{elapsedTime}</Text>
            <Text style={{ color: "white" }}>-{remaining}</Text>
        </View>
    </View>)
}

export const PlayerControls = ({ style }: { style: ViewStyle }) => {
    return (<View style={{ ...style, flexDirection: "row", width: "100%", justifyContent: "center", gap: 20 }}>
        <SkipPrevious iconSize={35} />
        <PlayPause iconSize={35} />
        <SkipNext iconSize={35} />
    </View>)
}

export const PlayerVolume = ({ style }: { style: ViewStyle }) => {

    const progress = useSharedValue(0);
    const { volume, updateVolume } = useTrackPlayerVolume()
    const min = useSharedValue(0)
    const max = useSharedValue(1);
    progress.value = volume ?? 0
    return (<View style={style}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", gap: 10 }}>
            <Ionicons name="volume-low" size={30} color={"white"}></Ionicons>
            <Slider
                maximumValue={max}
                minimumValue={min}
                progress={progress}
                renderBubble={() => null}
                onValueChange={(value) => {
                    updateVolume(value)
                }}
                thumbWidth={0}
                theme={
                    {
                        minimumTrackTintColor: colors.minimumTrackTintColor,
                        maximumTrackTintColor: colors.maximumTrackTintColor
                    }
                }
            ></Slider>
            <Ionicons name="volume-high" size={30} color={"white"}></Ionicons>
        </View>
    </View>)
}


export const PlayerRpeatToggle = () => {
    const { repeatMode, changeRepeatMode } = usePlayerRepeatMode()
    const iconName = repeatMode == RepeatMode.Queue ? "repeat" : (repeatMode == RepeatMode.Track ? "repeat-once" : "repeat-off");

    return (<TouchableOpacity style={{ flexDirection: "row", justifyContent: "center" }} onPress={() => {
        const newRepeat = repeatMode == RepeatMode.Queue ? RepeatMode.Track : (repeatMode == RepeatMode.Off ? RepeatMode?.Queue : RepeatMode.Off)
        changeRepeatMode(newRepeat)
    }}>
        <MaterialCommunity name={iconName} color={colors.icon} size={30} />
    </TouchableOpacity>

    )
}


export const Play = ({tracks,id}:any) => {
  
    const { activeTracks, activeQ, setActiveQ, setActiveTracks } = useContext(QueueContext);
    const {activeQueueId,setActiveQueueId}=useQueue()
    const play=async()=>{
 console.log(tracks)
 try {
    await TrackPlayer.reset()
         await TrackPlayer.add(tracks);
         await TrackPlayer.play()
         setActiveTracks(tracks)
         setActiveQueueId(id)
 } catch (error) {
    console.log(error)
 }
        // await TrackPlayer.play()
 
      }
      
     
    return (
        <View style={{ backgroundColor: "#ccc", flexGrow: 1, borderRadius: 10 }} >
            <Button title="Play" color={colors.primary} onPress={play}></Button>
        </View>
    )
}


export const Shuffle = ({tracks,id}:any) => {

    const { activeTracks, activeQ, setActiveQ, setActiveTracks,setShuffle } = useContext(QueueContext)
    const {activeQueueId,setActiveQueueId}=useQueue()
    const shuffle = async () => {
        const shuffled=[...tracks].sort(()=>Math.random()-0.5)
    
        await TrackPlayer.reset()
        await TrackPlayer.add(shuffled);
        await TrackPlayer.play()
        setActiveTracks(tracks);
        setShuffle(true)
        setActiveQueueId(id)
      }
      
    return (<View style={{ flexGrow: 1, borderRadius: 10, borderColor: "#ccc", borderWidth: 1 }}>
        <Button title='Shuffle' color={"#ccc"} onPress={shuffle}></Button>
    </View>)
}