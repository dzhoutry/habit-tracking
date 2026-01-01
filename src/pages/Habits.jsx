import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import HabitCard from '../components/Habits/HabitCard';
import HabitModal from '../components/Habits/HabitModal';
import HabitCalendar from '../components/Habits/HabitCalendar';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import './Habits.css';

export default function Habits() {
    const { state, addHabit, updateHabit, deleteHabit, getStreak } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'

    const handleOpenModal = (habit = null) => {
        setSelectedHabit(habit);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedHabit(null);
    };

    const handleSaveHabit = (habitData) => {
        if (selectedHabit) {
            updateHabit(selectedHabit.id, habitData);
        } else {
            addHabit(habitData);
        }
    };

    const handleDeleteHabit = (habitId) => {
        deleteHabit(habitId);
    };

    // Sort habits by streak (highest first)
    const sortedHabits = [...state.habits].sort((a, b) => {
        return getStreak(b.id) - getStreak(a.id);
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    return (
        <div className="habits-page">
            {/* Header */}
            <header className="habits-page__header">
                <div>
                    <h1>Habits</h1>
                    <p>Track and manage your daily habits</p>
                </div>
                <div className="habits-page__actions">
                    <div className="habits-page__view-toggle">
                        <button
                            className={`view-toggle__btn ${viewMode === 'grid' ? 'view-toggle__btn--active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid view"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </button>
                        <button
                            className={`view-toggle__btn ${viewMode === 'calendar' ? 'view-toggle__btn--active' : ''}`}
                            onClick={() => setViewMode('calendar')}
                            title="Calendar view"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M6 2.5V4.5M14 2.5V4.5M2.5 8H17.5M4 4H16C16.8284 4 17.5 4.67157 17.5 5.5V16C17.5 16.8284 16.8284 17.5 16 17.5H4C3.17157 17.5 2.5 16.8284 2.5 16V5.5C2.5 4.67157 3.17157 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => handleOpenModal()}
                        icon="+"
                    >
                        New Habit
                    </Button>
                </div>
            </header>

            {/* Content */}
            {state.habits.length === 0 ? (
                <Card padding="large" className="habits-page__empty">
                    <div className="habits-page__empty-content">
                        <span className="habits-page__empty-icon">🎯</span>
                        <h3>Start building better habits</h3>
                        <p>Create your first habit and begin tracking your progress today.</p>
                        <Button variant="primary" onClick={() => handleOpenModal()}>
                            Create Your First Habit
                        </Button>
                    </div>
                </Card>
            ) : viewMode === 'grid' ? (
                <motion.div
                    className="habits-page__grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <AnimatePresence mode="popLayout">
                        {sortedHabits.map((habit) => (
                            <motion.div
                                key={habit.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="habits-page__card-wrapper"
                                onClick={() => handleOpenModal(habit)}
                            >
                                <HabitCard habit={habit} size="large" showCheckbox={false} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="habits-page__calendar-view">
                    {sortedHabits.map((habit) => (
                        <div key={habit.id} className="habits-page__calendar-item">
                            <div
                                className="habits-page__calendar-header"
                                onClick={() => handleOpenModal(habit)}
                            >
                                <span className="habits-page__calendar-emoji">{habit.emoji}</span>
                                <h3 className="habits-page__calendar-name">{habit.name}</h3>
                                <span className="habits-page__calendar-streak">🔥 {getStreak(habit.id)}</span>
                            </div>
                            <HabitCalendar habitId={habit.id} weeks={12} />
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <HabitModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                habit={selectedHabit}
                onSave={handleSaveHabit}
                onDelete={handleDeleteHabit}
            />
        </div>
    );
}
