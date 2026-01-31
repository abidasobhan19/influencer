import StoryList from '@/components/StoryList';
import VideoFeed from '@/components/VideoFeed';
import React, { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const [videoHeight, setVideoHeight] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.contentContainer}>
        <StoryList />
        <View
          style={styles.videoContainer}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setVideoHeight(height);
          }}
        >
          {videoHeight > 0 && <VideoFeed height={videoHeight} />}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  contentContainer: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
});
