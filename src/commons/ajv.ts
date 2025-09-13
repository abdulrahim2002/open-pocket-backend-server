/**
 * Common ajv instance used through out the application.
 **/
import { Ajv } from "ajv";

const ajv = new Ajv({
    useDefaults: true,
    coerceTypes: true
});

export default ajv;
