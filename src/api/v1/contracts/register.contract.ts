const registerEndpointContract = {
    // request body
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
        },
        required: ['name', 'email', 'password']
    },
    // request headers
    headers: {
        type: 'object',
        properties: {
            'Content-Type': { type: 'string', enum: ['application/json'] },
        },
        required: ['Content-Type'],
    },
    // response schema
    response: {
        default: {
            type: 'object',
            properties: {
                error: { type: 'boolean', default: true }
            }
        },
        '2xx': {
            type: 'object',
            properties: {
                status: { type: 'integer', default: 1 }
            },
            required: ['status'],
        }
    },
} as const; // this is important for type inference on `req.body`

export default registerEndpointContract;