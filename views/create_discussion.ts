export function newChannelView (id: string, origin_message_ts: string) {
    return {
        type: "modal",
        // Note that this ID can be used for dispatching view submissions and view
        // closed events.
        callback_id: "new-channel-view",
        // This option is required to be notified when this modal is closed by the user
        notify_on_close: false,
        private_metadata: origin_message_ts,
        title: {
            type: "plain_text",
            text: "Create Slack Channel"
        },
        submit: {
            type: "plain_text",
            text: "Create"
        },
        close: {
            type: "plain_text",
            text: "Cancel"
        },
        blocks: [
            {
                block_id: 'channel_name_block',
                type: "input",
                element: {
                    action_id: 'channel_name_action',
                    type: "plain_text_input",
                    initial_value: `job-talend-${id}`
                },
                label: {
                    type: "plain_text",
                    text: "Channel Name"
                }
            }, {
                block_id: 'channel_invite_block',
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "Invite other team(s)"
                },
                accessory: {
                    type: "multi_conversations_select",
                    action_id: 'channel_invite_action',
                    placeholder: {
                        type: "plain_text",
                        text: "Select Channel"
                    },
                    filter: {
                        include: ["im", 'mpim'],
                        exclude_bot_users: true
                    }
                }
            }, {
                block_id: 'channel_private_block',
                type: "actions",
                elements: [
                    {
                        type: "checkboxes",
                        action_id: 'channel_private_action',
                        options: [
                            {
                                text: {
                                    type: "plain_text",
                                    text: "Make Private :lock:"
                                },
                                value: "tasks",
                                description: {
                                    type: "plain_text",
                                    text: "Make this new channel a private channel"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
}