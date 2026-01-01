import { motion } from 'framer-motion';
import './Button.css';

export default function Button({
    children,
    variant = 'primary',
    size = 'medium',
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) {
    const classNames = [
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--full-width',
        icon && !children && 'btn--icon-only',
        loading && 'btn--loading',
        className,
    ].filter(Boolean).join(' ');

    return (
        <motion.button
            type={type}
            className={classNames}
            disabled={disabled || loading}
            onClick={onClick}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            {...props}
        >
            {loading ? (
                <span className="btn__spinner" />
            ) : (
                <>
                    {icon && iconPosition === 'left' && <span className="btn__icon">{icon}</span>}
                    {children && <span className="btn__text">{children}</span>}
                    {icon && iconPosition === 'right' && <span className="btn__icon">{icon}</span>}
                </>
            )}
        </motion.button>
    );
}
