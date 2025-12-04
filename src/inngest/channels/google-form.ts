import {channel , topic } from "@inngest/realtime";

export const GOOGLE_FORM_CHANNEL_NAME = "google-form-execution";

export const googleFormChannel = channel(GOOGLE_FORM_CHANNEL_NAME)
.addTopic
(
    topic("status").type<{nodeId : string;status :"loading"|"success"|"error";}>()
);

