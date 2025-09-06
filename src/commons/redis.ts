import { createClient } from "@redis/client";
import mainConfig from "@src/configs/main.config.js";


const redis = await createClient({
    password: mainConfig.REDIS_PASSWORD
}).on("error", (error) => {
    console.error("redis: ", error.message);
}).connect();

export default redis;
