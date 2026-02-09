import React, { useState } from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface AvatarProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}

interface AvatarImageProps {
    src: string;
    alt?: string;
}

interface AvatarFallbackProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export function Avatar({ style, children }: AvatarProps) {
    return <View style={[styles.avatar, style]}>{children}</View>;
}

export function AvatarImage({ src, alt }: AvatarImageProps) {
    const [error, setError] = useState(false);

    if (error) return null;

    return (
        <Image
            source={{ uri: src }}
            style={styles.image}
            onError={() => setError(true)}
        />
    );
}

export function AvatarFallback({ children, style }: AvatarFallbackProps) {
    return (
        <View style={[styles.fallback, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    fallback: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
});
