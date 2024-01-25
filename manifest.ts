import { Manifest } from "deno-slack-sdk/mod.ts";
import { talendJobFunction } from "./functions/f_talend_notify.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "TRSSL - Watcher",
  description: "Watch anything when you sleep",
  icon: "assets/Owl.png",
  functions: [talendJobFunction],
  workflows: [],
  outgoingDomains: ["con-treesdemo.zendesk.com", "192.168.90.84"],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
