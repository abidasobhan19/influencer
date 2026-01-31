import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const STORY_DURATION = 5000; // 5 seconds per story

// Mock data for stories - in a real app this would come from an API based on the ID
const STORIES = [
    {
        id: '1',
        user: 'Your Story',
        avatar: 'https://i.pravatar.cc/150?u=1',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
        time: '2h'
    },
    {
        id: '2',
        user: 'alex_d',
        avatar: 'https://i.pravatar.cc/150?u=2',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80',
        time: '4h'
    },
    {
        id: '3',
        user: 'sarah_j',
        avatar: 'https://i.pravatar.cc/150?u=3',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
        time: '5h'
    },
];

export default function StoryScreen() {
    const { id } = useLocalSearchParams();
    // Find the initial story index based on the ID passed, or default to 0
    const initialIndex = STORIES.findIndex(s => s.id === id);
    const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        startProgress();
    }, [currentIndex]);

    const startProgress = () => {
        progress.setValue(0);
        Animated.timing(progress, {
            toValue: 1,
            duration: STORY_DURATION,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                goToNextStory();
            }
        });
    };

    const goToNextStory = () => {
        if (currentIndex < STORIES.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            closeStory();
        }
    };

    const goToPreviousStory = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            startProgress(); // Restart current story if it's the first one
        }
    };

    const closeStory = () => {
        router.back();
    };

    const handlePress = (evt: any) => {
        const x = evt.nativeEvent.locationX;
        if (x < width / 3) {
            goToPreviousStory();
        } else {
            goToNextStory();
        }
    };

    const currentStory = STORIES[currentIndex];

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {/* Background Image */}
            <Image source={{ uri: currentStory.image }} style={styles.image} resizeMode="cover" />

            {/* Overlay for text visibility */}
            <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.2)']}
                style={styles.overlay}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Progress Bars */}
                <View style={styles.progressBarContainer}>
                    {STORIES.map((story, index) => {
                        return (
                            <View key={story.id} style={styles.progressBarBackground}>
                                <Animated.View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            width: index === currentIndex
                                                ? progress.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['0%', '100%']
                                                })
                                                : index < currentIndex
                                                    ? '100%'
                                                    : '0%'
                                        }
                                    ]}
                                />
                            </View>
                        );
                    })}
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: currentStory.avatar }} style={styles.avatar} />
                        <Text style={styles.username}>{currentStory.user}</Text>
                        <Text style={styles.time}>{currentStory.time}</Text>
                    </View>
                    <TouchableOpacity onPress={closeStory} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Touch Area for Navigation */}
            <TouchableWithoutFeedback onPress={handlePress}>
                <View style={styles.touchArea} />
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    image: {
        width: width,
        height: height,
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    safeArea: {
        flex: 1,
        paddingTop: 10, // Extra padding for status bar area
    },
    progressBarContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        height: 3,
        marginBottom: 10,
    },
    progressBarBackground: {
        flex: 1,
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: 2,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginTop: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    username: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 10,
    },
    time: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    closeButton: {
        padding: 5,
    },
    touchArea: {
        position: 'absolute',
        top: 100, // Leave space for header
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1, // Ensure it's behind the header buttons but captures taps
    },
});
