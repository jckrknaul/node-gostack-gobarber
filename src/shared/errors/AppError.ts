class AppError {
  public readonly message: string;

  public readonly statusError: number;

  constructor(message: string, statusError = 400) {
    this.message = message;
    this.statusError = statusError;
  }
}

export default AppError;
