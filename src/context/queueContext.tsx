import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { Event, useTrackPlayerEvents } from 'react-native-track-player';

export const QueueContext = createContext<any>({

});

export const QueueContextProvider=({children}:any)=>{

    const [activeQueue,setActiveQueue]=useState<any>();
    const [lastActive,setLastActive]=useState<any>();
    const [activeQ,setActiveQ]=useState<any>();
    const [queueOffset,setQueueOffset]=useState<any>(1);
    const [shuffle,setShuffle]=useState<any>();
    const [showQueue,setShowQueue]=useState<any>()
    const [activeTracks,setActiveTracks]=useState<any>()

    const [playlists, setPlaylists] = useState<any>([]);

    useTrackPlayerEvents([Event.PlaybackActiveTrackChanged
    ], async (event) => {
        if (event.type == Event.PlaybackActiveTrackChanged) {
           setLastActive(event.lastTrack)
        }
    })
    useEffect(() => {
        const getPlaylist = async () => {
          try {
            let playlist = await AsyncStorage.getItem("Playlist")
           
            playlist && setPlaylists(JSON.parse(playlist))
          } catch (error) {
            console.log(error)
          }
    
        }
        getPlaylist()
      }, [])
    return <QueueContext.Provider value={{lastActive,setLastActive,activeQueue,setActiveQueue,activeQ,setActiveQ,shuffle,setShuffle,showQueue,setShowQueue,activeTracks,setActiveTracks,queueOffset,setQueueOffset,playlists,setPlaylists}}>
{
    children
}
    </QueueContext.Provider>
}