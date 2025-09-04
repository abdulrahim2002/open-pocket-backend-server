import { config } from "dotenv";
import { Ajv, type Schema } from "ajv";

const ajv = new Ajv({useDefaults: true, coerceTypes: true});


// load environment variables into mainConfig
const mainConfig = {};
config({ processEnv: mainConfig });

// define the interface/contract for mainConfig
export interface IMainConfig {
    POSTGRESQL_DATABASE:    string,
    POSTGRESQL_USERNAME:    string,
    POSTGRESQL_PASSWORD:    string,
    DATABASE_URL:           string,
    CUR_SERVER_PORT:        number,
    CUR_SERVER_HOST:        string,
    JWT_GENERATION_SECRET:  string,
    JWT_EXPIRES_IN:         string,
    SECURE_SESSION_KEY:     string,
}


const mainConfigSchema: Schema = {
    type: "object",
    properties: {
        POSTGRESQL_DATABASE:    { type: "string" },
        POSTGRESQL_USERNAME:    { type: "string" },
        POSTGRESQL_PASSWORD:    { type: "string" },
        DATABASE_URL:           { type: "string" },
        CUR_SERVER_PORT:        { type: "number", default: 7860 },
        CUR_SERVER_HOST:        { type: "string", default: "0.0.0.0" },
        JWT_GENERATION_SECRET:  { type: "string" },
        JWT_EXPIRES_IN:         { type: "string" },
        SECURE_SESSION_KEY:     { type: "string" }

    },
    required: [ "DATABASE_URL", "JWT_GENERATION_SECRET", "JWT_EXPIRES_IN", "SECURE_SESSION_KEY" ],
}


if ( !ajv.validate(mainConfigSchema, mainConfig) ) {
    throw new Error("Please set environment variables properly.\n" +
                        ajv.errorsText());
}


export default mainConfig as IMainConfig;