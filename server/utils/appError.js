class AppError extends Error{
    constructor (
        message="Something went wrong", 
        statusCode=500
    ){
        super();
        (this.message = message), (this.statusCode = statusCode);
        // Error.captureStackTrace(this, this.constructor)
    }
}

export default AppError;