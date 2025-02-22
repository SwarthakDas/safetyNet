//Make a ApiResponse to standadize the response and we dont to write it multiple time
class ApiResponse{
    constructor(statuscode, data, message="Success"){
        this.statuscode=statuscode
        this.data=data
        this.message=message
        this.statuscode=statuscode<400
    }
}

export {ApiResponse}