import { useState, useEffect } from 'react';
import { format, addDays, addWeeks, addMonths, getDay } from 'date-fns';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Input, { Select } from '../UI/Input';
import './AddBlockModal.css';

const RECURRENCE_OPTIONS = [
    { value: 'none', label: 'Does not repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'weekdays', label: 'Every weekday (Mon-Fri)' },
    { value: 'custom', label: 'Custom...' },
];

const DAYS_OF_WEEK = [
    { value: 1, label: 'Mon', short: 'M' },
    { value: 2, label: 'Tue', short: 'T' },
    { value: 3, label: 'Wed', short: 'W' },
    { value: 4, label: 'Thu', short: 'T' },
    { value: 5, label: 'Fri', short: 'F' },
    { value: 6, label: 'Sat', short: 'S' },
    { value: 0, label: 'Sun', short: 'S' },
];

const COLORS = [
    { value: '#E76F51', label: 'Persimmon' },
    { value: '#E07A5F', label: 'Terracotta' },
    { value: '#E9C46A', label: 'Saffron' },
    { value: '#F2CC8F', label: 'Gold' },
    { value: '#81B29A', label: 'Sage' },
    { value: '#2A9D8F', label: 'Teal' },
    { value: '#A8DADC', label: 'Sky' },
    { value: '#457B9D', label: 'Steel' },
    { value: '#3D405B', label: 'Navy' },
    { value: '#1D3557', label: 'Oxford' },
    { value: '#9B8AA8', label: 'Lavender' },
    { value: '#264653', label: 'Charcoal' },
];

const END_RECURRENCE_OPTIONS = [
    { value: 'never', label: 'Never' },
    { value: 'count', label: 'After...' },
    { value: 'date', label: 'On date...' },
];

// Helper to generate 15-min slots
const getTimeOptions = (startHour = 6, endHour = 22) => {
    const options = [];
    for (let h = startHour; h <= endHour; h++) {
        for (let m = 0; m < 60; m += 15) {
            if (h === endHour && m > 0) break;
            const val = h + m / 60;
            options.push({ value: val, label: formatHour(val) });
        }
    }
    return options;
};

function formatHour(hour) {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    const period = h < 12 ? 'AM' : 'PM';
    let displayHour = h % 12;
    if (displayHour === 0) displayHour = 12;
    return m === 0 ? `${displayHour} ${period}` : `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
}

export default function AddBlockModal({
    isOpen,
    onClose,
    onSave,
    initialDate,
    initialStartHour,
    initialEndHour,
    hours = [],
}) {
    const [formData, setFormData] = useState({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startHour: 9,
        endHour: 10,
        color: '#E07A5F',
        recurrence: 'none',
        customDays: [],
        endRecurrence: 'never',
        endCount: 10,
        endDate: '',
    });

    const [showCustomDays, setShowCustomDays] = useState(false);
    const [errors, setErrors] = useState({});

    const timeOptions = getTimeOptions(6, 22);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            const defaultDate = initialDate || new Date();
            setFormData({
                title: '',
                date: format(defaultDate, 'yyyy-MM-dd'),
                startHour: initialStartHour !== undefined ? initialStartHour : 9,
                endHour: initialEndHour !== undefined ? initialEndHour : 10,
                color: '#E07A5F',
                recurrence: 'none',
                customDays: [],
                endRecurrence: 'never',
                endCount: 10,
                endDate: format(addMonths(defaultDate, 3), 'yyyy-MM-dd'),
            });
            setShowCustomDays(false);
            setErrors({});
        }
    }, [isOpen, initialDate, initialStartHour, initialEndHour]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'recurrence') {
            setShowCustomDays(value === 'custom');
            if (value === 'weekdays') {
                setFormData(prev => ({ ...prev, customDays: [1, 2, 3, 4, 5] }));
            } else if (value === 'weekly') {
                const dayOfWeek = getDay(new Date(formData.date));
                setFormData(prev => ({ ...prev, customDays: [dayOfWeek] }));
            }
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleHourChange = (name, value) => {
        const numValue = parseFloat(value);
        setFormData(prev => {
            const updated = { ...prev, [name]: numValue };
            // Ensure end hour is after start hour
            if (name === 'startHour' && numValue >= prev.endHour) {
                updated.endHour = Math.min(numValue + 0.5, 22);
            }
            return updated;
        });
    };

    const toggleCustomDay = (dayValue) => {
        setFormData(prev => {
            const days = prev.customDays.includes(dayValue)
                ? prev.customDays.filter(d => d !== dayValue)
                : [...prev.customDays, dayValue];
            return { ...prev, customDays: days };
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.date) {
            newErrors.date = 'Date is required';
        }
        if (formData.recurrence === 'custom' && formData.customDays.length === 0) {
            newErrors.customDays = 'Select at least one day';
        }
        if (formData.endRecurrence === 'count' && (!formData.endCount || formData.endCount < 1)) {
            newErrors.endCount = 'Enter a valid number';
        }
        if (formData.endRecurrence === 'date' && !formData.endDate) {
            newErrors.endDate = 'Select an end date';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const blockData = {
            title: formData.title.trim(),
            date: formData.date,
            startHour: formData.startHour,
            endHour: formData.endHour,
            color: formData.color,
        };

        // Add recurrence data if not "none"
        if (formData.recurrence !== 'none') {
            blockData.recurrence = {
                type: formData.recurrence,
                daysOfWeek: formData.recurrence === 'custom' || formData.recurrence === 'weekdays' || formData.recurrence === 'weekly'
                    ? formData.customDays
                    : null,
                endType: formData.endRecurrence,
                endCount: formData.endRecurrence === 'count' ? formData.endCount : null,
                endDate: formData.endRecurrence === 'date' ? formData.endDate : null,
            };
        }

        onSave(blockData);
        onClose();
    };

    const formatHour = (hour) => {
        if (hour === 0) return '12 AM';
        if (hour === 12) return '12 PM';
        if (hour < 12) return `${hour} AM`;
        return `${hour - 12} PM`;
    };

    const selectedDateLabel = formData.date
        ? format(new Date(formData.date), 'EEEE, MMMM d, yyyy')
        : '';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Time Block"
            size="medium"
        >
            <form className="add-block-modal" onSubmit={handleSubmit}>
                {/* Title */}
                <Input
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Morning Workout, Meeting..."
                    error={errors.title}
                    required
                />

                {/* Date picker */}
                <div className="add-block-modal__field">
                    <label className="add-block-modal__label">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="add-block-modal__date-input"
                    />
                    <span className="add-block-modal__date-preview">{selectedDateLabel}</span>
                    {errors.date && <span className="add-block-modal__error">{errors.date}</span>}
                </div>

                {/* Time range */}
                <div className="add-block-modal__time-row">
                    <div className="add-block-modal__field">
                        <label className="add-block-modal__label">Start</label>
                        <select
                            value={formData.startHour}
                            onChange={(e) => handleHourChange('startHour', e.target.value)}
                            className="add-block-modal__select"
                        >
                            {timeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <span className="add-block-modal__time-separator">to</span>
                    <div className="add-block-modal__field">
                        <label className="add-block-modal__label">End</label>
                        <select
                            value={formData.endHour}
                            onChange={(e) => handleHourChange('endHour', e.target.value)}
                            className="add-block-modal__select"
                        >
                            {timeOptions.filter(opt => opt.value > formData.startHour).map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Color */}
                <div className="add-block-modal__field">
                    <label className="add-block-modal__label">Color</label>
                    <div className="add-block-modal__colors">
                        {COLORS.map(color => (
                            <button
                                key={color.value}
                                type="button"
                                className={`add-block-modal__color ${formData.color === color.value ? 'add-block-modal__color--selected' : ''}`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                                title={color.label}
                            />
                        ))}
                    </div>
                </div>

                {/* Recurrence */}
                <div className="add-block-modal__field">
                    <label className="add-block-modal__label">Repeat</label>
                    <select
                        name="recurrence"
                        value={formData.recurrence}
                        onChange={handleChange}
                        className="add-block-modal__select"
                    >
                        {RECURRENCE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Custom days selector */}
                {showCustomDays && (
                    <div className="add-block-modal__field">
                        <label className="add-block-modal__label">Repeat on</label>
                        <div className="add-block-modal__days">
                            {DAYS_OF_WEEK.map(day => (
                                <button
                                    key={day.value}
                                    type="button"
                                    className={`add-block-modal__day ${formData.customDays.includes(day.value) ? 'add-block-modal__day--selected' : ''}`}
                                    onClick={() => toggleCustomDay(day.value)}
                                >
                                    {day.short}
                                </button>
                            ))}
                        </div>
                        {errors.customDays && <span className="add-block-modal__error">{errors.customDays}</span>}
                    </div>
                )}

                {/* End recurrence */}
                {formData.recurrence !== 'none' && (
                    <div className="add-block-modal__field">
                        <label className="add-block-modal__label">Ends</label>
                        <div className="add-block-modal__end-row">
                            <select
                                name="endRecurrence"
                                value={formData.endRecurrence}
                                onChange={handleChange}
                                className="add-block-modal__select add-block-modal__select--small"
                            >
                                {END_RECURRENCE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>

                            {formData.endRecurrence === 'count' && (
                                <div className="add-block-modal__end-input">
                                    <input
                                        type="number"
                                        name="endCount"
                                        value={formData.endCount}
                                        onChange={handleChange}
                                        min="1"
                                        max="365"
                                        className="add-block-modal__number-input"
                                    />
                                    <span>occurrences</span>
                                </div>
                            )}

                            {formData.endRecurrence === 'date' && (
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="add-block-modal__date-input add-block-modal__date-input--small"
                                />
                            )}
                        </div>
                        {(errors.endCount || errors.endDate) && (
                            <span className="add-block-modal__error">{errors.endCount || errors.endDate}</span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="add-block-modal__actions">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        Add Block
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
