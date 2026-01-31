import React, { useMemo, useRef, useState } from 'react';
import { FlatList, View, ViewToken } from 'react-native';
import AdItem from './AdItem';
import VideoPost from './VideoPost';

const DUMMY_VIDEOS = [
    {
        id: '1',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        username: 'bunny_lover',
        description: 'Big Buck Bunny is back! 🐰 #animation #bunny',
        likes: '1.2M',
        comments: '40K',
        shares: '10K',
        avatar: 'https://i.pravatar.cc/150?u=10',
    },
    {
        id: '2',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        username: 'dreamer_art',
        description: 'Surreal dreams... 🐘 #art #3d',
        likes: '850K',
        comments: '12K',
        shares: '5K',
        avatar: 'https://i.pravatar.cc/150?u=11',
    },
    {
        id: '3',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        username: 'tech_guru',
        description: 'Checking out the new features! 📱 #tech #review',
        likes: '2.1M',
        comments: '100K',
        shares: '50K',
        avatar: 'https://i.pravatar.cc/150?u=12',
    },
    {
        id: '4',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        username: 'scifi_fan',
        description: 'Epic sci-fi action! 🤖 #movie #scifi',
        likes: '500K',
        comments: '5K',
        shares: '2K',
        avatar: 'https://i.pravatar.cc/150?u=13',
    },
    {
        id: '5',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        username: 'dragon_tamer',
        description: 'The search for the dragon... 🐉 #fantasy',
        likes: '900K',
        comments: '20K',
        shares: '8K',
        avatar: 'https://i.pravatar.cc/150?u=14',
    },
];

export default function VideoFeed({ height }: { height: number }) {
    // Inject ads after every 2 videos
    const dataWithAds = useMemo(() => {
        const result = [];
        let videoCount = 0;

        DUMMY_VIDEOS.forEach((video, index) => {
            result.push({ type: 'video', ...video });
            videoCount++;

            if (videoCount % 2 === 0) {
                result.push({ type: 'ad', id: `ad-${index}` });
            }
        });
        return result;
    }, []);

    const [activeVideoId, setActiveVideoId] = useState(dataWithAds[0].id);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setActiveVideoId(viewableItems[0].item.id);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderItem = ({ item }: { item: any }) => {
        if (item.type === 'ad') {
            return <AdItem height={height} />;
        }
        return <VideoPost item={item} isActive={item.id === activeVideoId} height={height} />;
    };

    return (
        <View style={{ height, backgroundColor: 'black' }}>
            <FlatList
                data={dataWithAds}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                decelerationRate="fast"
                snapToInterval={height}
                snapToAlignment="start"
            />
        </View>
    );
}
