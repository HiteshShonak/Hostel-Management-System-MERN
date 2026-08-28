import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { LogEntry } from './useActivityLogsController';

interface ActivityLogCardProps {
    log: LogEntry;
    isLast: boolean;
    formatTime: (dateStr: string) => string;
    getTimeAgo: (dateStr: string) => string;
}

export function ActivityLogCard({ log, isLast, formatTime, getTimeAgo }: ActivityLogCardProps) {
    const { colors } = useTheme();
    const isExit = log.action === 'EXIT';

    return (
        <View style={styles.logItem}>
            {/* Timeline line */}
            {!isLast && <View style={[styles.timelineLine, { backgroundColor: colors.cardBorder }]} />}

            {/* Timeline dot */}
            <View style={[styles.timelineDot, { backgroundColor: isExit ? '#f59e0b' : '#16a34a' }]}>
                <Ionicons name={isExit ? 'exit-outline' : 'enter-outline'} size={14} color="white" />
            </View>

            {/* Content Card */}
            <View style={[styles.logCard, { borderLeftColor: isExit ? '#f59e0b' : '#16a34a', backgroundColor: colors.card }]}>
                {/* Header */}
                <View style={styles.logHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={[styles.actionBadge, { backgroundColor: isExit ? '#fff7ed' : '#f0fdf4' }]}>
                            <Text style={[styles.actionText, { color: isExit ? '#f59e0b' : '#16a34a' }]}>
                                {isExit ? '← OUT' : '→ IN'}
                            </Text>
                        </View>
                        {log.isLate && !isExit && (
                            <View style={[styles.lateBadge, { backgroundColor: '#fff7ed' }]}>
                                <Ionicons name="time" size={10} color="#ea580c" />
                                <Text style={[styles.lateText, { color: '#ea580c' }]}>LATE</Text>
                            </View>
                        )}
                    </View>
                    <Text style={[styles.timeAgo, { color: colors.textTertiary }]}>{getTimeAgo(log.timestamp)}</Text>
                </View>

                {/* Student Info */}
                <Text style={[styles.studentName, { color: colors.text }]}>{log.user?.name || 'Unknown'}</Text>
                <Text style={[styles.studentInfo, { color: colors.textSecondary }]}>
                    {log.user?.rollNo} • Room {log.user?.room} • {log.user?.hostel}
                </Text>
                <Text style={styles.phoneInfo}>{log.user?.phone || 'N/A'}</Text>

                {/* Footer */}
                <View style={[styles.logFooter, { borderTopColor: colors.cardBorder }]}>
                    <Text style={[styles.passReason, { color: colors.textSecondary }]} numberOfLines={2}>
                        {isExit ? (
                            `Going for: ${log.gatePass?.reason || 'Gate Pass'}`
                        ) : (
                            log.isLate ?
                                `Returned ${log.note ? log.note.replace('Student returned ', '') : 'late'}` :
                                `Returned on time`
                        )}
                    </Text>
                    <Text style={[styles.timeStamp, { color: colors.text }]}>{formatTime(log.timestamp)}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    logItem: { flexDirection: 'row', marginBottom: 16, position: 'relative' },
    timelineLine: { position: 'absolute', left: 14, top: 32, bottom: -16, width: 2 },
    timelineDot: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 12, zIndex: 1 },
    logCard: { flex: 1, borderRadius: 12, padding: 14, borderLeftWidth: 3 },
    logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    actionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    actionText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
    lateBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
    lateText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
    timeAgo: { fontSize: 12 },
    studentName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    studentInfo: { fontSize: 14, marginBottom: 2 },
    phoneInfo: { fontSize: 13, color: '#1d4ed8', marginBottom: 10 },
    logFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1 },
    passReason: { flex: 1, fontSize: 13 },
    timeStamp: { fontSize: 13, fontWeight: '600' },
});
