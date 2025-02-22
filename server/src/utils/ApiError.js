//to stardadize the error we throw we make this 
class ApiError extends Error{
    constructor(
        statuscode, 
        message= "Something went wrong",
        errors=[],
        stack=""
    ){
        super(message) // Call the parent class constructor with the message
        this.statuscode=statuscode
        this.data=null
        this.message=message
        this.success=false;
        this.errors=errors

        if(stack){//read more
            this.stack=stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
        /*
        The stack property helps in debugging by showing where the error occurred and the sequence of function calls that led to it. 
        The provided code snippet ensures that the stack property is set appropriately,
        either by using a provided stack trace or by capturing the current stack trace.
        */
    }
}

export {ApiError}