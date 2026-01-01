import { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getLastNDays } from '../utils/dates';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import ProgressRing from '../components/UI/ProgressRing';
import './Accountability.css';

export default function Accountability() {
    const { state, addShare, deleteShare, getStreak, isHabitCompleted } = useApp();
    const [newShareName, setNewShareName] = useState('');
    const [copiedCode, setCopiedCode] = useState(null);

    const handleCreateShare = async (e) => {
        e.preventDefault();
        if (!newShareName.trim()) return;
        await addShare(newShareName.trim());
        setNewShareName('');
    };

    const handleCopyLink = (code) => {
        const link = `${window.location.origin}/shared/${code}`;
        navigator.clipboard.writeText(link);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    // Calculate stats for preview
    const last7Days = getLastNDays(7);
    const weeklyStats = state.habits.reduce((acc, habit) => {
        last7Days.forEach(date => {
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

    const longestStreak = state.habits.reduce((max, habit) => {
        const streak = getStreak(habit.id);
        return streak > max ? streak : max;
    }, 0);

    return (
        <div className="accountability-page">
            {/* Header */}
            <header className="accountability-page__header">
                <div>
                    <h1>Accountability</h1>
                    <p>Share your progress with accountability partners</p>
                </div>
            </header>

            <div className="accountability-page__content">
                {/* Your profile */}
                <section className="accountability-section">
                    <h2 className="accountability-section__title">Your Profile</h2>
                    <Card padding="medium" className="accountability-profile">
                        <div className="accountability-profile__left">
                            <div className="accountability-profile__avatar">
                                {state.userName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="accountability-profile__info">
                                <h3>{state.userName || 'User'}</h3>
                                <p className="text-sm text-muted">Manage your name in settings</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="small" onClick={() => window.location.href = '/account'}>
                            Settings
                        </Button>
                    </Card>
                </section>

                {/* Create share */}
                <section className="accountability-section">
                    <h2 className="accountability-section__title">Share Your Progress</h2>
                    <Card padding="medium">
                        <p className="accountability-section__description">
                            Create a shareable link to let accountability partners view your habit progress.
                            They'll only see your habits and completion stats – no editing allowed.
                        </p>
                        <form className="accountability-create-share" onSubmit={handleCreateShare}>
                            <Input
                                placeholder="Partner's name (e.g., 'Mom', 'Coach')"
                                value={newShareName}
                                onChange={(e) => setNewShareName(e.target.value)}
                            />
                            <Button type="submit" variant="primary">
                                Generate Link
                            </Button>
                        </form>
                    </Card>
                </section>

                {/* Active shares */}
                <section className="accountability-section">
                    <h2 className="accountability-section__title">Active Shares</h2>
                    {state.shares.length === 0 ? (
                        <Card padding="large" className="accountability-empty">
                            <div className="accountability-empty__content">
                                <span className="accountability-empty__icon">🔗</span>
                                <h3>No active shares</h3>
                                <p>Create a share link above to invite accountability partners.</p>
                            </div>
                        </Card>
                    ) : (
                        <div className="accountability-shares">
                            <AnimatePresence mode="popLayout">
                                {state.shares.map((share) => (
                                    <motion.div
                                        key={share.code}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        layout
                                    >
                                        <Card padding="medium" className="accountability-share">
                                            <div className="accountability-share__info">
                                                <h4>{share.name}</h4>
                                                <p>Created {format(new Date(share.created_at || share.createdAt), 'MMM d, yyyy')}</p>
                                            </div>
                                            <div className="accountability-share__code">
                                                <code>{share.code}</code>
                                            </div>
                                            <div className="accountability-share__actions">
                                                <Button
                                                    variant="secondary"
                                                    size="small"
                                                    onClick={() => handleCopyLink(share.code)}
                                                >
                                                    {copiedCode === share.code ? 'Copied!' : 'Copy Link'}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="small"
                                                    onClick={() => deleteShare(share.code)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </section>

                {/* Preview */}
                <section className="accountability-section">
                    <h2 className="accountability-section__title">What Partners See</h2>
                    <Card padding="large" className="accountability-preview">
                        <div className="accountability-preview__header">
                            <div className="accountability-preview__user">
                                <div className="accountability-preview__avatar">
                                    {state.userName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3>{state.userName || 'User'}'s Progress</h3>
                                    <p>Last updated just now</p>
                                </div>
                            </div>
                        </div>

                        <div className="accountability-preview__stats">
                            <div className="accountability-preview__stat">
                                <ProgressRing progress={weeklyProgress} size={64} strokeWidth={5} />
                                <span className="accountability-preview__stat-label">Weekly Progress</span>
                            </div>
                            <div className="accountability-preview__stat">
                                <div className="accountability-preview__stat-value">🔥 {longestStreak}</div>
                                <span className="accountability-preview__stat-label">Best Streak</span>
                            </div>
                            <div className="accountability-preview__stat">
                                <div className="accountability-preview__stat-value">{state.habits.length}</div>
                                <span className="accountability-preview__stat-label">Active Habits</span>
                            </div>
                        </div>

                        <div className="accountability-preview__habits">
                            <h4>Habits</h4>
                            {state.habits.length === 0 ? (
                                <p className="accountability-preview__empty">No habits yet</p>
                            ) : (
                                <div className="accountability-preview__habit-list">
                                    {state.habits.map(habit => (
                                        <div key={habit.id} className="accountability-preview__habit">
                                            <span className="accountability-preview__habit-emoji">{habit.emoji}</span>
                                            <span className="accountability-preview__habit-name">{habit.name}</span>
                                            <span className="accountability-preview__habit-streak">
                                                🔥 {getStreak(habit.id)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </section>
            </div>
        </div>
    );
}
