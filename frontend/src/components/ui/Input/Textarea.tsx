import React, { forwardRef, useState } from 'react';
import { Icon } from '../Icon/Icon';

export type TextareaVariant = 'outlined' | 'filled';
export type TextareaSize = 'small' | 'medium' | 'large';
export type TextareaState = 'default' | 'error' | 'success' | 'disabled';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Visual variant of the textarea */
  variant?: TextareaVariant;
  /** Size of the textarea */
  size?: TextareaSize;
  /** Current state of the textarea */
  state?: TextareaState;
  /** Label text */
  label?: string;
  /** Helper text below the textarea */
  helperText?: string;
  /** Error message (overrides helperText when state is 'error') */
  errorMessage?: string;
  /** Success message (overrides helperText when state is 'success') */
  successMessage?: string;
  /** Whether the textarea is required */
  required?: boolean;
  /** Whether to show character count */
  showCharCount?: boolean;
  /** Maximum length for character count */
  maxLength?: number;
  /** Minimum number of rows */
  minRows?: number;
  /** Maximum number of rows (for auto-resize) */
  maxRows?: number;
  /** Whether to auto-resize the textarea */
  autoResize?: boolean;
  /** Container class name for styling wrapper */
  containerClassName?: string;
  /** Custom styling for the textarea wrapper */
  wrapperStyle?: React.CSSProperties;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  variant = 'outlined',
  size = 'medium',
  state = 'default',
  label,
  helperText,
  errorMessage,
  successMessage,
  required,
  showCharCount,
  maxLength,
  minRows = 3,
  maxRows = 8,
  autoResize = false,
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
  
  // Handle value changes for character count and auto-resize
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentValue(e.target.value);
    
    // Auto-resize logic
    if (autoResize) {
      const textarea = e.target;
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;
      
      textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
    }
    
    if (onChange) onChange(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Generate unique IDs for accessibility
  const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const helperTextId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;

  // Get the display message based on state
  const getDisplayMessage = () => {
    if (actualState === 'error' && errorMessage) return errorMessage;
    if (actualState === 'success' && successMessage) return successMessage;
    return helperText;
  };

  // Get the message state class
  const getMessageStateClass = () => {
    if (actualState === 'error') return 'textarea-message--error';
    if (actualState === 'success') return 'textarea-message--success';
    return 'textarea-message--default';
  };

  // Textarea wrapper classes
  const wrapperClasses = [
    'textarea-wrapper',
    `textarea-wrapper--${variant}`,
    `textarea-wrapper--${size}`,
    `textarea-wrapper--${actualState}`,
    isFocused && 'textarea-wrapper--focused',
  ].filter(Boolean).join(' ');

  // Textarea classes
  const textareaClasses = [
    'textarea',
    `textarea--${variant}`,
    `textarea--${size}`,
    `textarea--${actualState}`,
    autoResize && 'textarea--auto-resize',
    className,
  ].filter(Boolean).join(' ');

  const displayMessage = getDisplayMessage();
  const characterCount = String(currentValue).length;

  return (
    <div 
      className={`textarea-container ${containerClassName || ''}`}
      style={wrapperStyle}
    >
      {/* Label */}
      {label && (
        <label 
          htmlFor={textareaId} 
          className={`textarea-label ${required ? 'textarea-label--required' : ''}`}
        >
          {label}
          {required && <span className="textarea-label__required-indicator" aria-label="required">*</span>}
        </label>
      )}

      {/* Textarea Wrapper */}
      <div className={wrapperClasses}>
        {/* Textarea Element */}
        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          style={style}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          rows={minRows}
          aria-describedby={
            [
              displayMessage && helperTextId,
              actualState === 'error' && errorId,
            ].filter(Boolean).join(' ') || undefined
          }
          aria-invalid={actualState === 'error'}
          aria-required={required}
        />

        {/* State Icon */}
        {actualState === 'error' && (
          <div className="textarea-icon textarea-icon--state">
            <Icon name="error" size="xs" variant="outline" />
          </div>
        )}
        {actualState === 'success' && (
          <div className="textarea-icon textarea-icon--state">
            <Icon name="check-circle" size="xs" variant="outline" />
          </div>
        )}
      </div>

      {/* Helper Text / Error Message / Character Count */}
      <div className="textarea-footer">
        {displayMessage && (
          <div 
            id={actualState === 'error' ? errorId : helperTextId}
            className={`textarea-message ${getMessageStateClass()}`}
            role={actualState === 'error' ? 'alert' : undefined}
          >
            {displayMessage}
          </div>
        )}
        
        {showCharCount && maxLength && (
          <div className="textarea-char-count">
            <span className={characterCount > maxLength ? 'textarea-char-count--error' : ''}>
              {characterCount}
            </span>
            <span className="textarea-char-count__separator">/</span>
            <span>{maxLength}</span>
          </div>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';
