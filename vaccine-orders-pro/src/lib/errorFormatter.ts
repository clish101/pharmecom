// Error formatter for API responses
export function formatApiError(errorText: string | object): string {
  if (!errorText) {
    return 'An error occurred';
  }

  // If it's a string, try to parse it as JSON
  if (typeof errorText === 'string') {
    try {
      const parsed = JSON.parse(errorText);
      return formatApiError(parsed);
    } catch (e) {
      // Not JSON, return the string as is
      return errorText;
    }
  }

  // If it's an object, extract error message
  if (typeof errorText === 'object') {
    const obj = errorText as any;
    
    // Common Django REST Framework error formats
    if (obj.detail) {
      return obj.detail;
    }
    
    if (obj.error) {
      return obj.error;
    }
    
    if (obj.message) {
      return obj.message;
    }
    
    // Handle field-specific errors
    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length > 0) {
        const errors = keys
          .map(key => {
            const value = obj[key];
            if (Array.isArray(value)) {
              return `${key}: ${value.join(', ')}`;
            }
            return `${key}: ${value}`;
          })
          .join('; ');
        return errors;
      }
    }
  }

  return 'An unknown error occurred';
}
