/**
 * Common ajv instance used through out the application.
 * see: https://ajv.js.org/api.html#new-ajv-options-object
 **/
import { Ajv } from "ajv";

const ajv = new Ajv({
    useDefaults: true,
    coerceTypes: true
});

export default ajv;
