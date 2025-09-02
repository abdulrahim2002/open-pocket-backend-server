declare module 'fastify' {
  export interface FastifyInstance {
    config: {
    POSTGRESQL_DATABASE: string,
    POSTGRESQL_USERNAME: string,
    POSTGRESQL_PASSWORD: string,
    DATABASE_URL:        string,
    CUR_SERVER_PORT:     number,
    CUR_SERVER_HOST:     string,
    };
  }
}

const configSchema = {
  type: "object",
  properties: {
    POSTGRESQL_DATABASE: { type: "string" },
    POSTGRESQL_USERNAME: { type: "string" },
    POSTGRESQL_PASSWORD: { type: "string" },
    DATABASE_URL: { type: "string" },
    CUR_SERVER_PORT: { type: "number", default: 7860 },
    CUR_SERVER_HOST: { type: "string", default: "0.0.0.0" },
  },
  required: ["DATABASE_URL"],
};

const configOpts = {
  confKey: "config",
  schema: configSchema,
  dotenv: true,
};

export default configOpts;