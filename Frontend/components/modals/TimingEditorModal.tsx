import React from 'react';
import { View, Text, Pressable, Modal, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type MealType = 'Breakfast' | 'Lunch' | 'Dinner';
type TimingsType = Record<MealType, { start: string; end: string }>;

interface TimingEditorModalProps {
    visible: boolean;
    timings: TimingsType;
    onTimingsChange: (timings: TimingsType) => void;
    onSave: () => void;
    onClose: () => void;
    isSaving: boolean;
}

export function TimingEditorModal({
    visible,
    timings,
    onTimingsChange,
    onSave,
    onClose,
    isSaving,
}: TimingEditorModalProps) {
    const handleTimeChange = (meal: MealType, field: 'start' | 'end', value: string) => {
        onTimingsChange({
            ...timings,
            [meal]: { ...timings[meal], [field]: value },
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit Meal Timings</Text>
                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={24} color="#737373" />
                        </Pressable>
                    </View>
                    <Text style={styles.hint}>Changing timings will create an urgent notice</Text>

                    {(['Breakfast', 'Lunch', 'Dinner'] as MealType[]).map((meal) => (
                        <View key={meal} style={styles.row}>
                            <Text style={styles.label}>{meal}</Text>
                            <View style={styles.inputs}>
                                <TextInput
                                    style={styles.input}
                                    value={timings[meal]?.start || ''}
                                    onChangeText={(text) => handleTimeChange(meal, 'start', text)}
                                    placeholder="07:30"
                                    placeholderTextColor="#a3a3a3"
                                />
                                <Text style={styles.dash}>-</Text>
                                <TextInput
                                    style={styles.input}
                                    value={timings[meal]?.end || ''}
                                    onChangeText={(text) => handleTimeChange(meal, 'end', text)}
                                    placeholder="09:30"
                                    placeholderTextColor="#a3a3a3"
                                />
                            </View>
                        </View>
                    ))}

                    <Pressable
                        style={[styles.saveBtn, isSaving && styles.btnDisabled]}
                        onPress={onSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.saveBtnText}>Save Timings</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0a0a0a',
    },
    hint: {
        fontSize: 13,
        color: '#737373',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0a0a0a',
        width: 100,
    },
    inputs: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        backgroundColor: '#fafafa',
        width: 70,
        textAlign: 'center',
    },
    dash: {
        fontSize: 16,
        color: '#737373',
    },
    saveBtn: {
        backgroundColor: '#16a34a',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    btnDisabled: {
        opacity: 0.7,
    },
    saveBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
