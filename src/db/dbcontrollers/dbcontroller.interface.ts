// Relevant codes from: https://www.postgresql.org/docs/current/errcodes-appendix.html
export enum OPSTATUS {
    SUCCESS,
    // integrity violations
    FOREIGN_KEY_VIOLATION=23503,
    UNIQUE_VIOLATION=23505,
    CHECK_VIOLATION=23514,
    NOT_NULL_VIOLATION=23502,

    // transaction failure
    INVALID_TRANSACTION_STATE=25000,

    // connection failure
    CONNECTION_DOES_NOT_EXIST=8006,
    CONNECTION_FAILURE=8006,

    // other
    UNKNOWN_FAILURE=-1,
}

interface IDbControllerResponse<T=any> {
    // true if operation was successfull
    success: boolean,

    // status of the operation being performed by dbcontroller
    status?: number,
    message?: string,
    
    // the recommended response code, based on the nature of database failure
    recommendedHttpResponseCode?: number,
    
    // data, the dbcontroller is successfully able to retrieve data from 
    // the database. It is `undefined` when a failure occurs
    data?: T,
}

export default IDbControllerResponse;