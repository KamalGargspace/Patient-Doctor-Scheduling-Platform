class ApiError extends Error{
    constructor(statuscode,
        message = "Something went wrong!",
        errors = [],
        stack = ""
    ){
        super(message);
        this.statuscode = statuscode;
        this.errors = errors;
        this.stack = stack;
        this.data = null;
        this.success = false;

        if(stack){
            this.stack = stack;

        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
    toJSON() {
        return {
            statuscode: this.statuscode,
            message: this.message,
            errors: this.errors,
            stack: this.stack,
            data: this.data,
            success: this.success,
        };
    }
}

export {ApiError}