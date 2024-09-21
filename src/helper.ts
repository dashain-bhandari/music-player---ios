import { useContext } from "react";
import { QueueContext } from "./context/queueContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const generateId=(songList:string,search?:string)=>{
return `${songList}${`-${search}`||""}`
}

export  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
      } 
    return array
}


export const addToPlaylist=(track:any,playlistName:string,playlists:any,setPlaylists:any)=>{


const index=playlists.findIndex((item:any)=>item.name==playlistName)
if (index !== -1) {
  
  const newArr = playlists.map((playlist: any, i: number) => {
    if (i === index) {
      return {
        ...playlist, 
        songs: playlist?.songs?.length > 0 
          ? [...playlist.songs, track] 
          : [track], 
      };
    }
    return playlist; 
  });

console.log(newArr[index])
console.log("neww",newArr)
setPlaylists(newArr)
AsyncStorage.setItem("Playlist",JSON.stringify(newArr))
}}