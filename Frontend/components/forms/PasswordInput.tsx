import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    showLeftIcon?: boolean;
}

// Reusable password input with visibility toggle
export function PasswordInput({
    value,
    onChangeText,
    placeholder = 'Password',
    showLeftIcon = false,
    ...props
}: PasswordInputProps) {
    const { colors } = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {showLeftIcon && (
                <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.textSecondary}
                    style={styles.leftIcon}
                />
            )}
            <TextInput
                style={[
                    styles.input,
                    { color: colors.text },
                    showLeftIcon && { paddingHorizontal: 12 }
                ]}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                {...props}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
    },
    leftIcon: {
        paddingLeft: 16,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    eyeIcon: {
        paddingRight: 16,
        paddingLeft: 8,
    },
});
