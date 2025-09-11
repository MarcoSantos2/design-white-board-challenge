import React from 'react';

export interface FormFieldProps {
  /** Content of the form field */
  children: React.ReactNode;
  /** Label text */
  label?: string;
  /** Helper text below the field */
  helperText?: string;
  /** Error message */
  errorMessage?: string;
  /** Success message */
  successMessage?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Current state of the field */
  state?: 'default' | 'error' | 'success';
  /** HTML id of the input element for label association */
  htmlFor?: string;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  helperText,
  errorMessage,
  successMessage,
  required,
  state = 'default',
  htmlFor,
  className,
  style,
}) => {
  // Get the display message based on state
  const getDisplayMessage = () => {
    if (state === 'error' && errorMessage) return errorMessage;
    if (state === 'success' && successMessage) return successMessage;
    return helperText;
  };

  // Get the message state class
  const getMessageStateClass = () => {
    if (state === 'error') return 'form-field__message--error';
    if (state === 'success') return 'form-field__message--success';
    return 'form-field__message--default';
  };

  const displayMessage = getDisplayMessage();

  return (
    <div 
      className={`form-field ${className || ''}`}
      style={style}
    >
      {/* Label */}
      {label && (
        <label 
          htmlFor={htmlFor}
          className={`form-field__label ${required ? 'form-field__label--required' : ''}`}
        >
          {label}
          {required && (
            <span className="form-field__required-indicator" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {/* Field Content */}
      <div className="form-field__content">
        {children}
      </div>

      {/* Helper Text / Error Message */}
      {displayMessage && (
        <div 
          className={`form-field__message ${getMessageStateClass()}`}
          role={state === 'error' ? 'alert' : undefined}
        >
          {displayMessage}
        </div>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';
