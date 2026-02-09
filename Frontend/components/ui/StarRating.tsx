import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    initialRating?: number;
    onRatingChange?: (rating: number) => void;
    size?: 'sm' | 'md';
}

export function StarRating({
    initialRating = 0,
    onRatingChange,
    size = 'md',
}: StarRatingProps) {
    const [rating, setRating] = useState(initialRating);

    const handlePress = (value: number) => {
        setRating(value);
        onRatingChange?.(value);
    };

    const iconSize = size === 'sm' ? 16 : 20;

    return (
        <View className="flex-row items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
                <Pressable key={value} onPress={() => handlePress(value)}>
                    <Ionicons
                        name={rating >= value ? 'star' : 'star-outline'}
                        size={iconSize}
                        color={rating >= value ? '#fbbf24' : '#d4d4d4'}
                    />
                </Pressable>
            ))}
        </View>
    );
}
