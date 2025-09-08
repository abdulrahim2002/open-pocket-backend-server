import { config } from "dotenv";
import { Ajv, type Schema } from "ajv";

const ajv = new Ajv({useDefaults: true, coerceTypes: true});


// load environment variables into mainConfig
const mainConfig = {};
config({ processEnv: mainConfig });

// define the interface/contract for mainConfig
export interface IMainConfig {
    NODE_ENV:                   string,
    POSTGRESQL_DATABASE:        string,
    POSTGRESQL_USERNAME:        string,
    POSTGRESQL_PASSWORD:        string,
    DATABASE_URL:               string,
    CUR_SERVER_PORT:            number,
    CUR_SERVER_HOST:            string,
    JWT_GENERATION_SECRET:      string,
    JWT_EXPIRES_IN:             string,
    REFRESH_TOKEN_EXPIRES_IN:   number,
    SECURE_SESSION_KEY:         string,
    SECURE_SESSION_EXPIRES_IN:  number,
    REDIS_PASSWORD:             string,
}


const mainConfigSchema: Schema = {
    type: "object",
    properties: {
        NODE_ENV:                   { type: "string", default: "development" },
        POSTGRESQL_DATABASE:        { type: "string" },
        POSTGRESQL_USERNAME:        { type: "string" },
        POSTGRESQL_PASSWORD:        { type: "string" },
        DATABASE_URL:               { type: "string" },
        CUR_SERVER_PORT:            { type: "number", default: 7860 },
        CUR_SERVER_HOST:            { type: "string", default: "0.0.0.0" },
        JWT_GENERATION_SECRET:      { type: "string" },
        JWT_EXPIRES_IN:             { type: "string" },
        REFRESH_TOKEN_EXPIRES_IN:   { type: "number", default: 30 * 24 * 60 * 60 }, // 30 days
        SECURE_SESSION_KEY:         { type: "string" },
        SECURE_SESSION_EXPIRES_IN:  { type: "number", default: 7 * 24 * 60 * 60 }, // 7 days
        REDIS_PASSWORD:             { type: "string" }

    },
    required: [
        "DATABASE_URL", "JWT_GENERATION_SECRET",
        "JWT_EXPIRES_IN", "SECURE_SESSION_KEY",
        "REDIS_PASSWORD"
    ],
}


if ( !ajv.validate(mainConfigSchema, mainConfig) ) {
    throw new Error("Please set environment variables properly.\n" +
                        ajv.errorsText());
}


export default mainConfig as IMainConfig;
