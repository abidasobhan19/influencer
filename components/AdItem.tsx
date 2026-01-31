import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AdItemProps = {
    height: number;
};

export default function AdItem({ height }: AdItemProps) {
    return (
        <View style={[styles.container, { height }]}>
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={styles.background}
            >
                <View style={styles.adLabelContainer}>
                    <Text style={styles.adLabel}>Sponsored</Text>
                </View>

                <View style={styles.content}>
                    <Ionicons name="rocket" size={80} color="white" style={styles.icon} />
                    <Text style={styles.title}>Boost Your Reach!</Text>
                    <Text style={styles.description}>
                        Join our premium creator program and start earning more today.
                    </Text>

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Learn More</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    adLabelContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    adLabel: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        alignItems: 'center',
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#e0e0e0',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 30,
    },
    buttonText: {
        color: '#3b5998',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
