import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import './HabitCard.css';

export default function HabitCard({ habit, size = 'medium', showStreak = true, showProgress = true, showCheckbox = true }) {
    const { toggleCompletion, isHabitCompleted, getStreak, getWeeklyProgress } = useApp();

    const completed = isHabitCompleted(habit.id);
    const streak = getStreak(habit.id);
    const weeklyProgress = getWeeklyProgress(habit.id);

    const handleToggle = (e) => {
        e.stopPropagation(); // Prevent click from bubbling to parent
        toggleCompletion(habit.id);
    };

    return (
        <motion.div
            className={`habit-card habit-card--${size} ${completed ? 'habit-card--completed' : ''}`}
            style={{ '--habit-color': habit.color || 'var(--color-accent-primary)' }}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
        >
            <div className="habit-card__content">
                <div className="habit-card__header">
                    <span className="habit-card__emoji">{habit.emoji || '✨'}</span>
                    <h3 className="habit-card__name">{habit.name}</h3>
                </div>

                {habit.description && size !== 'small' && (
                    <p className="habit-card__description">{habit.description}</p>
                )}

                <div className="habit-card__meta">
                    {showStreak && streak > 0 && (
                        <span className="habit-card__streak">
                            🔥 {streak} day{streak !== 1 ? 's' : ''}
                        </span>
                    )}

                    {showProgress && size !== 'small' && (
                        <span className="habit-card__progress">
                            {weeklyProgress.completed}/{weeklyProgress.total} this week
                        </span>
                    )}
                </div>
            </div>

            {showCheckbox && (
                <button
                    className={`habit-card__check ${completed ? 'habit-card__check--done' : ''}`}
                    onClick={handleToggle}
                    aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                    {completed ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M5 12L10 17L19 8"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    ) : (
                        <div className="habit-card__check-empty" />
                    )}
                </button>
            )}
        </motion.div>
    );
}
