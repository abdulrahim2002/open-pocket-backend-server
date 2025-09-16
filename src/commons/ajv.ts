/**
 * Common ajv instance used through out the application.
 * see: https://ajv.js.org/api.html#new-ajv-options-object
 **/
import { Ajv } from "ajv";
import formatsPlugin from "ajv-formats";

const ajv = new Ajv({
    useDefaults: true,
    coerceTypes: true
});

formatsPlugin.default(ajv);

export default ajv;
