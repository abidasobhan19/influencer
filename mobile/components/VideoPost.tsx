import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const { width, height: screenHeight } = Dimensions.get('window');
// Adjust height to account for bottom tab bar and story section
// This is an approximation; flex layout in parent is better usually, but for FlatList paging, fixed height is often needed.
// We will try to use flex in the parent to determine item height if possible, or pass it down.
// For now, let's assume it takes most of the screen.

type VideoPostProps = {
    item: {
        id: string;
        videoUrl: string;
        username: string;
        description: string;
        likes: string;
        comments: string;
        shares: string;
        avatar: string;
    };
    isActive: boolean;
    height: number;
};

export default function VideoPost({ item, isActive, height }: VideoPostProps) {
    const video = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (isActive) {
            video.current?.playAsync();
            setIsPlaying(true);
        } else {
            video.current?.pauseAsync();
            setIsPlaying(false);
        }
    }, [isActive]);

    const togglePlayPause = async () => {
        if (!video.current) return;
        if (isPlaying) {
            await video.current.pauseAsync();
            setIsPlaying(false);
        } else {
            await video.current.playAsync();
            setIsPlaying(true);
        }
    };

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        setStatus(status);
        if (status.isLoaded) {
            setSliderValue(status.positionMillis);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);
        }
    };

    const onSliderValueChange = async (value: number) => {
        if (video.current) {
            await video.current.setPositionAsync(value);
        }
    };

    return (
        <View style={[styles.container, { height }]}>
            <TouchableWithoutFeedback onPress={togglePlayPause}>
                <View style={styles.videoContainer}>
                    {Platform.OS === 'web' ? (
                        <video
                            ref={(ref) => {
                                if (ref) {
                                    (video as any).current = ref;
                                }
                            }}
                            src={item.videoUrl}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                            loop
                            playsInline
                            muted
                            autoPlay={isActive}
                        />
                    ) : (
                        <Video
                            ref={video}
                            style={styles.video}
                            source={{
                                uri: item.videoUrl,
                            }}
                            useNativeControls={false}
                            resizeMode={ResizeMode.COVER}
                            isLooping
                            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                        />
                    )}
                    {!isPlaying && (
                        <View style={styles.playIconContainer}>
                            <Ionicons name="play" size={60} color="rgba(255, 255, 255, 0.7)" />
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>

            <View style={styles.overlay}>
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={styles.bottomGradient}
                >
                    <View style={styles.detailsContainer}>
                        <Text style={styles.username}>@{item.username}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <View style={styles.musicRow}>
                            <Ionicons name="musical-notes" size={16} color="white" />
                            <Text style={styles.musicText}>Original Sound - {item.username}</Text>
                        </View>

                        {/* Slider */}
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={duration}
                                value={sliderValue}
                                onSlidingComplete={onSliderValueChange}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                                thumbTintColor="#FFFFFF"
                            />
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.actionsContainer}>
                    <View style={styles.profileContainer}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <View style={styles.plusIcon}>
                            <Ionicons name="add" size={12} color="white" />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="heart" size={35} color="white" />
                        <Text style={styles.actionText}>{item.likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/shop')}
                    >
                        <Ionicons name="bag-handle" size={35} color="white" />
                        <Text style={styles.actionText}>Shop</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubble-ellipses" size={35} color="white" />
                        <Text style={styles.actionText}>{item.comments}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="share-social" size={35} color="white" />
                        <Text style={styles.actionText}>{item.shares}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        backgroundColor: 'black',
    },
    videoContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    playIconContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        flexDirection: 'row',
        pointerEvents: 'box-none', // Allow touches to pass through to video for play/pause
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 250, // Increased height to accommodate slider
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingBottom: 20,
        pointerEvents: 'box-none',
    },
    detailsContainer: {
        width: '80%',
        marginBottom: 10,
    },
    username: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    description: {
        color: 'white',
        fontSize: 14,
        marginBottom: 10,
    },
    musicRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, // Added margin-bottom for spacing with slider
    },
    musicText: {
        color: 'white',
        marginLeft: 10,
    },
    sliderContainer: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    actionsContainer: {
        position: 'absolute',
        bottom: 40,
        right: 10,
        alignItems: 'center',
    },
    profileContainer: {
        marginBottom: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'white',
    },
    plusIcon: {
        position: 'absolute',
        bottom: -10,
        left: 15,
        backgroundColor: '#EA4359',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButton: {
        marginBottom: 15,
        alignItems: 'center',
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
    },
});

