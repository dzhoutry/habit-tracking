import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { getLastNDays } from '../utils/dates';
import Card from '../components/UI/Card';
import ProgressRing from '../components/UI/ProgressRing';
import './SharedView.css';

export default function SharedView() {
    const { code } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSharedData = async () => {
            try {
                const { data: result, error } = await supabase.rpc('get_shared_data', {
                    share_code: code
                });

                if (error) throw error;
                if (!result) throw new Error('Share not found');

                setData(result);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSharedData();
    }, [code]);

    if (loading) {
        return (
            <div className="shared-view shared-view--loading">
                <div className="spinner"></div>
            </div>
        );
    }

    // If share doesn't exist, show error
    if (error || !data) {
        return (
            <div className="shared-view shared-view--error">
                <Card padding="large" className="shared-view__error-card">
                    <span className="shared-view__error-icon">🔍</span>
                    <h1>Share Not Found</h1>
                    <p>This share link may have expired or been removed.</p>
                </Card>
            </div>
        );
    }

    const { share_info: share, user_name, habits, completions } = data;

    // Helper functions re-implemented locally for this view
    const isHabitCompleted = (habitId, date) => {
        const dateKey = format(date instanceof Date ? date : new Date(date), 'yyyy-MM-dd');
        return completions[habitId]?.[dateKey] || false;
    };

    const getStreak = (habitId) => {
        const habitCompletions = completions[habitId] || {};
        let streak = 0;
        let currentDate = new Date();

        // If not completed today, check if it was completed yesterday
        if (!isHabitCompleted(habitId, currentDate)) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        while (true) {
            const dateKey = format(currentDate, 'yyyy-MM-dd');
            if (habitCompletions[dateKey]) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    };

    // Calculate stats
    const last7Days = getLastNDays(7);
    const last30Days = getLastNDays(30);

    const weeklyStats = habits.reduce((acc, habit) => {
        last7Days.forEach(date => {
            acc.total++;
            if (isHabitCompleted(habit.id, date)) {
                acc.completed++;
            }
        });
        return acc;
    }, { completed: 0, total: 0 });

    const monthlyStats = habits.reduce((acc, habit) => {
        last30Days.forEach(date => {
            acc.total++;
            if (isHabitCompleted(habit.id, date)) {
                acc.completed++;
            }
        });
        return acc;
    }, { completed: 0, total: 0 });

    const weeklyProgress = weeklyStats.total > 0
        ? Math.round((weeklyStats.completed / weeklyStats.total) * 100)
        : 0;

    const monthlyProgress = monthlyStats.total > 0
        ? Math.round((monthlyStats.completed / monthlyStats.total) * 100)
        : 0;

    const longestStreak = habits.reduce((max, habit) => {
        const streak = getStreak(habit.id);
        return streak > max ? streak : max;
    }, 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="shared-view"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header */}
            <motion.header className="shared-view__header" variants={itemVariants}>
                <div className="shared-view__user">
                    <div className="shared-view__avatar">
                        {user_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h1>{user_name || 'User'}'s Progress</h1>
                        <p>Shared with {share.name}</p>
                    </div>
                </div>
                <div className="shared-view__branding">
                    <span className="shared-view__logo">🌿</span>
                    <span className="shared-view__app-name">Stride</span>
                </div>
            </motion.header>

            {/* Stats */}
            <motion.div className="shared-view__stats" variants={itemVariants}>
                <Card padding="medium" className="shared-view__stat-card">
                    <ProgressRing progress={weeklyProgress} size={72} strokeWidth={6} />
                    <div className="shared-view__stat-info">
                        <span className="shared-view__stat-value">{weeklyProgress}%</span>
                        <span className="shared-view__stat-label">This Week</span>
                    </div>
                </Card>

                <Card padding="medium" className="shared-view__stat-card">
                    <div className="shared-view__stat-icon">🔥</div>
                    <div className="shared-view__stat-info">
                        <span className="shared-view__stat-value">{longestStreak}</span>
                        <span className="shared-view__stat-label">Best Streak</span>
                    </div>
                </Card>

                <Card padding="medium" className="shared-view__stat-card">
                    <ProgressRing
                        progress={monthlyProgress}
                        size={72}
                        strokeWidth={6}
                        color="var(--color-accent-secondary)"
                    />
                    <div className="shared-view__stat-info">
                        <span className="shared-view__stat-value">{monthlyProgress}%</span>
                        <span className="shared-view__stat-label">This Month</span>
                    </div>
                </Card>
            </motion.div>

            {/* Habits */}
            <motion.section className="shared-view__section" variants={itemVariants}>
                <h2>Habits</h2>
                {habits.length === 0 ? (
                    <Card padding="large" className="shared-view__empty">
                        <p>No habits yet</p>
                    </Card>
                ) : (
                    <div className="shared-view__habits">
                        {habits.map(habit => {
                            const streak = getStreak(habit.id);
                            const todayCompleted = isHabitCompleted(habit.id, new Date());

                            return (
                                <Card
                                    key={habit.id}
                                    padding="medium"
                                    className={`shared-view__habit ${todayCompleted ? 'shared-view__habit--completed' : ''}`}
                                >
                                    <div className="shared-view__habit-main">
                                        <span className="shared-view__habit-emoji">{habit.emoji}</span>
                                        <div className="shared-view__habit-info">
                                            <h3>{habit.name}</h3>
                                            {habit.description && <p>{habit.description}</p>}
                                        </div>
                                    </div>
                                    <div className="shared-view__habit-stats">
                                        <div className="shared-view__habit-streak">
                                            <span className="shared-view__habit-streak-value">🔥 {streak}</span>
                                            <span className="shared-view__habit-streak-label">day streak</span>
                                        </div>
                                        <div className={`shared-view__habit-status ${todayCompleted ? 'shared-view__habit-status--done' : ''}`}>
                                            {todayCompleted ? '✓ Done today' : '○ Not yet'}
                                        </div>
                                    </div>

                                    {/* Mini calendar */}
                                    <div className="shared-view__habit-calendar">
                                        {last7Days.map(date => {
                                            const completed = isHabitCompleted(habit.id, date);
                                            return (
                                                <div
                                                    key={format(date, 'yyyy-MM-dd')}
                                                    className={`shared-view__calendar-day ${completed ? 'shared-view__calendar-day--completed' : ''}`}
                                                    title={format(date, 'MMM d')}
                                                >
                                                    <span className="shared-view__calendar-day-label">{format(date, 'E')[0]}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </motion.section>

            {/* Footer */}
            <motion.footer className="shared-view__footer" variants={itemVariants}>
                <p>Track your own habits with Stride 🌿</p>
            </motion.footer>
        </motion.div>
    );
}
