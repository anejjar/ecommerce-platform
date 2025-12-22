import { useState, useMemo, useCallback } from 'react';

export interface ValidationError {
  field: string;
  message: string;
}

export function useInlineValidation(enabled: boolean = true) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const validateEmail = (value: string): string => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePhone = (value: string): string => {
    if (!value) return '';
    // Morocco phone number validation: +212XXXXXXXXX or 0XXXXXXXXX
    const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
      return 'Please enter a valid Moroccan phone number';
    }
    return '';
  };

  const validateRequired = (value: string, fieldName: string): string => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return '';
  };

  const validatePostalCode = (value: string): string => {
    if (!value) return '';
    // Morocco postal code: 5 digits
    const postalRegex = /^[0-9]{5}$/;
    if (!postalRegex.test(value)) {
      return 'Postal code must be 5 digits';
    }
    return '';
  };

  const validateField = useCallback(
    (field: string, value: string, isRequired: boolean = false) => {
      if (!enabled) return;

      let error = '';

      switch (field) {
        case 'email':
          error = validateEmail(value);
          break;
        case 'phone':
        case 'alternativePhone':
          error = validatePhone(value);
          break;
        case 'postalCode':
          error = validatePostalCode(value);
          break;
        case 'firstName':
          error = isRequired ? validateRequired(value, 'First name') : '';
          break;
        case 'lastName':
          error = isRequired ? validateRequired(value, 'Last name') : '';
          break;
        case 'address':
        case 'address1':
          error = isRequired ? validateRequired(value, 'Address') : '';
          break;
        case 'city':
          error = isRequired ? validateRequired(value, 'City') : '';
          break;
        default:
          if (isRequired && !value) {
            error = 'This field is required';
          }
          break;
      }

      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));

      return error;
    },
    [enabled]
  );

  const debouncedValidateField = useMemo(
    () => debounce(validateField, 500),
    [validateField]
  );

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = useMemo(() => {
    return Object.values(errors).some((error) => error !== '');
  }, [errors]);

  const getError = useCallback(
    (field: string): string => {
      return errors[field] || '';
    },
    [errors]
  );

  return {
    errors,
    validateField,
    debouncedValidateField,
    clearError,
    clearAllErrors,
    hasErrors,
    getError,
  };
}
