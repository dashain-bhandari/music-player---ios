import { useCallback, useEffect, useState } from "react"
import TrackPlayer from "react-native-track-player"

export const useTrackPlayerVolume = () => {
    const [volume, setVolume] = useState<number | undefined>(undefined)

    const getVolume = useCallback(async () => {
        const vol = await TrackPlayer.getVolume()
        setVolume(vol)
    }, [])

    const updateVolume = useCallback(async (vol: number) => {
        if (vol < 0 || vol > 1) {
            return;
        }
        setVolume(vol)
        await TrackPlayer.setVolume(vol)
    }, [])

    useEffect(() => {
        getVolume()
    }, [volume])

    return { volume, updateVolume }
}