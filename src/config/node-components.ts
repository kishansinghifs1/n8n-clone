import { InitialNode } from "@/components/inital-node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { GooogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { StripeTrigger } from "@/features/triggers/components/stripe-trigger/node";
import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";
import { GeminiTriggerNode } from "@/features/executions/components/gemini/node";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GooogleFormTrigger,
    [NodeType.GEMINI]: GeminiTriggerNode,
    [NodeType.STRIPE_TRIGGER]: StripeTrigger,
} as const satisfies NodeTypes;

export type RegisteredNodeTypes = keyof typeof nodeComponents;