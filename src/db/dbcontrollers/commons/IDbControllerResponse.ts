interface IDbControllerResponse<T=any> {
    // true if operation was successfull
    success: boolean,

    // status of the operation being performed by dbcontroller
    status?: number,
    message?: string,

    // the recommended response code, based on the nature of database failure
    // this is non binding, and actual httpResponseCode depends on req controller
    recommendedHttpResponseCode?: number | undefined,

    // data, the dbcontroller is successfully able to retrieve data from
    // the database. It is `undefined` when a failure occurs
    data?: T,
}

export default IDbControllerResponse;
