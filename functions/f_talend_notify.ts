import {DefineFunction, Schema, SlackFunction} from "deno-slack-sdk/mod.ts";
import {talendJobBlock, talendRerunJobBlock} from "./blocks/message_block.ts";

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
    "rerun_job"
], async ({body, client}) => {
    // console.log(body)
    let inputs = body.function_data.inputs;
    let message_ts = body.message.ts;
    let channel = body.channel.id;
    let actions = body.actions[0];
    if (actions.action_id == 'rerun_job') {
        let talendApi = 'http://192.168.90.84:8080/org.talend.administrator/metaServlet?';
        const message = await client
            .chat
            .update({
                channel: channel,
                ts: message_ts,
                blocks: talendRerunJobBlock(inputs.job_title, inputs.job_id, inputs.status, inputs.last_run, inputs.retry_url, inputs.desc, body.user.name).blocks
            });
        // const issue = await fetch(`${talendApi}${actions.value}`, {
        //     method: "GET"
        // }).then(async (response) => {
        //     if (response.status != 200) {
        //         console.log(response);
        //     } else {
        //         console.log(response);
        //     }
        //     console.log(response.status)
        // }).catch(function(err) {
        //     console.log(err);
        // })
    }
})