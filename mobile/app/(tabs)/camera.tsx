import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.permissionContainer}>
                <Ionicons name="camera-outline" size={80} color="#fff" />
                <Text style={styles.permissionText}>Camera Feature</Text>
                <Text style={[styles.permissionText, { fontSize: 14, marginTop: 10, marginBottom: 20 }]}>
                    Camera recording will be available in the next update.
                </Text>
                <Text style={[styles.permissionText, { fontSize: 12, color: '#999' }]}>
                    This feature requires native camera access which is currently being configured.
                </Text>
                <TouchableOpacity style={styles.permissionButton} onPress={() => router.back()}>
                    <Text style={styles.permissionButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    permissionButton: {
        backgroundColor: '#EA4359',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 30,
    },
    permissionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
