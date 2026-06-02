class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // inorder to call the parent class constructor and pass the message to it
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // to identify if the error is operational or programming error
    Error.captureStackTrace(this, this.constructor); // to capture the stack trace and exclude the constructor from it
  }
}

module.exports = AppError;
