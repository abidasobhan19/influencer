import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DUMMY_STORIES = [
    { id: '1', name: 'Your Story', avatar: 'https://i.pravatar.cc/150?u=1', isUser: true },
    { id: '2', name: 'alex_d', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'sarah_j', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'mike_t', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', name: 'emily_r', avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: '6', name: 'chris_p', avatar: 'https://i.pravatar.cc/150?u=6' },
];

export default function StoryList() {
    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {DUMMY_STORIES.map((story) => (
                    <TouchableOpacity
                        key={story.id}
                        style={styles.storyItem}
                        onPress={() => router.push(`/story/${story.id}`)}
                    >
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#C13584', '#E1306C', '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientBorder}
                            >
                                <View style={styles.whiteBorder}>
                                    <Image source={{ uri: story.avatar }} style={styles.avatar} />
                                </View>
                            </LinearGradient>
                            {story.isUser && (
                                <View style={styles.addIconContainer}>
                                    <Text style={styles.addIconText}>+</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.username} numberOfLines={1}>
                            {story.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
        backgroundColor: '#000',
    },
    scrollContent: {
        paddingHorizontal: 10,
    },
    storyItem: {
        alignItems: 'center',
        marginRight: 15,
        width: 70,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 5,
    },
    gradientBorder: {
        width: 68,
        height: 68,
        borderRadius: 34,
        justifyContent: 'center',
        alignItems: 'center',
    },
    whiteBorder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    addIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1DA1F2',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    addIconText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    username: {
        color: '#FFF',
        fontSize: 11,
    },
});
