import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';

interface LinkProgressStepsProps {
    step: 1 | 2 | 3;
}

export function LinkProgressSteps({ step }: LinkProgressStepsProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.progressSteps}>
            {([1, 2, 3] as const).map((s) => (
                <View key={s} style={styles.progressStep}>
                    <View
                        style={[
                            styles.stepCircle,
                            { backgroundColor: colors.cardBorder },
                            step >= s && styles.stepCircleActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.stepNumber,
                                { color: colors.textTertiary },
                                step >= s && styles.stepNumberActive,
                            ]}
                        >
                            {s}
                        </Text>
                    </View>
                    <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>
                        {s === 1 ? 'Parent' : s === 2 ? 'Student' : 'Confirm'}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    progressSteps: { flexDirection: 'row', justifyContent: 'center', gap: 40, marginBottom: 32 },
    progressStep: { alignItems: 'center' },
    stepCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    stepCircleActive: { backgroundColor: '#7c3aed' },
    stepNumber: { fontSize: 16, fontWeight: '600' },
    stepNumberActive: { color: 'white' },
    stepLabel: { fontSize: 13 },
});
