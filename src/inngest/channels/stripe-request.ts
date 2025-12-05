import {channel , topic } from "@inngest/realtime";

export const stripeChannelName = "stripe-execution";

export const stripeChannel = channel(stripeChannelName)
.addTopic
(
    topic("status").type<{nodeId : string;status :"loading"|"success"|"error";}>()
);

