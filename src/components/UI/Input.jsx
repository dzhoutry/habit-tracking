import './Input.css';

export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    helperText,
    icon,
    disabled = false,
    required = false,
    id,
    name,
    className = '',
    ...props
}) {
    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-group__label">
                    {label}
                    {required && <span className="input-group__required">*</span>}
                </label>
            )}
            <div className="input-group__wrapper">
                {icon && <span className="input-group__icon">{icon}</span>}
                <input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`input-group__input ${icon ? 'input-group__input--with-icon' : ''}`}
                    {...props}
                />
            </div>
            {(error || helperText) && (
                <span className={`input-group__helper ${error ? 'input-group__helper--error' : ''}`}>
                    {error || helperText}
                </span>
            )}
        </div>
    );
}

export function TextArea({
    label,
    value,
    onChange,
    placeholder,
    error,
    helperText,
    disabled = false,
    required = false,
    rows = 3,
    id,
    name,
    className = '',
    ...props
}) {
    const inputId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-group__label">
                    {label}
                    {required && <span className="input-group__required">*</span>}
                </label>
            )}
            <textarea
                id={inputId}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                className="input-group__textarea"
                {...props}
            />
            {(error || helperText) && (
                <span className={`input-group__helper ${error ? 'input-group__helper--error' : ''}`}>
                    {error || helperText}
                </span>
            )}
        </div>
    );
}

export function Select({
    label,
    value,
    onChange,
    options = [],
    placeholder,
    error,
    helperText,
    disabled = false,
    required = false,
    id,
    name,
    className = '',
    ...props
}) {
    const inputId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-group__label">
                    {label}
                    {required && <span className="input-group__required">*</span>}
                </label>
            )}
            <select
                id={inputId}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className="input-group__select"
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {(error || helperText) && (
                <span className={`input-group__helper ${error ? 'input-group__helper--error' : ''}`}>
                    {error || helperText}
                </span>
            )}
        </div>
    );
}
