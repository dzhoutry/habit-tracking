import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    format,
    addWeeks,
    subWeeks,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay
} from 'date-fns';
import { useApp } from '../context/AppContext';
import { getGreeting } from '../utils/dates';
import HabitCard from '../components/Habits/HabitCard';
import Card, { CardHeader, CardTitle, CardContent } from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressRing from '../components/UI/ProgressRing';
import './Dashboard.css';

export default function DashboardV2() {
    const { state, getTodayHabits, isHabitCompleted, getStreak } = useApp();
    const [viewMode, setViewMode] = useState('week'); // 'week' | 'month'
    const [currentDate, setCurrentDate] = useState(new Date());

    const todayHabits = getTodayHabits();
    const today = new Date();

    const handlePrev = () => {
        if (viewMode === 'week') {
            setCurrentDate(prev => subWeeks(prev, 1));
        } else {
            setCurrentDate(prev => subMonths(prev, 1));
        }
    };

    const handleNext = () => {
        if (viewMode === 'week') {
            setCurrentDate(prev => addWeeks(prev, 1));
        } else {
            setCurrentDate(prev => addMonths(prev, 1));
        }
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const calendarData = useMemo(() => {
        let start, end;
        if (viewMode === 'week') {
            start = startOfWeek(currentDate, { weekStartsOn: 1 });
            end = endOfWeek(currentDate, { weekStartsOn: 1 });
        } else {
            start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
            end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
        }
        return eachDayOfInterval({ start, end });
    }, [currentDate, viewMode]);

    const headerTitle = useMemo(() => {
        if (viewMode === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            return `Week of ${format(start, 'MMM d, yyyy')}`;
        } else {
            return format(currentDate, 'MMMM yyyy');
        }
    }, [currentDate, viewMode]);

    const completedToday = todayHabits.filter(h => isHabitCompleted(h.id)).length;
    const todayProgress = todayHabits.length > 0
        ? Math.round((completedToday / todayHabits.length) * 100)
        : 0;

    const longestStreak = state.habits.reduce((max, habit) => {
        const streak = getStreak(habit.id);
        return streak > max ? streak : max;
    }, 0);

    const viewStats = useMemo(() => {
        let total = 0;
        let completed = 0;

        calendarData.forEach(date => {
            const dateDayOfWeek = format(date, 'EEEE').toLowerCase();
            const habitsForDay = state.habits.filter(habit => {
                if (habit.frequency === 'daily') return true;
                if (habit.frequency === 'weekly' && habit.days?.includes(dateDayOfWeek)) return true;
                return false;
            });

            habitsForDay.forEach(habit => {
                total++;
                if (isHabitCompleted(habit.id, date)) {
                    completed++;
                }
            });
        });

        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { percentage, completed, total };
    }, [calendarData, state.habits, isHabitCompleted]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="dashboard"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <motion.header className="dashboard__header" variants={itemVariants}>
                <div className="dashboard__greeting">
                    <h1>{getGreeting()}! 👋</h1>
                    <p>{format(today, 'EEEE, MMMM d')}</p>
                </div>
            </motion.header>

            <motion.div className="dashboard__stats" variants={itemVariants}>
                <Card className="dashboard__stat-card" padding="medium">
                    <div className="stat-card__content">
                        <ProgressRing progress={todayProgress} size={56} strokeWidth={5} />
                        <div className="stat-card__info">
                            <span className="stat-card__value">{completedToday}/{todayHabits.length}</span>
                            <span className="stat-card__label">Today's habits</span>
                        </div>
                    </div>
                </Card>

                <Card className="dashboard__stat-card" padding="medium">
                    <div className="stat-card__content">
                        <div className="stat-card__icon stat-card__icon--streak">🔥</div>
                        <div className="stat-card__info">
                            <span className="stat-card__value">{longestStreak}</span>
                            <span className="stat-card__label">Best streak</span>
                        </div>
                    </div>
                </Card>

                <Card className="dashboard__stat-card" padding="medium">
                    <div className="stat-card__content">
                        <ProgressRing
                            progress={viewStats.percentage}
                            size={56}
                            strokeWidth={5}
                            color="var(--color-accent-secondary)"
                        />
                        <div className="stat-card__info">
                            <span className="stat-card__value">{viewStats.percentage}%</span>
                            <span className="stat-card__label">{viewMode === 'week' ? 'Weekly' : 'Monthly'} progress</span>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="dashboard__week-card" padding="medium">
                    <CardHeader className="dashboard__calendar-header">
                        <div className="dashboard__header-top">
                            <div className="dashboard__header-spacer" />
                            <CardTitle className="dashboard__calendar-title">{headerTitle}</CardTitle>
                            <div className="dashboard__toggle-wrapper">
                                <div className="dashboard__view-toggle">
                                    <div
                                        className="dashboard__toggle-slider"
                                        style={{ transform: `translateX(${viewMode === 'week' ? '0%' : '100%'})` }}
                                    />
                                    <button
                                        className={`dashboard__toggle-btn ${viewMode === 'week' ? 'dashboard__toggle-btn--active' : ''}`}
                                        onClick={() => setViewMode('week')}
                                    >
                                        Week
                                    </button>
                                    <button
                                        className={`dashboard__toggle-btn ${viewMode === 'month' ? 'dashboard__toggle-btn--active' : ''}`}
                                        onClick={() => setViewMode('month')}
                                    >
                                        Month
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard__header-bottom">
                            <div className="dashboard__calendar-nav">
                                <Button variant="ghost" size="small" onClick={handlePrev}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                </Button>
                                <Button variant="ghost" size="small" onClick={handleToday}>
                                    Today
                                </Button>
                                <Button variant="ghost" size="small" onClick={handleNext}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="dashboard__calendar-grid">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="dashboard__calendar-day-label">
                                    {day}
                                </div>
                            ))}

                            {calendarData.map((date) => {
                                const isCurrentMonth = viewMode === 'week' || isSameMonth(date, currentDate);
                                const isTodayDate = isSameDay(date, new Date());

                                const dateDayOfWeek = format(date, 'EEEE').toLowerCase();
                                const habitsForDate = state.habits.filter(habit => {
                                    if (habit.frequency === 'daily') return true;
                                    if (habit.frequency === 'weekly' && habit.days?.includes(dateDayOfWeek)) return true;
                                    return false;
                                });

                                const dayCompletedCount = habitsForDate.filter(h => isHabitCompleted(h.id, date)).length;
                                const dayTotalCount = habitsForDate.length;
                                const dayProgress = dayTotalCount > 0 ? (dayCompletedCount / dayTotalCount) * 100 : 0;

                                return (
                                    <div
                                        key={format(date, 'yyyy-MM-dd')}
                                        className={`
                                            dashboard__calendar-day
                                            ${!isCurrentMonth ? 'dashboard__calendar-day--muted' : ''}
                                            ${isTodayDate ? 'dashboard__calendar-day--today' : ''}
                                        `}
                                    >
                                        <div className="dashboard__calendar-day-indicator">
                                            <ProgressRing
                                                progress={dayProgress}
                                                size={40}
                                                strokeWidth={3}
                                                showLabel={false}
                                                color={isTodayDate ? 'var(--color-accent-primary)' : 'var(--color-accent-secondary)'}
                                            />
                                            <span className="dashboard__calendar-day-number">
                                                {format(date, 'd')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.section className="dashboard__section" variants={itemVariants}>
                <h2 className="dashboard__section-title">Today's Habits</h2>
                {todayHabits.length === 0 ? (
                    <Card padding="large" className="dashboard__empty">
                        <div className="dashboard__empty-content">
                            <span className="dashboard__empty-icon">🌱</span>
                            <h3>No habits yet</h3>
                            <p>Create your first habit to get started on your journey.</p>
                        </div>
                    </Card>
                ) : (
                    <div className="dashboard__habits-grid">
                        {todayHabits.map((habit) => (
                            <HabitCard key={habit.id} habit={habit} />
                        ))}
                    </div>
                )}
            </motion.section>
        </motion.div>
    );
}
