// Relevant codes from: https://www.postgresql.org/docs/current/errcodes-appendix.html
enum OPSTATUS {
    SUCCESS,
    // integrity violations
    FOREIGN_KEY_VIOLATION=23503,
    UNIQUE_VIOLATION=23505,
    CHECK_VIOLATION=23514,
    NOT_NULL_VIOLATION=23502,

    // transaction failure
    INVALID_TRANSACTION_STATE=25000,

    // connection failure
    CONNECTION_FAILURE=8006,

    // custom errrors
    USER_DOES_NOT_EXISTS=7860,

    // other
    UNKNOWN_FAILURE=-1,
}

export default OPSTATUS;
