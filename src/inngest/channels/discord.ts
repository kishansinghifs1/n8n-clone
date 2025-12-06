import {channel , topic } from "@inngest/realtime";

export const Discord_Channel = "Discord";

export const discordChannel = channel(Discord_Channel)
.addTopic
(
    topic("status").type<{nodeId : string;status :"loading"|"success"|"error";}>()
);

 