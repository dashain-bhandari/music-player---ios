import { getQueue } from "react-native-track-player/lib/src/trackPlayer"

export const useActiveQueue=async()=>{
    const activeQueue=await getQueue();

    return {activeQueue}
}