import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks, isSameDay, getDay, addMonths } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { formatHour, getHoursArray, getFriendlyDate, getWeekDates } from '../utils/dates';
import MiniCalendar from '../components/Planner/MiniCalendar';
import AddBlockModal from '../components/Planner/AddBlockModal';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import './Planner.css';

export default function Planner() {
    const {
        state,
        addTask,
        deleteTask,
        toggleTask,
        getTasksForDate,
        addTimeBlock,
        updateTimeBlock,
        deleteTimeBlock,
    } = useApp();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('week');
    const [newTaskText, setNewTaskText] = useState('');
    const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false);
    const scrollRef = useRef(null);

    // Drag-to-select state
    const [dragState, setDragState] = useState(null); // { date, startHour, currentHour }
    const [modalInitData, setModalInitData] = useState(null);
    const [editingBlock, setEditingBlock] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 360; // 6 AM * 60px
        }
    }, [viewMode]);

    const hours = getHoursArray(0, 23);
    const tasks = getTasksForDate(selectedDate);
    const weekDates = getWeekDates(selectedDate);

    const datesWithEvents = useMemo(() => {
        const dates = new Set();
        state.timeBlocks.forEach(block => {
            dates.add(block.date);
            if (block.recurrence) {
                const endDate = block.recurrence.endDate ? new Date(block.recurrence.endDate) : addMonths(new Date(), 6);
                let currentDate = new Date(block.date);
                let count = 0;
                while (currentDate <= endDate && count < (block.recurrence.endCount || 100)) {
                    dates.add(format(currentDate, 'yyyy-MM-dd'));
                    switch (block.recurrence.type) {
                        case 'daily': currentDate = addDays(currentDate, 1); break;
                        case 'weekly':
                            currentDate = addDays(currentDate, 7); // Simplified for optimization check
                            break;
                        case 'weekdays':
                        case 'custom':
                            currentDate = addDays(currentDate, 1);
                            while (block.recurrence.daysOfWeek && !block.recurrence.daysOfWeek.includes(getDay(currentDate)) && currentDate <= endDate) {
                                currentDate = addDays(currentDate, 1);
                            }
                            break;
                        case 'monthly': currentDate = addMonths(currentDate, 1); break;
                        default: currentDate = addDays(currentDate, 1);
                    }
                    count++;
                }
            }
        });
        return Array.from(dates);
    }, [state.timeBlocks]);

    /**
     * Helper to get blocks for a specific date (handling recurrence)
     * Duplicate logic from memo above but for rendering.
     * Ideally, this should be centralized in AppContext or a hook.
     */
    const getBlocksForDate = (date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const dayOfWeek = getDay(date);
        return state.timeBlocks.filter(block => {
            if (block.date === dateKey) return true;
            if (block.recurrence) {
                const blockStartDate = new Date(block.date);
                // Important: recurrence start date check
                if (date < blockStartDate && !isSameDay(date, blockStartDate)) return false;

                if (block.recurrence.endDate && date > new Date(block.recurrence.endDate)) return false;

                // Recurrence Days Check
                switch (block.recurrence.type) {
                    case 'daily': return true;
                    case 'weekly': return dayOfWeek === getDay(blockStartDate);
                    case 'weekdays': return dayOfWeek >= 1 && dayOfWeek <= 5;
                    case 'custom': return block.recurrence.daysOfWeek?.includes(dayOfWeek);
                    case 'monthly': return new Date(block.date).getDate() === date.getDate();
                    default: return false;
                }
            }
            return false;
        });
    };

    const navigateDate = (direction) => {
        const amount = direction === 'next' ? 1 : -1;
        if (viewMode === 'day') {
            setSelectedDate(prev => addDays(prev, amount));
        } else {
            setSelectedDate(prev => addWeeks(prev, amount));
        }
    };

    const goToToday = () => setSelectedDate(new Date());

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        addTask({ title: newTaskText.trim(), date: format(selectedDate, 'yyyy-MM-dd') });
        setNewTaskText('');
    };

    const handleBlockClick = (block, e) => {
        e.stopPropagation(); // Prevent creation
        setEditingBlock(block);
        setIsAddBlockModalOpen(true);
    };

    const handleSaveBlock = (blockData) => {
        if (editingBlock) {
            // Update existing block
            updateTimeBlock(editingBlock.id, blockData);
        } else {
            addTimeBlock(blockData);
        }
    };

    // Drag selection handlers
    const onGridMouseDown = (date, hour) => {
        setDragState({ date, startHour: hour, currentHour: hour });
    };

    const onGridMouseEnter = (hour) => {
        if (dragState) {
            setDragState(prev => ({ ...prev, currentHour: hour }));
        }
    };

    const onGridMouseUp = () => {
        if (dragState) {
            const start = Math.min(dragState.startHour, dragState.currentHour);
            const end = Math.max(dragState.startHour, dragState.currentHour) + 0.5; // Default 30 min or end of slot

            setModalInitData({
                date: dragState.date,
                startHour: start,
                endHour: Math.min(end, 23.5)
            });
            setEditingBlock(null); // Clear editing state for new block
            setIsAddBlockModalOpen(true);
            setDragState(null);
        }
    };

    const currentHourLong = currentTime.getHours() + (currentTime.getMinutes() / 60);
    const isToday = format(selectedDate, 'yyyy-MM-dd') === format(currentTime, 'yyyy-MM-dd');

    const outstandingTasksCount = tasks.filter(task => !task.completed).length;

    return (
        <div className="planner" onMouseUp={onGridMouseUp}>
            <header className="planner__header">
                <div className="planner__title-section">
                    <h1>Planner</h1>
                </div>
                <div className="planner__actions">
                    <div className="planner__view-toggle">
                        <div
                            className="view-toggle__slider"
                            style={{ transform: viewMode === 'week' ? 'translateX(100%)' : 'translateX(0)' }}
                        />
                        <button
                            className={`view-toggle__btn ${viewMode === 'day' ? 'view-toggle__btn--active' : ''}`}
                            onClick={() => setViewMode('day')}
                        >
                            Day
                        </button>
                        <button
                            className={`view-toggle__btn ${viewMode === 'week' ? 'view-toggle__btn--active' : ''}`}
                            onClick={() => setViewMode('week')}
                        >
                            Week
                        </button>
                    </div>
                </div>
            </header>

            <div className="planner__content">
                <aside className="planner__sidebar">
                    <Button variant="primary" fullWidth onClick={() => { setModalInitData(null); setEditingBlock(null); setIsAddBlockModalOpen(true); }} icon="+" className="planner__add-btn">
                        Add Block
                    </Button>
                    <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} eventsOnDates={datesWithEvents} />
                    <Card padding="medium" className="planner__tasks-card">
                        <div className="planner__tasks-header">
                            <h3>Tasks</h3>
                            <span className="planner__tasks-badge">{outstandingTasksCount}</span>
                        </div>
                        <form className="planner__add-task" onSubmit={handleAddTask}>
                            <Input placeholder="Add a task..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} />
                        </form>
                        <div className="planner__tasks-list">
                            {tasks.map(task => (
                                <div key={task.id} className={`planner__task ${task.completed ? 'planner__task--completed' : ''}`}>
                                    <button className="planner__task-check" onClick={() => toggleTask(task.id)}>
                                        {task.completed && (
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </button>
                                    <span className="planner__task-title">{task.title}</span>
                                    <button className="planner__task-delete" onClick={() => deleteTask(task.id)}>×</button>
                                </div>
                            ))
                            }
                        </div>
                    </Card>
                </aside>

                <main className="planner__main">
                    <div className="planner__nav">
                        <button className="planner__nav-btn" onClick={() => navigateDate('prev')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <div className="planner__date-display">
                            <h2>{viewMode === 'day' ? getFriendlyDate(selectedDate) : `Week of ${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d')}`}</h2>
                            {!isToday && <Button variant="ghost" size="small" onClick={goToToday}>Today</Button>}
                        </div>
                        <button className="planner__nav-btn" onClick={() => navigateDate('next')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {viewMode === 'day' ? (
                        <Card padding="none" className="planner__time-grid" ref={scrollRef}>
                            <div className="time-grid__content">
                                {hours.map((hour) => (
                                    <div
                                        key={hour}
                                        className={`time-grid__row ${isToday && Math.floor(currentHourLong) === hour ? 'time-grid__row--current' : ''}`}
                                        onMouseDown={() => onGridMouseDown(selectedDate, hour)}
                                        onMouseEnter={() => onGridMouseEnter(hour)}
                                    >
                                        <div className="time-grid__label">{formatHour(hour)}</div>
                                        <div className="time-grid__slot">
                                            {getBlocksForDate(selectedDate)
                                                .filter(block => block.startHour === hour)
                                                .map(block => (
                                                    <motion.div
                                                        key={`${block.id}-day`}
                                                        className="time-block"
                                                        style={{
                                                            backgroundColor: `${block.color}20`,
                                                            borderLeft: `3px solid ${block.color}`,
                                                            top: '2px',
                                                            height: `${(block.endHour - block.startHour) * 60 - 4}px`,
                                                        }}
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                        onClick={(e) => handleBlockClick(block, e)}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                    >
                                                        <span className="time-block__title">{block.title}</span>
                                                        <span className="time-block__time">{formatHour(block.startHour)} - {formatHour(block.endHour)}</span>
                                                        {block.recurrence && <span className="time-block__recurring">🔁</span>}
                                                        <button className="time-block__delete" onClick={() => deleteTimeBlock(block.id)}>×</button>
                                                    </motion.div>
                                                ))}

                                            {/* Selection Preview Overlay */}
                                            {dragState && isSameDay(dragState.date, selectedDate) && dragState.startHour === hour && (
                                                <div
                                                    className="time-block time-block--preview"
                                                    style={{
                                                        top: '2px',
                                                        height: `${(Math.abs(dragState.currentHour - dragState.startHour) + 1) * 60 - 4}px`,
                                                        backgroundColor: 'var(--color-error-light)',
                                                        borderLeft: '3px solid var(--color-accent-primary)',
                                                        zIndex: 10,
                                                        pointerEvents: 'none',
                                                        transform: dragState.currentHour < dragState.startHour ? `translateY(-${Math.abs(dragState.currentHour - dragState.startHour) * 60}px)` : 'none'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isToday && (
                                    <div className="time-grid__now-line" style={{ top: `${(currentHourLong * 60) + 16}px` }} />
                                )}
                            </div>
                        </Card>
                    ) : (
                        /* Week View V2 with Column-based structure */
                        <Card padding="none" className="planner__week-grid-v2">
                            <div className="week-grid__scroll-area" ref={scrollRef}>
                                <div className="week-grid__header">
                                    <div className="week-grid__time-spacer" />
                                    {weekDates.map(date => {
                                        const isCurrentDay = isSameDay(date, new Date());
                                        return (
                                            <div key={format(date, 'yyyy-MM-dd')} className={`week-grid__day-header ${isCurrentDay ? 'week-grid__day-header--today' : ''}`} onClick={() => setSelectedDate(date)}>
                                                <span className="week-grid__day-name">{format(date, 'EEE')}</span>
                                                <span className="week-grid__day-number">{format(date, 'd')}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="week-grid__container">
                                    {/* Grid Lines Background */}
                                    <div className="week-grid__lines">
                                        {hours.map(hour => (
                                            <div key={hour} className="week-grid__hour-row">
                                                <div className="week-grid__time-label">{formatHour(hour)}</div>
                                                <div className="week-grid__row-line" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Day Columns */}
                                    <div className="week-grid__columns">
                                        <div className="week-grid__time-column-spacer" />
                                        {weekDates.map(date => {
                                            const dayBlocks = getBlocksForDate(date);
                                            return (
                                                <div
                                                    key={format(date, 'yyyy-MM-dd')}
                                                    className="week-grid__day-column"
                                                >
                                                    {hours.map(h => (
                                                        <div
                                                            key={h}
                                                            className="week-grid__hour-slot"
                                                            style={{ height: '60px' }}
                                                            onMouseDown={() => onGridMouseDown(date, h)}
                                                            onMouseEnter={() => onGridMouseEnter(h)}
                                                        />
                                                    ))}

                                                    {dayBlocks.map(block => (
                                                        <motion.div
                                                            key={`${block.id}-${format(date, 'yyyy-MM-dd')}`}
                                                            className="time-block time-block--week"
                                                            style={{
                                                                top: `${block.startHour * 60 + 2}px`,
                                                                height: `${(block.endHour - block.startHour) * 60 - 4}px`,
                                                                backgroundColor: `${block.color}20`,
                                                                borderLeft: `3px solid ${block.color}`,
                                                                zIndex: 5
                                                            }}
                                                            onMouseDown={(e) => e.stopPropagation()}
                                                            onClick={(e) => handleBlockClick(block, e)}
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                        >
                                                            <div className="time-block__content" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span className="time-block__title">{block.title}</span>
                                                                {block.endHour - block.startHour >= 0.5 && (
                                                                    <span className="time-block__time">
                                                                        {formatHour(block.startHour)} - {formatHour(block.endHour)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <button className="time-block__delete" onClick={(e) => { e.stopPropagation(); deleteTimeBlock(block.id); }}>×</button>
                                                        </motion.div>
                                                    ))}

                                                    {/* Selection Preview Overlay */}
                                                    {dragState && isSameDay(dragState.date, date) && (
                                                        <div
                                                            className="time-block time-block--preview"
                                                            style={{
                                                                top: `${Math.min(dragState.startHour, dragState.currentHour) * 60 + 2}px`,
                                                                height: `${(Math.abs(dragState.currentHour - dragState.startHour) + 1) * 60 - 4}px`,
                                                                backgroundColor: 'var(--color-error-light)',
                                                                borderLeft: '3px solid var(--color-accent-primary)',
                                                                zIndex: 10,
                                                                pointerEvents: 'none'
                                                            }}
                                                        />
                                                    )}

                                                    {/* Now Line for Week View (Today only) */}
                                                    {isSameDay(date, currentTime) && (
                                                        <div
                                                            className="week-grid__now-line"
                                                            style={{
                                                                top: `${currentHourLong * 60}px`,
                                                                zIndex: 15
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </main>
            </div>

            <AddBlockModal
                isOpen={isAddBlockModalOpen}
                onClose={() => setIsAddBlockModalOpen(false)}
                onSave={handleSaveBlock}
                initialDate={modalInitData?.date || selectedDate}
                initialStartHour={modalInitData?.startHour}
                initialEndHour={modalInitData?.endHour}
                editingBlock={editingBlock}
                hours={hours}
            />
        </div>
    );
}
