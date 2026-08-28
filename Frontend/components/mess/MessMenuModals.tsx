import React from 'react';
import { useMessMenuController } from './useMessMenuController';
import { EditMenuModal } from './EditMenuModal';
import { RateMealModal } from './RateMealModal';
import { EditTimingsModal } from './EditTimingsModal';

interface MessMenuModalsProps {
    controller: ReturnType<typeof useMessMenuController>;
}

/**
 * Composite modal container for Mess Menu actions:
 * Dish Editor, Student Rating, and Staff Timing Editor.
 */
export function MessMenuModals({ controller }: MessMenuModalsProps) {
    const {
        showEditModal,
        setShowEditModal,
        selectedMeal,
        selectedDay,
        editItems,
        setEditItems,
        updateMenuMutation,
        handleSaveMenu,
        ratingMeal,
        setRatingMeal,
        handleRate,
        showTimingModal,
        setShowTimingModal,
        editTimings,
        updateTimingsMutation,
        handleTimingChange,
        handleSaveTimings,
    } = controller;

    return (
        <>
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
        </>
    );
}
