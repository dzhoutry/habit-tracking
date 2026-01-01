import { useState, useMemo } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths
} from 'date-fns';
import './MiniCalendar.css';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function MiniCalendar({
    selectedDate,
    onSelectDate,
    eventsOnDates = [] // Array of date strings 'yyyy-MM-dd' that have events
}) {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
    const today = new Date();

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    }, [currentMonth]);

    const handlePrevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleSelectDate = (date) => {
        onSelectDate(date);
    };

    const hasEvents = (date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        return eventsOnDates.includes(dateKey);
    };

    return (
        <div className="mini-calendar">
            {/* Header */}
            <div className="mini-calendar__header">
                <h4 className="mini-calendar__title">
                    {format(currentMonth, 'MMMM yyyy')}
                </h4>
                <div className="mini-calendar__nav">
                    <button
                        className="mini-calendar__nav-btn"
                        onClick={handlePrevMonth}
                        aria-label="Previous month"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        className="mini-calendar__nav-btn"
                        onClick={handleNextMonth}
                        aria-label="Next month"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Weekday headers */}
            <div className="mini-calendar__weekdays">
                {WEEKDAYS.map((day, index) => (
                    <div key={index} className="mini-calendar__weekday">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days grid */}
            <div className="mini-calendar__days">
                {calendarDays.map((day) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isToday = isSameDay(day, today);
                    const isSelected = isSameDay(day, selectedDate);
                    const dayHasEvents = hasEvents(day);

                    return (
                        <button
                            key={day.toISOString()}
                            className={`mini-calendar__day ${!isCurrentMonth ? 'mini-calendar__day--outside' : ''} ${isToday ? 'mini-calendar__day--today' : ''} ${isSelected ? 'mini-calendar__day--selected' : ''}`}
                            onClick={() => handleSelectDate(day)}
                        >
                            <span className="mini-calendar__day-number">
                                {format(day, 'd')}
                            </span>
                            {dayHasEvents && !isSelected && (
                                <span className="mini-calendar__day-dot" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
