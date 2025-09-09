const addEndpointContract = {
    // request body
    body: {
        type: "object",
        properties: {
            url:            { type: "string", format: "uri" },
            title:          { type: "string", nullable: true },
            tags:           { type: "string", nullable: true },
            tweet_id:       { type: "string", nullable: true },
            consumer_key:   { type: "string" },
            access_token:   { type: "string" },
        },
        required: ["url", "consumer_key", "access_token"],
    },
    // request headers
    headers: {
        type: "object",
        properties: {
            "Content-Type": { type: "string", enum: ["application/json"] },
        },
        required: ["Content-Type"],
    },
    // response schema
    response: {
        // inspired by: https://docs.oasis-open.org/odata/odata-json-format/v4.0/errata02/os/odata-json-format-v4.0-errata02-os-complete.html#_Toc403940655
        default: {
            type: "object",
            properties: {
                error: {
                    type: "object",
                    properties: {
                        code:    { type: "integer" },
                        message: { type: "string" },
                        details: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    code:    { type: "number" },
                                    message: { type: "string" }
                                },
                                required: [ "code", "message" ]
                            }
                        },
                    },
                    required: [ "code", "message" ]
                }
            },
            required: [ "error" ]
        },
        "2xx": {
            type: "object",
            properties: {
                item_id:            { type: "string" },
                normal_url:         { type: "string" },
                resolved_id:        { type: "string" },
                resolved_url:       { type: "string" },
                domain_id:          { type: "string" },
                origin_domain_id:   { type: "string" },
                response_code:      { type: "string", nullable: true },
                mime_type:          { type: "string", nullable: true },
                content_length:     { type: "string", nullable: true },
                encoding:           { type: "string", nullable: true },
                date_resolved:      { type: "string", format: "date-time", nullable: true },
                date_published:     { type: "string", format: "date-time", nullable: true },
                title:              { type: "string", nullable: true },
                excerpt:            { type: "string", nullable: true },
                word_count:         { type: "integer", nullable: true },
                has_image:          { type: "integer" },
                has_video:          { type: "integer" },
                is_index:           { type: "integer" },
                is_article:         { type: "integer" },
                authors: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            author_id:  { type: "string" },
                            name:       { type: "string", nullable: true },
                            url:        { type: "string", format: "uri", nullable: true },
                        },
                        required: ["name"],
                    },
                    nullable: true,
                },
                images: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            image_id:   { type: "string" },
                            src:        { type: "string", format: "uri", nullable: true },
                            width:      { type: "integer", nullable: true },
                            height:     { type: "integer", nullable: true },
                            credit:     { type: "string", nullable: true },
                        },
                        required: ["src"],
                    },
                    nullable: true,
                },
                videos: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            video_id:   { type: "string" },
                            src:        { type: "string", format: "uri" },
                            width:      { type: "integer", nullable: true },
                            height:     { type: "integer", nullable: true },
                            type:       { type: "string", nullable: true },
                        },
                        required: ["src"],
                    },
                    nullable: true,
                },
            },
            required: [
                "item_id", "normal_url", "resolved_id", "resolved_url", "domain_id",
                "origin_domain_id", "date_resolved", "date_published",
            ],
        },
    },
} as const;

export default addEndpointContract;
