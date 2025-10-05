import React, { forwardRef, useState } from 'react';
import './Input.css';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';

export type InputVariant = 'outlined' | 'filled';
export type InputSize = 'small' | 'medium' | 'large';
export type InputState = 'default' | 'error' | 'success' | 'disabled';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual variant of the input */
  variant?: InputVariant;
  /** Size of the input */
  size?: InputSize;
  /** Current state of the input */
  state?: InputState;
  /** Label text */
  label?: string;
  /** Helper text below the input */
  helperText?: string;
  /** Error message (overrides helperText when state is 'error') */
  errorMessage?: string;
  /** Success message (overrides helperText when state is 'success') */
  successMessage?: string;
  /** Icon to display at the start of the input */
  startIcon?: IconName;
  /** Icon to display at the end of the input */
  endIcon?: IconName;
  /** Optional click handler for the end icon (useful for password visibility toggles) */
  onEndIconClick?: () => void;
  /** Optional aria-label for the end icon button */
  endIconAriaLabel?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Whether to show character count */
  showCharCount?: boolean;
  /** Maximum length for character count */
  maxLength?: number;
  /** Container class name for styling wrapper */
  containerClassName?: string;
  /** Custom styling for the input wrapper */
  wrapperStyle?: React.CSSProperties;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'outlined',
  size = 'medium',
  state = 'default',
  label,
  helperText,
  errorMessage,
  successMessage,
  startIcon,
  endIcon,
  onEndIconClick,
  endIconAriaLabel,
  required,
  showCharCount,
  maxLength,
  containerClassName,
  wrapperStyle,
  className,
  style,
  disabled,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || '');

  // Determine the actual state
  const actualState = disabled ? 'disabled' : state;
  
  // Handle value changes for character count
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
    if (onChange) onChange(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Generate unique IDs for accessibility
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const helperTextId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  // Get the display message based on state
  const getDisplayMessage = () => {
    if (actualState === 'error' && errorMessage) return errorMessage;
    if (actualState === 'success' && successMessage) return successMessage;
    return helperText;
  };

  // Get the message state class
  const getMessageStateClass = () => {
    if (actualState === 'error') return 'input-message--error';
    if (actualState === 'success') return 'input-message--success';
    return 'input-message--default';
  };

  // Input wrapper classes
  const wrapperClasses = [
    'input-wrapper',
    `input-wrapper--${variant}`,
    `input-wrapper--${size}`,
    `input-wrapper--${actualState}`,
    isFocused && 'input-wrapper--focused',
    startIcon && 'input-wrapper--has-start-icon',
    endIcon && 'input-wrapper--has-end-icon',
  ].filter(Boolean).join(' ');

  // Input classes
  const inputClasses = [
    'input',
    `input--${variant}`,
    `input--${size}`,
    `input--${actualState}`,
    className,
  ].filter(Boolean).join(' ');

  const displayMessage = getDisplayMessage();
  const characterCount = String(currentValue).length;

  return (
    <div 
      className={`input-container ${containerClassName || ''}`}
      style={wrapperStyle}
    >
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId} 
          className={`input-label ${required ? 'input-label--required' : ''}`}
        >
          {label}
          {required && <span className="input-label__required-indicator" aria-label="required">*</span>}
        </label>
      )}

      {/* Input Wrapper */}
      <div className={wrapperClasses}>
        {/* Start Icon */}
        {startIcon && (
          <div className="input-icon input-icon--start">
            <Icon 
              name={startIcon} 
              size={size === 'small' ? 'xs' : size === 'large' ? 'sm' : 'xs'} 
              variant="outline"
            />
          </div>
        )}

        {/* Input Element */}
        <input
          {...props}
          ref={ref}
          id={inputId}
          className={inputClasses}
          style={style}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          aria-describedby={
            [
              displayMessage && helperTextId,
              actualState === 'error' && errorId,
            ].filter(Boolean).join(' ') || undefined
          }
          aria-invalid={actualState === 'error'}
          aria-required={required}
        />

        {/* End Icon */}
        {endIcon && (
          <div className="input-icon input-icon--end">
            <Icon 
              name={endIcon} 
              size={size === 'small' ? 'xs' : size === 'large' ? 'sm' : 'xs'} 
              variant="outline"
              onClick={onEndIconClick}
              aria-label={endIconAriaLabel}
              style={onEndIconClick ? { cursor: 'pointer' } : undefined}
            />
          </div>
        )}

        {/* State Icon */}
        {actualState === 'error' && (
          <div className="input-icon input-icon--state">
            <Icon name="error" size="xs" variant="outline" />
          </div>
        )}
        {actualState === 'success' && (
          <div className="input-icon input-icon--state">
            <Icon name="check-circle" size="xs" variant="outline" />
          </div>
        )}
      </div>

      {/* Helper Text / Error Message / Character Count */}
      <div className="input-footer">
        {displayMessage && (
          <div 
            id={actualState === 'error' ? errorId : helperTextId}
            className={`input-message ${getMessageStateClass()}`}
            role={actualState === 'error' ? 'alert' : undefined}
          >
            {displayMessage}
          </div>
        )}
        
        {showCharCount && maxLength && (
          <div className="input-char-count">
            <span className={characterCount > maxLength ? 'input-char-count--error' : ''}>
              {characterCount}
            </span>
            <span className="input-char-count__separator">/</span>
            <span>{maxLength}</span>
          </div>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';
