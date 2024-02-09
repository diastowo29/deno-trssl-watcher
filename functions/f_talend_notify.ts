import {DefineFunction, Schema, SlackFunction} from "deno-slack-sdk/mod.ts";
import {talendJobBlock, talendRerunJobBlock, talendJobDiscussedBlock} from "./blocks/message_block.ts";
import { newChannelView } from "../views/create_discussion.ts";
// import https from "node:https";
// import fs from "node:fs";

export const talendJobFunction = DefineFunction({
    callback_id: "talend_notify_function",
    title: "Notify Talend Event",
    description: "Notify talend based event",
    source_file: "functions/f_talend_notify.ts",
    input_parameters: {
        properties: {
            job_id: {
                type: Schema.types.string,
                description: "Talend Job ID"
            },
            job_title: {
                type: Schema.types.string,
                description: "Talend Job Title"
            },
            last_run: {
                type: Schema.types.string,
                description: "Job Last Run Date"
            },
            desc: {
                type: Schema.types.string,
                description: "Job Description"
            },
            status: {
                type: Schema.types.string,
                description: "Job Status"
            },
            retry_url: {
                type: Schema.types.string,
                description: "Job Retry Endpoint"
            },
            channel: {
                type: Schema.slack.types.channel_id,
                description: "Channel to notified"
            },
        },
        required: ["job_id", "job_title", "last_run", "status", "channel"]
    }
});

export default SlackFunction(talendJobFunction, async ({
    inputs,
    client
},) => {
    // console.log(inputs);
    let jobParams = inputs.retry_url?.split('metaServlet?')[1];
    var talendMsgBlock = talendJobBlock(inputs.job_title, inputs.job_id, inputs.status, inputs.last_run,  jobParams, inputs.desc);
      
    const message = await client.chat.postMessage({channel: inputs.channel, blocks: talendMsgBlock.blocks});
    return {completed: false};
}).addBlockActionsHandler([
    "rerun_job", 'assign_job', 'discuss_job'
], async ({body, client}) => {
    // console.log(body);
    let inputs = body.function_data.inputs;
    // console.log(inputs);
    let message_ts = body.message.ts;
    let channel = body.channel.id;
    let actions = body.actions[0];
    if (actions.action_id == 'rerun_job') {
        let talendApi = 'https://talend.harpa-go.com:9090/org.talend.administrator/metaServlet?';
        // let talendApi = 'https://con-treesdemo.zendesk.com/api/v2/tickets.json';
        // console.log(actions.value);
        // let opts = {
        //     method: 'GET',
        //     hostname: 'talend.harpa-go.com',
        //     port: 9090,
        //     path: `/org.talend.administrator/metaServlet?${actions.value}`,
        //     ca: fs.readFileSync("/intermediate.pem")
        // };
        
        // https.request(opts, (response) => {
        //     console.log(response.statusCode)
        // }).end();
        
        const issue = await fetch(`${talendApi}${actions.value}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            if (response.status == 200) {
                const message = await client
                    .chat
                    .update({
                        channel: channel,
                        ts: message_ts,
                        blocks: talendRerunJobBlock(inputs.job_title, inputs.job_id, inputs.status, inputs.last_run, inputs.retry_url, inputs.desc, body.user.name).blocks
                    });
                    // console.log(response);
            }
            console.log(response)
            console.log(response.status)
        }).catch(function(err) {
            console.log(err);
        })
    } else if (actions.action_id == 'assign_job') {
        let blocks = body.message.blocks;
        let newBlocks: any[] = [];
        blocks.forEach(block => {
            if (block.type != 'actions') {
                newBlocks.push(block);
            } else {
                let newElement: any[] = [];
                block.elements.forEach(element => {
                    if (element.action_id != 'assign_job') {
                        newElement.push(element);
                    }
                });
                newBlocks.push({
                    type:'actions',
                    elements: newElement
                })
            }
        });
        // const message = await client.chat.update({
        //     channel: channel,
        //     ts: message_ts,
        //     blocks: newBlocks
        // });
    } else {
        let blocks = body.message.blocks;
        let newBlocks: any[] = [];
        blocks.forEach(block => {
            if (block.type != 'actions') {
                newBlocks.push(block);
            } else {
                let newElement: any[] = [];
                block.elements.forEach(element => {
                    if (element.action_id != 'discuss_job') {
                        newElement.push(element);
                    }
                });
                newBlocks.push({
                    type:'actions',
                    elements: newElement
                })
            }
        });
        let view = newChannelView(inputs.job_id, body.message.ts);
            const openingModal = await client
                .views
                .open(
                    {interactivity_pointer: body.interactivity.interactivity_pointer, view: view}
                );
        // const message = await client.chat.update({
        //     channel: channel,
        //     ts: message_ts,
        //     blocks: newBlocks
        // });
    }
})
.addViewSubmissionHandler([
    'new-channel-view'
], async ({body, client, view}) => {
    // console.log(JSON.stringify(body));
    // console.log(body);
    // console.log(view);
    const inputs = body.function_data.inputs;
    const jobParams = inputs.retry_url?.split('metaServlet?')[1];
    const channel_message = inputs.channel;
    const message_ts = view?.private_metadata;
    const channel_name = view.state.values.channel_name_block.channel_name_action.value;
    const channel_invite_team = view.state.values.channel_invite_block.channel_invite_action.selected_conversations;
    const is_private = view.state.values.channel_private_block.channel_private_action.selected_options;
    const channel = await client
        .conversations
        .create({
            name: channel_name,
            is_private: is_private.length > 0
                ? true
                : false
        })
    if (!channel.ok) {
        console.log(channel);
        return {error: channel}
    }
    const initialInvite = await client
        .conversations
        .invite({channel: channel.channel.id, users: `${body.user.id},${channel_invite_team.toString()}`})

    if (!initialInvite.ok) {
        console.log(initialInvite);
        return {error: initialInvite}
    }
    const message = await client
        .chat
        .update({
            channel: channel_message,
            ts: message_ts,
            blocks: talendJobDiscussedBlock(inputs.job_title, inputs.job_id, inputs.status, inputs.last_run,  jobParams, inputs.desc, channel.channel.id).blocks
        });
    if (!message.ok) {
        console.log(message);
        return {error: message}
    }
    // console.log(view.private_metadata);
})