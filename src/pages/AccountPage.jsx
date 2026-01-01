import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import './AccountPage.css';

export default function AccountPage() {
    const { user, updatePassword, signOut } = useAuth();
    const { state, updateProfile } = useApp();

    // Profile State
    const [fullName, setFullName] = useState(state.userName || '');
    const [isProfileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState(null);

    // Password State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState(null);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage(null);
        try {
            await updateProfile({ full_name: fullName });
            setProfileMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error) {
            setProfileMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage(null);
        try {
            await updatePassword(newPassword);
            setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordMessage({ type: 'error', text: error.message });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="account-page">
            <header className="account-page__header">
                <h1>Account Settings</h1>
                <p>Manage your profile and security preferences</p>
            </header>

            <div className="account-page__content">
                {/* Profile Section */}
                <section className="account-section">
                    <h2 className="account-section__title">Profile</h2>
                    <Card padding="large">
                        <form className="account-profile__form" onSubmit={handleUpdateProfile}>
                            <div className="account-profile__avatar-container">
                                <div className="account-profile__avatar">
                                    {state.userName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{user.email}</p>
                                    <p className="text-xs text-muted">Managed by Supabase</p>
                                </div>
                            </div>

                            <Input
                                label="Display Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your name"
                            />

                            {profileMessage && (
                                <div className={`text-sm ${profileMessage.type === 'error' ? 'text-error' : 'text-success'}`}>
                                    {profileMessage.text}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button type="submit" variant="primary" loading={isProfileLoading}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Card>
                </section>

                {/* Security Section */}
                <section className="account-section">
                    <h2 className="account-section__title">Security</h2>
                    <Card padding="large">
                        <form className="account-password__form" onSubmit={handleUpdatePassword}>
                            <div className="account-password__fields">
                                <Input
                                    label="New Password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            {passwordMessage && (
                                <div className={`text-sm ${passwordMessage.type === 'error' ? 'text-error' : 'text-success'}`}>
                                    {passwordMessage.text}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button type="submit" variant="primary" loading={isPasswordLoading}>
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </Card>
                </section>

                {/* Danger Zone */}
                <section className="account-section">
                    <Card padding="medium" className="account-danger">
                        <div className="account-danger__content">
                            <div className="account-danger__info">
                                <h3>Sign Out</h3>
                                <p>Sign out of your account on this device</p>
                            </div>
                            <Button variant="danger" onClick={signOut}>
                                Log Out
                            </Button>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
    );
}
