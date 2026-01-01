import { useMemo } from 'react';
import { format, eachDayOfInterval, eachMonthOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { useApp } from '../../context/AppContext';
import './HabitCalendar.css';

export default function HabitCalendar({ habitId }) {
    const { state, isHabitCompleted } = useApp();

    const calendarData = useMemo(() => {
        // Find the first completion date
        const completions = state.completions[habitId] || {};
        const dates = Object.keys(completions).sort();

        let startDate = new Date();
        if (dates.length > 0) {
            startDate = new Date(dates[0]);
        }

        // Ensure we start from the beginning of that month
        startDate = startOfMonth(startDate);
        const endDate = new Date(); // Today

        // Generate months
        const months = eachMonthOfInterval({ start: startDate, end: endDate });

        return months.map(monthStart => {
            const monthEnd = endOfMonth(monthStart);
            const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

            // Calculate padding for start of month (Monday start)
            const startDay = monthStart.getDay(); // 0 is Sunday
            const paddingDays = startDay === 0 ? 6 : startDay - 1;
            const padding = Array(paddingDays).fill(null);

            const days = daysInMonth.map(date => ({
                date,
                dateKey: format(date, 'yyyy-MM-dd'),
                completed: isHabitCompleted(habitId, date),
            }));

            return {
                monthLabel: format(monthStart, 'MMMM yyyy'),
                days: [...padding, ...days],
            };
        }).reverse(); // Show newest months first
    }, [habitId, state.completions, isHabitCompleted]);

    const completedDays = useMemo(() => {
        const completions = state.completions[habitId] || {};
        return Object.keys(completions).length;
    }, [habitId, state.completions]);

    // Calculate total days since first completion for rate
    const totalDaysTracked = useMemo(() => {
        const completions = state.completions[habitId] || {};
        const dates = Object.keys(completions).sort();
        if (dates.length === 0) return 1;

        const first = new Date(dates[0]);
        const today = new Date();
        const diffTime = Math.abs(today - first);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }, [habitId, state.completions]);

    const completionRate = Math.round((completedDays / totalDaysTracked) * 100) || 0;

    return (
        <div className="habit-calendar">
            <div className="habit-calendar__header">
                <h4 className="habit-calendar__title">Activity</h4>
                <div className="habit-calendar__stats-group">
                    <span className="habit-calendar__stats">
                        {completedDays} days total
                    </span>
                    <span className="habit-calendar__stats-separator">•</span>
                    <span className="habit-calendar__stats">
                        {completionRate}% consistency
                    </span>
                </div>
            </div>

            <div className="habit-calendar__months">
                {calendarData.map((month, index) => (
                    <div key={index} className="habit-calendar__month">
                        <h5 className="habit-calendar__month-title">{month.monthLabel}</h5>
                        <div className="habit-calendar__month-grid">
                            {/* Day labels for specific months only? Or just once? Let's hide them for cleaner look or just show M T W T F S S roughly? */}
                            {month.days.map((day, dIndex) => (
                                day ? (
                                    <div
                                        key={day.dateKey}
                                        className={`habit-calendar__day ${day.completed ? 'habit-calendar__day--completed' : ''}`}
                                        title={`${format(day.date, 'MMM d, yyyy')}${day.completed ? ' - Completed' : ''}`}
                                    />
                                ) : (
                                    <div key={`pad-${dIndex}`} className="habit-calendar__day habit-calendar__day--empty" />
                                )
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
