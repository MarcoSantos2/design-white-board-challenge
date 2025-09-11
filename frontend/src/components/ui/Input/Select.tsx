import React, { forwardRef, useState } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectVariant = 'outlined' | 'filled';
export type SelectSize = 'small' | 'medium' | 'large';
export type SelectState = 'default' | 'error' | 'success' | 'disabled';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Visual variant of the select */
  variant?: SelectVariant;
  /** Size of the select */
  size?: SelectSize;
  /** Current state of the select */
  state?: SelectState;
  /** Label text */
  label?: string;
  /** Helper text below the select */
  helperText?: string;
  /** Error message (overrides helperText when state is 'error') */
  errorMessage?: string;
  /** Success message (overrides helperText when state is 'success') */
  successMessage?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Options for the select */
  options: SelectOption[];
  /** Icon to display at the start of the select */
  startIcon?: IconName;
  /** Whether the select is required */
  required?: boolean;
  /** Container class name for styling wrapper */
  containerClassName?: string;
  /** Custom styling for the select wrapper */
  wrapperStyle?: React.CSSProperties;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  variant = 'outlined',
  size = 'medium',
  state = 'default',
  label,
  helperText,
  errorMessage,
  successMessage,
  placeholder,
  options,
  startIcon,
  required,
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

  // Determine the actual state
  const actualState = disabled ? 'disabled' : state;

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Generate unique IDs for accessibility
  const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const helperTextId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  // Get the display message based on state
  const getDisplayMessage = () => {
    if (actualState === 'error' && errorMessage) return errorMessage;
    if (actualState === 'success' && successMessage) return successMessage;
    return helperText;
  };

  // Get the message state class
  const getMessageStateClass = () => {
    if (actualState === 'error') return 'select-message--error';
    if (actualState === 'success') return 'select-message--success';
    return 'select-message--default';
  };

  // Select wrapper classes
  const wrapperClasses = [
    'select-wrapper',
    `select-wrapper--${variant}`,
    `select-wrapper--${size}`,
    `select-wrapper--${actualState}`,
    isFocused && 'select-wrapper--focused',
    startIcon && 'select-wrapper--has-start-icon',
  ].filter(Boolean).join(' ');

  // Select classes
  const selectClasses = [
    'select',
    `select--${variant}`,
    `select--${size}`,
    `select--${actualState}`,
    className,
  ].filter(Boolean).join(' ');

  const displayMessage = getDisplayMessage();

  return (
    <div 
      className={`select-container ${containerClassName || ''}`}
      style={wrapperStyle}
    >
      {/* Label */}
      {label && (
        <label 
          htmlFor={selectId} 
          className={`select-label ${required ? 'select-label--required' : ''}`}
        >
          {label}
          {required && <span className="select-label__required-indicator" aria-label="required">*</span>}
        </label>
      )}

      {/* Select Wrapper */}
      <div className={wrapperClasses}>
        {/* Start Icon */}
        {startIcon && (
          <div className="select-icon select-icon--start">
            <Icon 
              name={startIcon} 
              size={size === 'small' ? 'xs' : size === 'large' ? 'sm' : 'xs'} 
              variant="outline"
            />
          </div>
        )}

        {/* Select Element */}
        <select
          {...props}
          ref={ref}
          id={selectId}
          className={selectClasses}
          style={style}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-describedby={
            [
              displayMessage && helperTextId,
              actualState === 'error' && errorId,
            ].filter(Boolean).join(' ') || undefined
          }
          aria-invalid={actualState === 'error'}
          aria-required={required}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value} 
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <div className="select-icon select-icon--chevron">
          <Icon name="chevron-down" size="xs" variant="outline" />
        </div>

        {/* State Icon */}
        {actualState === 'error' && (
          <div className="select-icon select-icon--state">
            <Icon name="error" size="xs" variant="outline" />
          </div>
        )}
        {actualState === 'success' && (
          <div className="select-icon select-icon--state">
            <Icon name="check-circle" size="xs" variant="outline" />
          </div>
        )}
      </div>

      {/* Helper Text / Error Message */}
      <div className="select-footer">
        {displayMessage && (
          <div 
            id={actualState === 'error' ? errorId : helperTextId}
            className={`select-message ${getMessageStateClass()}`}
            role={actualState === 'error' ? 'alert' : undefined}
          >
            {displayMessage}
          </div>
        )}
      </div>
    </div>
  );
});

Select.displayName = 'Select';
