import {channel , topic } from "@inngest/realtime";

export const GEMINI_CHANNEL_NAME = "gemmini-execution";

export const geminiChannel = channel(GEMINI_CHANNEL_NAME)
.addTopic
(
    topic("status").type<{nodeId : string;status :"loading"|"success"|"error";}>()
);

