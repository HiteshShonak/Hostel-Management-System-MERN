import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useAuth } from '@/lib/contexts/auth';
import { useTheme } from '@/lib/contexts/theme';
import { useRefreshDashboard } from '@/lib/hooks';
import {
    DayTabBar,
    MealTabBar,
    MealTimingBar,
    MealAverageRating,
    MealRatingBanner,
    MenuDishList,
    EditMenuModal,
    RateMealModal,
    EditTimingsModal,
    useMessMenuController,
} from '@/components/mess';

export default function MessMenuPage() {
    const { user } = useAuth();
    const { colors } = useTheme();
    const isMessStaff = user?.role === 'mess_staff' || user?.role === 'admin';
    const { refreshing, onRefresh } = useRefreshDashboard();

    const {
        today,
        selectedDay,
        setSelectedDay,
        selectedMeal,
        setSelectedMeal,
        showEditModal,
        setShowEditModal,
        editItems,
        setEditItems,
        ratingMeal,
        setRatingMeal,
        showTimingModal,
        setShowTimingModal,
        editTimings,
        isLoading,
        error,
        menu,
        timings,
        currentMeals,
        currentTiming,
        currentRating,
        myCurrentRating,
        updateMenuMutation,
        updateTimingsMutation,
        handleEditMenu,
        handleSaveMenu,
        handleOpenTimingEditor,
        handleSaveTimings,
        handleRate,
        handleTimingChange,
    } = useMessMenuController();

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Mess Menu" />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading menu...</Text>
                </View>
                <BottomNav />
            </View>
        );
    }

    if (error || !menu) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Mess Menu" />
                <View style={styles.error}>
                    <Ionicons name="restaurant-outline" size={64} color={colors.textTertiary} />
                    <Text style={[styles.errorTitle, { color: colors.text }]}>Menu Not Available</Text>
                    <Text style={[styles.errorText, { color: colors.textSecondary }]}>Check back later for today's menu</Text>
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Mess Menu" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                <View style={styles.content}>
                    {/* Mess Staff: Edit Button */}
                    {isMessStaff && (
                        <Pressable style={[styles.editBtn, { backgroundColor: colors.success }]} onPress={handleEditMenu}>
                            <Ionicons name="create" size={20} color="white" />
                            <Text style={styles.editBtnText}>Edit Menu</Text>
                        </Pressable>
                    )}

                    {/* Day Selector */}
                    <DayTabBar selectedDay={selectedDay} today={today} onSelectDay={setSelectedDay} />

                    {/* Meal Tabs */}
                    <MealTabBar selectedMeal={selectedMeal} onSelectMeal={setSelectedMeal} />

                    {/* Meal Timing Display */}
                    <MealTimingBar
                        timing={currentTiming}
                        isMessStaff={isMessStaff}
                        onOpenTimingEditor={handleOpenTimingEditor}
                    />

                    {/* Average Rating */}
                    <MealAverageRating rating={currentRating} />

                    {/* Rate Button - Students and Guards - Time-based availability */}
                    {(user?.role === 'student' || user?.role === 'guard') && (
                        <MealRatingBanner
                            selectedMeal={selectedMeal}
                            selectedDay={selectedDay}
                            timings={timings}
                            myCurrentRating={myCurrentRating}
                            onOpenRateModal={() => setRatingMeal(selectedMeal)}
                        />
                    )}

                    {/* Menu Items */}
                    <MenuDishList
                        dishes={currentMeals}
                        isMessStaff={isMessStaff}
                        onEditMenu={handleEditMenu}
                    />
                </View>
            </ScrollView>

            {/* Edit Modal (Mess Staff) */}
            <EditMenuModal
                visible={showEditModal}
                selectedMeal={selectedMeal}
                selectedDay={selectedDay}
                editItems={editItems}
                isPending={updateMenuMutation.isPending}
                onChangeText={setEditItems}
                onClose={() => setShowEditModal(false)}
                onSave={handleSaveMenu}
            />

            {/* Rating Modal (Students) */}
            <RateMealModal
                ratingMeal={ratingMeal}
                onRate={handleRate}
                onClose={() => setRatingMeal(null)}
            />

            {/* Timing Editor Modal (Mess Staff) */}
            <EditTimingsModal
                visible={showTimingModal}
                selectedMeal={selectedMeal}
                editTimings={editTimings}
                isPending={updateTimingsMutation.isPending}
                onChangeTiming={handleTimingChange}
                onClose={() => setShowTimingModal(false)}
                onSave={handleSaveTimings}
            />

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    content: { padding: 16, gap: 16 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12 },
    error: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorTitle: { marginTop: 16, fontSize: 18, fontWeight: '600' },
    errorText: { marginTop: 8 },
    editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12 },
    editBtnText: { color: 'white', fontWeight: '600', fontSize: 15 },
});
