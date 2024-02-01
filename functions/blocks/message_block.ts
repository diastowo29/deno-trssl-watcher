export function talendJobBlock(title: string, id: string, status: string, last_run: string, retry_params:string, desc:string) {
    return {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":rotating_light: *New Job Event* :rotating_light:"
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*ID:* ${id}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Status:* ${status}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Title:* ${title}`
                    },
                    {
                        type: "mrkdwn",
                        text: `:alarm_clock: *Last run:* ${last_run}`
                    }
                ]
            },
            ...((status !='NO_ERROR') ? [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Failed Reason: *"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": desc
                    }
                },
                { 
                    type: "actions",
                    elements: [
                        {
                            action_id: "rerun_job",
                            type: "button",
                            text: {
                                type: "plain_text",
                                "emoji": true,
                                text: ":repeat: Restart Job"
                            },
                            style: "primary",
                            value: retry_params
                        },
                        {
                            action_id: "discuss_job",
                            type: "button",
                            text: {
                                type: "plain_text",
                                "emoji": true,
                                text: ":rocket: Create Discussion"
                            },
                            value: retry_params
                        }
                    ]
                }]: [])
        ]
    }
}

export function talendRerunJobBlock(title: string, id: string, status: string, last_run: string, retry_params:string, desc:string, author:string) {
    return {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":rotating_light: *New Job Event* :rotating_light:"
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*ID:* ${id}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Status:* ${status}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Title:* ${title}`
                    },
                    {
                        type: "mrkdwn",
                        text: `:alarm_clock: *Last run:* ${last_run}`
                    }
                ]
            },
            ...((status !='NO_ERROR') ? [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Failed Reason: *"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": desc
                    }
                }]: []),
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": `:pushpin: Restarted by : ${author}`
                    }
                ]
            }
        ]
    }
}

export function talendJobDiscussedBlock(title: string, id: string, status: string, last_run: string, retry_params:string, desc:string, channel_id:string) {
    return {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":rotating_light: *New Job Event* :rotating_light:"
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*ID:* ${id}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Status:* ${status}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Title:* ${title}`
                    },
                    {
                        type: "mrkdwn",
                        text: `:alarm_clock: *Last run:* ${last_run}`
                    }
                ]
            },
            ...((status !='NO_ERROR') ? [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*Failed Reason: *"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": desc
                    }
                },
                {type: 'divider'},
                {
                    type: "rich_text",
                    elements: [
                        {
                            type: "rich_text_section",
                            elements: [
                                {
                                    type: "text",
                                    text: "Being resolved in: "
                                },
                                {
                                    type: "channel",
                                    channel_id: channel_id
                                }
                            ]
                        }
                    ]
                },
                { 
                    type: "actions",
                    elements: [
                        {
                            action_id: "rerun_job",
                            type: "button",
                            text: {
                                type: "plain_text",
                                "emoji": true,
                                text: ":repeat: Restart Job"
                            },
                            style: "primary",
                            value: retry_params
                        }
                    ]
                }]: [])
        ]
    }
}