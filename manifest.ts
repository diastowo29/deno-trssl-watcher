import { Manifest } from 'deno-slack-sdk/mod.ts';
import { talendJobFunction } from './functions/f_talend_notify.ts';

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: 'TRSSL - Owl',
  description: 'Watch anything when you sleep',
  icon: 'assets/Owl.png',
  functions: [talendJobFunction],
  workflows: [],
  outgoingDomains: ['con-treesdemo.zendesk.com', '192.168.100.27', 'www.talend.harpa-go.com', 'talend.harpa-go.com'],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "users:read",
    "users:read.email",
    "channels:manage",
    "channels:write.invites",
    "groups:write",
    "groups:write.invites"
  ],
});
