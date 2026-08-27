import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { EmergencyContact } from '@/lib/types';

interface EmergencyContactsListProps {
    contacts?: EmergencyContact[];
    isLoading: boolean;
}

export function EmergencyContactsList({ contacts, isLoading }: EmergencyContactsListProps) {
    const { colors, isDark } = useTheme();

    const dialPhone = (phone: string) => Linking.openURL(`tel:${phone}`);

    const getContactIcon = (type?: string) => {
        switch (type) {
            case 'medical': return 'medkit';
            case 'police': return 'shield';
            case 'security': return 'lock-closed';
            case 'warden': return 'person';
            default: return 'call';
        }
    };

    return (
        <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Contacts</Text>
            <View style={styles.contactsList}>
                {isLoading && <ActivityIndicator color={colors.primary} />}
                {contacts && contacts.length > 0 ? (
                    contacts.map((contact, index) => (
                        <Pressable
                            key={index}
                            style={[
                                styles.contactCard,
                                {
                                    backgroundColor: isDark ? '#3f1118' : '#fef2f2',
                                    borderColor: isDark ? '#5c2228' : '#fee2e2',
                                },
                            ]}
                        >
                            <View style={[styles.contactIcon, { backgroundColor: isDark ? 'rgba(251,113,133,0.15)' : 'white' }]}>
                                <Ionicons
                                    name={getContactIcon(contact.type) as any}
                                    size={24}
                                    color={isDark ? '#fb7185' : '#dc2626'}
                                />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={[styles.contactRole, { color: isDark ? '#fca5a5' : '#0a0a0a' }]}>{contact.name}</Text>
                                <Text style={[styles.contactPhone, { color: isDark ? '#fb7185' : '#dc2626' }]}>{contact.phone}</Text>
                            </View>
                            <Pressable
                                style={[styles.callBtn, { backgroundColor: isDark ? '#be123c' : '#dc2626' }]}
                                onPress={() => dialPhone(contact.phone)}
                            >
                                <Ionicons name="call" size={20} color="white" />
                            </Pressable>
                        </Pressable>
                    ))
                ) : !isLoading ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="call-outline" size={48} color={colors.textTertiary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No contacts available</Text>
                    </View>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
    contactsList: { gap: 12 },
    contactCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1 },
    contactIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    contactInfo: { flex: 1, marginLeft: 16 },
    contactRole: { fontSize: 14, fontWeight: '600' },
    contactPhone: { fontSize: 14, marginTop: 2 },
    callBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 15, marginTop: 8 },
});
