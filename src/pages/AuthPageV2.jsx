import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useAuth } from '../context/AuthContext';
import './AuthPageV2.css';

export default function AuthPageV2() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!isLogin && !formData.name) newErrors.name = 'Name is required';

        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const { signIn, signUp, signInWithGoogle } = useAuth();
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setErrorMsg('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await signIn(formData.email, formData.password);
            } else {
                await signUp(formData.email, formData.password, {
                    full_name: formData.name,
                });
            }
            navigate('/');
        } catch (error) {
            console.error(error);
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error(error);
            setErrorMsg(error.message);
        }
    };

    return (
        <div className="auth-v2">
            {/* Animated Background */}
            <div className="auth-v2__bg">
                <div className="auth-v2__blob auth-v2__blob--1" />
                <div className="auth-v2__blob auth-v2__blob--2" />
                <div className="auth-v2__blob auth-v2__blob--3" />
                <div className="auth-v2__grid" />
            </div>

            {/* Main Auth Container */}
            <motion.div
                className="auth-v2__container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="auth-v2__decoration" />

                <div className="auth-v2__header">
                    <div className="auth-v2__brand">
                        <span>🌿</span> Stride
                    </div>
                    <h1 className="auth-v2__title">
                        {isLogin ? 'Welcome Back' : 'Join the Movement'}
                    </h1>
                    <p className="auth-v2__subtitle">
                        {isLogin ? 'Continue building your best self.' : 'Start your journey to better habits today.'}
                    </p>
                </div>

                {/* Sliding Toggle */}
                <div className="auth-v2__toggle-container">
                    <div
                        className="auth-v2__toggle-slider"
                        style={{ transform: `translateX(${isLogin ? '0%' : '100%'})` }}
                    />
                    <button
                        className={`auth-v2__toggle-btn ${isLogin ? 'auth-v2__toggle-btn--active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Log In
                    </button>
                    <button
                        className={`auth-v2__toggle-btn ${!isLogin ? 'auth-v2__toggle-btn--active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                <form className="auth-v2__form" onSubmit={handleSubmit}>
                    {errorMsg && (
                        <div style={{ color: 'var(--color-error)', fontSize: '0.9rem', textAlign: 'center' }}>
                            {errorMsg}
                        </div>
                    )}
                    <AnimatePresence mode="popLayout">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                            >
                                <Input
                                    label="Full Name"
                                    name="name"
                                    placeholder="e.g. Jane Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        size="medium"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : (isLogin ? 'Enter Stride' : 'Create Account')}
                    </Button>
                </form>

                <div className="auth-v2__divider">Or continue with</div>

                <div className="auth-v2__socials">
                    <button className="auth-v2__social-btn" type="button" onClick={handleGoogleLogin}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8328C15.6856 12.8726 14.9729 14.4719 13.5678 15.429L13.5529 15.5562L16.5925 17.892L16.8028 17.9133C18.7188 16.1582 19.9895 13.4839 19.9895 10.1871Z" fill="#4285F4" />
                            <path d="M10.1993 20.0001C12.9527 20.0001 15.2643 19.1111 16.8029 17.9133L13.5679 15.429C12.7159 16.0355 11.5817 16.4717 10.1993 16.4717C7.45618 16.4717 5.09705 14.6732 4.25622 12.1888L4.13327 12.1993L0.982056 14.6191L0.939209 14.7351C2.46471 17.7493 5.62649 20.0001 10.1993 20.0001Z" fill="#34A853" />
                            <path d="M4.25608 12.1889C4.03212 11.5358 3.90483 10.8354 3.90483 10.1112C3.90483 9.38708 4.03212 8.68661 4.24838 8.03351L4.24446 7.90098L1.09673 5.47461L1.05444 5.49836C0.379788 6.83733 0 8.41165 0 10.1112C0 11.8108 0.379788 13.3851 1.05444 14.7351L4.25608 12.1889Z" fill="#FBBC05" />
                            <path d="M10.1993 3.75053C12.0366 3.75053 13.3146 4.54275 14.0315 5.21639L16.8792 2.4579C15.2566 0.945826 12.9527 0 10.1993 0C5.62649 0 2.46471 2.25083 0.939209 5.26497L4.24842 7.80012C5.09705 5.31575 7.45618 3.75053 10.1993 3.75053Z" fill="#EB4335" />
                        </svg>
                        Google
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
