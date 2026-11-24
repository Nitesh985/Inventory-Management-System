class ApiError extends Error {
  statusCode: number;
  success: false;
  errors: unknown[];
  data: null;

  constructor(
    statusCode: number,
    message = "Something went wrong",
    stack = "",
    errors: unknown[] = [],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.errors = errors;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
