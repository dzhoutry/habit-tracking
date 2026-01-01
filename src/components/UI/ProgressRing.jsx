import { motion } from 'framer-motion';
import './ProgressRing.css';

export default function ProgressRing({
    progress = 0,
    size = 48,
    strokeWidth = 4,
    showLabel = true,
    color = 'var(--color-accent-primary)',
    trackColor = 'var(--color-border)',
    className = '',
}) {
    const normalizedRadius = (size - strokeWidth) / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className={`progress-ring ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                {/* Background track */}
                <circle
                    className="progress-ring__track"
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress arc */}
                <motion.circle
                    className="progress-ring__progress"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        strokeDasharray: circumference,
                        transformOrigin: 'center',
                        transform: 'rotate(-90deg)',
                    }}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </svg>
            {showLabel && (
                <span className="progress-ring__label">
                    {Math.round(progress)}%
                </span>
            )}
        </div>
    );
}
