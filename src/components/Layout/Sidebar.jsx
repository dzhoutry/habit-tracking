import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const navItems = [
    {
        path: '/',
        label: 'Dashboard',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 10L10 3L17 10M5 8.5V16.5C5 16.7761 5.22386 17 5.5 17H8.5V13C8.5 12.4477 8.94772 12 9.5 12H10.5C11.0523 12 11.5 12.4477 11.5 13V17H14.5C14.7761 17 15 16.7761 15 16.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        path: '/habits',
        label: 'Habits',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 10L9 12L13 8M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        path: '/planner',
        label: 'Planner',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 2.5V4.5M14 2.5V4.5M2.5 8H17.5M4 4H16C16.8284 4 17.5 4.67157 17.5 5.5V16C17.5 16.8284 16.8284 17.5 16 17.5H4C3.17157 17.5 2.5 16.8284 2.5 16V5.5C2.5 4.67157 3.17157 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },

    {
        path: '/accountability',
        label: 'Accountability',
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13.5 8.5C14.6046 8.5 15.5 7.60457 15.5 6.5C15.5 5.39543 14.6046 4.5 13.5 4.5C12.3954 4.5 11.5 5.39543 11.5 6.5C11.5 7.60457 12.3954 8.5 13.5 8.5ZM13.5 8.5C15.1569 8.5 16.5 9.84315 16.5 11.5V12.5M6.5 8.5C7.60457 8.5 8.5 7.60457 8.5 6.5C8.5 5.39543 7.60457 4.5 6.5 4.5C5.39543 4.5 4.5 5.39543 4.5 6.5C4.5 7.60457 5.39543 8.5 6.5 8.5ZM6.5 8.5C4.84315 8.5 3.5 9.84315 3.5 11.5V12.5M10 13.5C11.1046 13.5 12 12.6046 12 11.5C12 10.3954 11.1046 9.5 10 9.5C8.89543 9.5 8 10.3954 8 11.5C8 12.6046 8.89543 13.5 10 13.5ZM10 13.5C8.34315 13.5 7 14.8431 7 16.5V17.5H13V16.5C13 14.8431 11.6569 13.5 10 13.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
];

export default function Sidebar({ collapsed, onToggle }) {
    const { state } = useApp();
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/auth-v2');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <>
            <motion.aside
                className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}
                initial={false}
                animate={{ width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
                transition={{ duration: 0.25 }}
            >
                <div className="sidebar__header">
                    <div className="sidebar__logo">
                        <span className="sidebar__logo-icon">🌿</span>
                        {!collapsed && <span className="sidebar__logo-text">Stride</span>}
                    </div>
                    <button
                        className="sidebar__toggle"
                        onClick={onToggle}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d={collapsed
                                    ? "M7 4L13 10L7 16"
                                    : "M13 4L7 10L13 16"
                                }
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                <nav className="sidebar__nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                            }
                            title={collapsed ? item.label : undefined}
                        >
                            <span className="sidebar__link-icon">{item.icon}</span>
                            {!collapsed && (
                                <>
                                    <span className="sidebar__link-label">{item.label}</span>
                                    {item.badge && <span className="sidebar__link-badge">{item.badge}</span>}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar__footer">
                    <div
                        className="sidebar__user"
                        onClick={() => navigate('/account')}
                        role="button"
                        tabIndex={0}
                        title="Manage Account"
                    >
                        <div className="sidebar__user-avatar">
                            {state.userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {!collapsed && (
                            <div className="sidebar__user-info">
                                <span className="sidebar__user-name">{state.userName || 'User'}</span>
                                <span className="sidebar__user-status">Account Settings</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Mobile bottom navigation */}
            <nav className="mobile-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
                        }
                    >
                        <span className="mobile-nav__icon">{item.icon}</span>
                        <span className="mobile-nav__label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </>
    );
}
