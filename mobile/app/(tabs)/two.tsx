import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3 - 2;

const DUMMY_MY_VIDEOS = Array.from({ length: 12 }).map((_, i) => ({
  id: i.toString(),
  image: `https://picsum.photos/200/300?random=${i}`,
  views: `${Math.floor(Math.random() * 50)}K`
}));

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('videos');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header / Cover */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#8E2DE2', '#4A00E0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.coverImage}
        />
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=1' }}
            style={styles.profileImage}
          />
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#1DA1F2" />
          </View>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.handle}>@johndoe_official</Text>
        <Text style={styles.bio}>
          🎥 Creating moments that matter
          {'\n'}✈️ Traveler | 💻 Tech | 🎨 Art
          {'\n'}👇 Check out my latest course!
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1.2M</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>450</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8.5M</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Monetization Dashboard */}
      <View style={styles.section}>
        <LinearGradient
          colors={['#11998e', '#38ef7d']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.monetizationCard}
        >
          <View style={styles.monetizationHeader}>
            <View style={styles.monetizationTitleRow}>
              <View style={styles.iconBg}>
                <Ionicons name="diamond" size={18} color="#11998e" />
              </View>
              <Text style={styles.monetizationStatus}>Creator Program</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </View>

          <View style={styles.earningsContainer}>
            <Text style={styles.earningsLabel}>Total Earnings</Text>
            <Text style={styles.earningsValue}>$1,250.45</Text>
          </View>

          <View style={styles.monetizationStats}>
            <View style={styles.statBox}>
              <Text style={styles.subStatLabel}>This Month</Text>
              <Text style={styles.subStatValue}>$340.20</Text>
            </View>
            <View style={styles.verticalDividerLight} />
            <View style={styles.statBox}>
              <Text style={styles.subStatLabel}>RPM</Text>
              <Text style={styles.subStatValue}>$1.05</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Content Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
          onPress={() => setActiveTab('videos')}
        >
          <Ionicons name="grid-outline" size={24} color={activeTab === 'videos' ? '#333' : '#999'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
          onPress={() => setActiveTab('likes')}
        >
          <Ionicons name="heart-outline" size={24} color={activeTab === 'likes' ? '#333' : '#999'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'private' && styles.activeTab]}
          onPress={() => setActiveTab('private')}
        >
          <Ionicons name="lock-closed-outline" size={24} color={activeTab === 'private' ? '#333' : '#999'} />
        </TouchableOpacity>
      </View>

      {/* Content Grid */}
      <View style={styles.gridContainer}>
        {DUMMY_MY_VIDEOS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.gridItem}>
            <Image source={{ uri: item.image }} style={styles.gridImage} />
            <View style={styles.viewsOverlay}>
              <Ionicons name="play-outline" size={12} color="white" />
              <Text style={styles.viewsText}>{item.views}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  coverImage: {
    width: '100%',
    height: 120,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  userInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  handle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  bio: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
    lineHeight: 20,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    width: '30%',
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#eee',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  editProfileButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  editProfileText: {
    fontWeight: '600',
    color: '#333',
  },
  shareButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  monetizationCard: {
    borderRadius: 12,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  monetizationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  monetizationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  monetizationStatus: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  earningsContainer: {
    marginBottom: 15,
  },
  earningsLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginBottom: 2,
  },
  earningsValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  monetizationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDividerLight: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  subStatLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
  },
  subStatValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: 150,
    marginBottom: 1,
    marginRight: 1,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  viewsOverlay: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 3,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
