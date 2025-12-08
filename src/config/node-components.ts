import { InitialNode } from "@/components/inital-node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { GooogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { StripeTrigger } from "@/features/triggers/components/stripe-trigger/node";
import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from "@xyflow/react";
import { GeminiTriggerNode } from "@/features/executions/components/gemini/node";
import { DiscordNode } from "@/features/executions/components/discord/node";
// import { SlackTriggerNode } from "@/features/executions/components/slack/node";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GooogleFormTrigger,
    [NodeType.GEMINI]: GeminiTriggerNode,
    [NodeType.STRIPE_TRIGGER]: StripeTrigger,
    [NodeType.DISCORD]: DiscordNode,
    // [NodeType.SLACK]: SlackTriggerNode,
} as const satisfies NodeTypes;

export type RegisteredNodeTypes = keyof typeof nodeComponents;