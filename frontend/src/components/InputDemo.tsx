import React, { useState } from 'react';
import { Input, Textarea, Select } from './ui/Input';
import type { SelectOption } from './ui/Input';
import './ui/Input/Input.css';

export const InputDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    bio: '',
    country: '',
    newsletter: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sample options for select
  const countryOptions: SelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'au', label: 'Australia' },
  ];

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.country) {
      newErrors.country = 'Please select your country';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully! Check console for data.');
    }
  };

  return (
    <div className="input-demo">
      <style>{`
        .input-demo {
          max-width: 800px;
          margin: 0 auto;
          padding: var(--spacing-8) var(--spacing-5);
        }
        
        .demo-section {
          margin-bottom: var(--spacing-11);
        }
        
        .demo-header {
          margin-bottom: var(--spacing-7);
        }
        
        .demo-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-3);
        }
        
        .demo-description {
          font-size: 16px;
          color: var(--text-secondary-alt);
          line-height: 1.6;
        }
        
        .demo-grid {
          display: grid;
          gap: var(--spacing-7);
          grid-template-columns: 1fr;
        }
        
        @media (min-width: 768px) {
          .demo-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .demo-grid--single {
            grid-template-columns: 1fr;
            max-width: 500px;
          }
        }
        
        .demo-group {
          background: var(--surface-secondary);
          padding: var(--spacing-6);
          border-radius: var(--radius-2);
          border: 1px solid var(--stroke-stroke);
        }
        
        .demo-group h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-5);
        }
        
        .demo-group .input-container,
        .demo-group .textarea-container,
        .demo-group .select-container,
        .demo-group .form-field {
          margin-bottom: var(--spacing-5);
        }
        
        .demo-group .input-container:last-child,
        .demo-group .textarea-container:last-child,
        .demo-group .select-container:last-child,
        .demo-group .form-field:last-child {
          margin-bottom: 0;
        }
        
        .form-demo {
          background: var(--surface-primary);
          padding: var(--spacing-8);
          border-radius: var(--radius-2);
          border: 1px solid var(--stroke-stroke);
          margin-top: var(--spacing-8);
        }
        
        .form-demo h3 {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--spacing-6);
        }
        
        .form-actions {
          display: flex;
          gap: var(--spacing-4);
          margin-top: var(--spacing-6);
        }
        
        .btn {
          padding: var(--spacing-3) var(--spacing-6);
          border-radius: var(--radius-1);
          border: none;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn--primary {
          background: var(--button-primary);
          color: var(--button-on-primary);
        }
        
        .btn--primary:hover {
          background: var(--button-primary-alt);
          color: var(--button-on-primary-alt);
        }
        
        .btn--secondary {
          background: var(--button-secondary);
          color: var(--button-on-secondary);
          border: 1px solid var(--stroke-stroke);
        }
        
        .btn--secondary:hover {
          background: var(--button-secondary-alt);
          color: var(--button-on-secondary-alt);
        }
      `}</style>

      <div className="demo-header">
        <h1 className="demo-title">Input System Demo</h1>
        <p className="demo-description">
          A comprehensive showcase of our input components with design tokens, validation states, 
          and mobile-first responsive design. All components support light/dark themes automatically.
        </p>
      </div>

      {/* Basic Input States */}
      <div className="demo-section">
        <h2 className="demo-title">Input States & Variants</h2>
        <div className="demo-grid">
          <div className="demo-group">
            <h3>Outlined Variant</h3>
            <Input
              variant="outlined"
              placeholder="Default state"
              label="Default Input"
              helperText="This is helper text"
            />
            <Input
              variant="outlined"
              placeholder="Error state"
              label="Error Input"
              state="error"
              errorMessage="This field has an error"
              startIcon="error"
            />
            <Input
              variant="outlined"
              placeholder="Success state"
              label="Success Input"
              state="success"
              successMessage="Looks good!"
              startIcon="check-circle"
            />
            <Input
              variant="outlined"
              placeholder="Disabled state"
              label="Disabled Input"
              disabled
              helperText="This field is disabled"
            />
          </div>

          <div className="demo-group">
            <h3>Filled Variant</h3>
            <Input
              variant="filled"
              placeholder="Default state"
              label="Default Input"
              helperText="This is helper text"
            />
            <Input
              variant="filled"
              placeholder="With start icon"
              label="With Icon"
              startIcon="user"
              helperText="Username or email"
            />
            <Input
              variant="filled"
              placeholder="With end icon"
              label="Search"
              endIcon="search"
              helperText="Search anything"
            />
            <Input
              variant="filled"
              type="password"
              placeholder="Password"
              label="Password"
              endIcon="settings"
              helperText="Must be at least 8 characters"
            />
          </div>
        </div>
      </div>

      {/* Input Sizes */}
      <div className="demo-section">
        <h2 className="demo-title">Input Sizes</h2>
        <div className="demo-grid demo-grid--single">
          <div className="demo-group">
            <h3>Size Variations</h3>
            <Input
              size="small"
              placeholder="Small size"
              label="Small Input"
              startIcon="bookmark"
            />
            <Input
              size="medium"
              placeholder="Medium size (default)"
              label="Medium Input"
              startIcon="bookmark"
            />
            <Input
              size="large"
              placeholder="Large size"
              label="Large Input"
              startIcon="bookmark"
            />
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="demo-section">
        <h2 className="demo-title">Advanced Features</h2>
        <div className="demo-grid">
          <div className="demo-group">
            <h3>Character Count</h3>
            <Input
              placeholder="Tweet your thoughts"
              label="Tweet"
              helperText="Share what's on your mind"
              showCharCount
              maxLength={280}
              startIcon="message"
            />
            <Textarea
              placeholder="Write your bio..."
              label="Bio"
              helperText="Tell us about yourself"
              showCharCount
              maxLength={500}
              minRows={3}
              autoResize
            />
          </div>

          <div className="demo-group">
            <h3>Select Component</h3>
            <Select
              placeholder="Choose your country"
              label="Country"
              options={countryOptions}
              helperText="Select your country of residence"
              startIcon="navigation"
            />
            <Select
              placeholder="Choose your country"
              label="Country (Error)"
              options={countryOptions}
              state="error"
              errorMessage="Please select a country"
              startIcon="navigation"
            />
          </div>
        </div>
      </div>

      {/* Textarea Showcase */}
      <div className="demo-section">
        <h2 className="demo-title">Textarea Component</h2>
        <div className="demo-grid">
          <div className="demo-group">
            <h3>Standard Textarea</h3>
            <Textarea
              placeholder="Write your message..."
              label="Message"
              helperText="Share your thoughts with us"
              variant="outlined"
              minRows={4}
            />
            <Textarea
              placeholder="Error example"
              label="Feedback"
              state="error"
              errorMessage="This field is required"
              variant="filled"
            />
          </div>

          <div className="demo-group">
            <h3>Auto-Resize Textarea</h3>
            <Textarea
              placeholder="This textarea grows as you type..."
              label="Auto-Resize"
              helperText="Try typing multiple lines!"
              autoResize
              minRows={2}
              maxRows={6}
              variant="outlined"
            />
          </div>
        </div>
      </div>

      {/* Form Example */}
      <div className="demo-section">
        <div className="form-demo">
          <h3>Complete Form Example</h3>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Enter your email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange('email')}
              state={errors.email ? 'error' : formData.email ? 'success' : 'default'}
              errorMessage={errors.email}
              successMessage={formData.email && !errors.email ? 'Email looks good!' : undefined}
              startIcon="mail"
              required
            />

            <Input
              type="password"
              placeholder="Create a password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange('password')}
              state={errors.password ? 'error' : formData.password.length >= 8 ? 'success' : 'default'}
              errorMessage={errors.password}
              successMessage={formData.password.length >= 8 ? 'Strong password!' : undefined}
              endIcon="settings"
              showCharCount
              maxLength={50}
              required
            />

            <Select
              placeholder="Select your country"
              label="Country"
              options={countryOptions}
              value={formData.country}
              onChange={handleInputChange('country')}
              state={errors.country ? 'error' : formData.country ? 'success' : 'default'}
              errorMessage={errors.country}
              successMessage={formData.country ? 'Country selected!' : undefined}
              startIcon="navigation"
              required
            />

            <Textarea
              placeholder="Tell us about yourself..."
              label="Bio (Optional)"
              value={formData.bio}
              onChange={handleInputChange('bio')}
              helperText="Share a bit about your background and interests"
              showCharCount
              maxLength={300}
              autoResize
              minRows={3}
              maxRows={6}
            />

            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                Create Account
              </button>
              <button type="button" className="btn btn--secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
