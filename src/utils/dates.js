import { format, formatDistanceToNow, isToday, isYesterday, isTomorrow, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays } from 'date-fns';

/**
 * Format a date for display
 */
export function formatDate(date, formatStr = 'MMM d, yyyy') {
    return format(new Date(date), formatStr);
}

/**
 * Get a friendly date label
 */
export function getFriendlyDate(date) {
    const d = new Date(date);
    if (isToday(d)) return 'Today';
    if (isYesterday(d)) return 'Yesterday';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'EEEE, MMM d');
}

/**
 * Get relative time string
 */
export function getRelativeTime(date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Get the current week's dates
 */
export function getCurrentWeekDates() {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
}

/**
 * Get dates for a specific week
 */
export function getWeekDates(date) {
    const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(date), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
}

/**
 * Get the day name abbreviation
 */
export function getDayAbbr(date) {
    return format(new Date(date), 'EEE');
}

/**
 * Get the day number
 */
export function getDayNumber(date) {
    return format(new Date(date), 'd');
}

/**
 * Format time for display (e.g., "9:00 AM")
 */
export function formatTime(date) {
    return format(new Date(date), 'h:mm a');
}

/**
 * Get hours array for time grid
 */
export function getHoursArray(startHour = 6, endHour = 22) {
    const hours = [];
    for (let i = startHour; i <= endHour; i++) {
        hours.push(i);
    }
    return hours;
}

/**
 * Format hour for display (supports fractional hours for 15-min intervals)
 */
export function formatHour(hour) {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    const period = h < 12 ? 'AM' : 'PM';
    let displayHour = h % 12;
    if (displayHour === 0) displayHour = 12;

    if (m === 0) {
        return `${displayHour} ${period}`;
    }
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Check if a date is in the past
 */
export function isPast(date) {
    return new Date(date) < new Date();
}

/**
 * Get the greeting based on time of day
 */
export function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

/**
 * Get last N days
 */
export function getLastNDays(n) {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
        days.push(subDays(new Date(), i));
    }
    return days;
}

/**
 * Get next N days
 */
export function getNextNDays(n) {
    const days = [];
    for (let i = 0; i < n; i++) {
        days.push(addDays(new Date(), i));
    }
    return days;
}
