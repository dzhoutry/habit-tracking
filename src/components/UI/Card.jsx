import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = forwardRef(({
    children,
    variant = 'default',
    padding = 'medium',
    hover = false,
    onClick,
    className = '',
    ...props
}, ref) => {
    const classNames = [
        'card',
        `card--${variant}`,
        `card--padding-${padding}`,
        hover && 'card--hover',
        onClick && 'card--clickable',
        className,
    ].filter(Boolean).join(' ');

    const Component = onClick ? motion.div : 'div';
    const motionProps = onClick ? {
        whileHover: { scale: 1.01 },
        whileTap: { scale: 0.99 },
    } : {};

    return (
        <Component
            ref={ref}
            className={classNames}
            onClick={onClick}
            {...motionProps}
            {...props}
        >
            {children}
        </Component>
    );
});

export default Card;

export function CardHeader({ children, className = '', ...props }) {
    return (
        <div className={`card__header ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '', ...props }) {
    return (
        <h3 className={`card__title ${className}`} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({ children, className = '', ...props }) {
    return (
        <p className={`card__description ${className}`} {...props}>
            {children}
        </p>
    );
}

export function CardContent({ children, className = '', ...props }) {
    return (
        <div className={`card__content ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '', ...props }) {
    return (
        <div className={`card__footer ${className}`} {...props}>
            {children}
        </div>
    );
}
