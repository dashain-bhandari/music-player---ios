import { Image, StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native'
import React from 'react'
import { useActiveTrack } from 'react-native-track-player'
import { UnknownTrack } from '../assets/image';
import { defaultStyles } from '../styles';
import { PlayPause, SkipNext } from './PlayingControls';
import { useLastActiveTrack } from '../hooks/useLastActiveTrack';
import { useNavigation } from '@react-navigation/native';
import { MovingText } from './MovingText';

export default function FloatingPlayer({ style }: ViewProps) {
    const navigation = useNavigation<any>()
    const activeTrack = useActiveTrack();
    const lastTrack = useLastActiveTrack();
    const displayedTrack = activeTrack ?? lastTrack
    if (!displayedTrack) {
        return null;
    }
    return (
        <TouchableOpacity style={style} activeOpacity={0.9} onPress={() => {
            navigation.navigate("Player");

        }}>
            <>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={{ uri: displayedTrack?.artwork ?? UnknownTrack }} style={styles.artwork}></Image>
                    <View style={{
                        flex: 1,
                        overflow: 'hidden',
                        marginLeft: 10,
                    }}>
                        <MovingText style={styles.title} text={displayedTrack?.title ?? ""} animationThreshold={25}></MovingText>
                    </View>
                    <View style={{
                        flexDirection: "row", alignItems: "center", gap: 10, marginRight: 16,
                        paddingLeft: 16,
                    }}>
                        <PlayPause iconSize={24} />
                        <SkipNext iconSize={30} />
                    </View>
                </View>

            </>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    artwork: {
        width: 40,
        height: 40,
        borderRadius: 8
    },
    title: {
        ...defaultStyles.text,
        fontWeight: 600,
        fontSize: 18,
        paddingLeft: 10
    },
    container: {
        overflow: "hidden",
        marginLeft: 10,
        flex: 1
    }
})