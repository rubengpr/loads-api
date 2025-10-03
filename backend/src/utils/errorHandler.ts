interface ErrorContext {
  endpoint?: string;
  method?: string;
  params?: Record<string, unknown>;
  userId?: string;
}

/**
 * Logs error details to console with context
 */
export const logError = (
  error: unknown,
  context?: ErrorContext,
): void => {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error(`🔴 ERROR at ${timestamp}`);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (context?.endpoint) {
    console.error(`📍 Endpoint: ${context.method || 'UNKNOWN'} ${context.endpoint}`);
  }
  
  if (context?.params && Object.keys(context.params).length > 0) {
    console.error(`📦 Parameters:`, JSON.stringify(context.params, null, 2));
  }
  
  if (context?.userId) {
    console.error(`👤 User ID: ${context.userId}`);
  }
  
  console.error(`💥 Error: ${errorMessage}`);
  
  if (errorStack) {
    console.error(`📚 Stack Trace:\n${errorStack}`);
  }
  
  // Log full error object for debugging
  if (typeof error === 'object' && error !== null) {
    console.error(`🔍 Error Details:`, JSON.stringify(error, null, 2));
  }
  
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

/**
 * Handles errors and returns appropriate HTTP response
 */
export const handleError = (
  error: unknown,
  context?: ErrorContext,
): { message: string; statusCode: number } => {
  // Log the error with context
  logError(error, context);

  // Handle custom errors with statusCode
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'statusCode' in error
  ) {
    return {
      message: String(error.message),
      statusCode: Number(error.statusCode),
    };
  }

  // Handle validation errors (thrown by our validation functions)
  if (error instanceof Error) {
    // Check if it's a validation error (user input error)
    if (
      error.message.includes('must be') ||
      error.message.includes('Invalid') ||
      error.message.includes('At least 2')
    ) {
      return {
        message: error.message,
        statusCode: 400, // Bad Request for validation errors
      };
    }

    // Generic server error
    return {
      message: error.message,
      statusCode: 500,
    };
  }

  // Unknown error type
  return {
    message: 'Something went wrong',
    statusCode: 500,
  };
};
