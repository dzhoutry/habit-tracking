import { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Input, { TextArea, Select } from '../UI/Input';
import './HabitModal.css';

const COLORS = [
    { value: '#E07A5F', label: 'Terracotta' },
    { value: '#81B29A', label: 'Sage' },
    { value: '#F2CC8F', label: 'Gold' },
    { value: '#3D405B', label: 'Navy' },
    { value: '#9B8AA8', label: 'Lavender' },
    { value: '#F4A261', label: 'Orange' },
    { value: '#E9C46A', label: 'Yellow' },
    { value: '#A8A299', label: 'Gray' },
];
const DAYS = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' },
];

export default function HabitModal({ isOpen, onClose, habit, onSave, onDelete }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        emoji: '✨',
        color: '#E07A5F',
        frequency: 'daily',
        days: [],
        reminderTime: '',
    });
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (habit) {
            setFormData({
                name: habit.name || '',
                description: habit.description || '',
                emoji: habit.emoji || '✨',
                color: habit.color || '#E07A5F',
                frequency: habit.frequency || 'daily',
                days: habit.days || [],
                reminderTime: habit.reminderTime || '',
            });
        } else {
            setFormData({
                name: '',
                description: '',
                emoji: '✨',
                color: '#E07A5F',
                frequency: 'daily',
                days: [],
                reminderTime: '',
            });
        }
        setErrors({});
        setShowEmojiPicker(false);
    }, [habit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleEmojiClick = (emojiData) => {
        setFormData(prev => ({ ...prev, emoji: emojiData.emoji }));
        setShowEmojiPicker(false);
    };

    const handleDayToggle = (day) => {
        setFormData(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day],
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Habit name is required';
        }
        if (formData.frequency === 'weekly' && formData.days.length === 0) {
            newErrors.days = 'Select at least one day';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        onSave(formData);
        onClose();
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this habit? This will also delete all completion history.')) {
            onDelete(habit.id);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={habit ? 'Edit Habit' : 'New Habit'}
            size="medium"
        >
            <form className="habit-modal__form" onSubmit={handleSubmit}>
                {/* Emoji picker */}
                <div className="habit-modal__field">
                    <label className="habit-modal__label">Icon</label>
                    <div className="habit-modal__emoji-wrapper">
                        <button
                            type="button"
                            className="habit-modal__emoji-toggle"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            {formData.emoji}
                        </button>
                        {showEmojiPicker && (
                            <div className="habit-modal__emoji-dropdown">
                                <div className="habit-modal__emoji-overlay" onClick={() => setShowEmojiPicker(false)} />
                                <div className="habit-modal__emoji-picker-container">
                                    <EmojiPicker
                                        onEmojiClick={handleEmojiClick}
                                        theme="auto"
                                        emojiStyle="native"
                                        width={350}
                                        height={400}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Name */}
                <Input
                    label="Habit Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Read for 30 minutes"
                    error={errors.name}
                    required
                />

                {/* Description */}
                <TextArea
                    label="Description (optional)"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add details or notes about this habit..."
                    rows={2}
                />

                {/* Color picker */}
                <div className="habit-modal__field">
                    <label className="habit-modal__label">Color</label>
                    <div className="habit-modal__color-grid">
                        {COLORS.map(color => (
                            <button
                                key={color.value}
                                type="button"
                                className={`habit-modal__color-btn ${formData.color === color.value ? 'habit-modal__color-btn--selected' : ''}`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                                title={color.label}
                            />
                        ))}
                    </div>
                </div>

                {/* Frequency */}
                <Select
                    label="Frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    options={[
                        { value: 'daily', label: 'Every day' },
                        { value: 'weekly', label: 'Specific days' },
                    ]}
                />

                {/* Days selector (for weekly) */}
                {formData.frequency === 'weekly' && (
                    <div className="habit-modal__field">
                        <label className="habit-modal__label">Days</label>
                        <div className="habit-modal__days-grid">
                            {DAYS.map(day => (
                                <button
                                    key={day.value}
                                    type="button"
                                    className={`habit-modal__day-btn ${formData.days.includes(day.value) ? 'habit-modal__day-btn--selected' : ''}`}
                                    onClick={() => handleDayToggle(day.value)}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                        {errors.days && <span className="habit-modal__error">{errors.days}</span>}
                    </div>
                )}

                {/* Reminder time */}
                <Input
                    label="Reminder Time (optional)"
                    name="reminderTime"
                    type="time"
                    value={formData.reminderTime}
                    onChange={handleChange}
                    helperText="Visual reminder only"
                />

                {/* Actions */}
                <div className="habit-modal__actions">
                    {habit && (
                        <Button type="button" variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                    <div className="habit-modal__actions-right">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {habit ? 'Save Changes' : 'Create Habit'}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
