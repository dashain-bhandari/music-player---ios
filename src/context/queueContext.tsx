import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const QueueContext = createContext<any>({

});

export const QueueContextProvider=({children}:any)=>{

    const [activeQueue,setActiveQueue]=useState<any>();
    const [activeQ,setActiveQ]=useState<any>();
    const [queueOffset,setQueueOffset]=useState<any>(1);
    const [shuffle,setShuffle]=useState<any>();
    const [showQueue,setShowQueue]=useState<any>()
    const [activeTracks,setActiveTracks]=useState<any>()
    const [playlists, setPlaylists] = useState<any>([]);

    useEffect(() => {
        const getPlaylist = async () => {
          try {
            let playlist = await AsyncStorage.getItem("Playlist")
            console.log(playlist)
            playlist && setPlaylists(JSON.parse(playlist))
          } catch (error) {
            console.log(error)
          }
    
        }
        getPlaylist()
      }, [])
    return <QueueContext.Provider value={{activeQueue,setActiveQueue,activeQ,setActiveQ,shuffle,setShuffle,showQueue,setShowQueue,activeTracks,setActiveTracks,queueOffset,setQueueOffset,playlists,setPlaylists}}>
{
    children
}
    </QueueContext.Provider>
}