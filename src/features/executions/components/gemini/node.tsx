"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import {
    GeminiDialog,
    GeminiFormValues,
} from "./dialog";
import { useReactFlow } from "@xyflow/react";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRealTimeToken } from "./action";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";


export type GeminiTriggerNodeData = {
    variableName?: string;
    model?: 'gemini-2.5-flash' | 'gemini-2.5-sonnet' | 'gemini-2.5-flash-sonnet' | 'gemini-2.0-flash' | 'gemini-2.0-sonnet' | 'gemini-2.0-flash-sonnet' ;
    userPrompt: string;
    systemPrompt?: string;
};

export type GeminiTriggerNodeType = Node<GeminiTriggerNodeData>;

export const GeminiTriggerNode = memo(
    (props: NodeProps<GeminiTriggerNodeType>) => {
        const { setNodes } = useReactFlow();

        const [dialogOpen, setDialogOpen] = useState(false);

        const nodeData = props.data || {};

        const description = nodeData.userPrompt
            ? `${nodeData.model || "gemini-2.5-flash"} : ${nodeData.userPrompt.slice(0, 50)}...`
            : "Not Configured";


        const NodeStatus = useNodeStatus({
            nodeId: props.id,
            channel: GEMINI_CHANNEL_NAME,
            topic: "status",
            refreshToken: fetchGeminiRealTimeToken,
        })
        const handleSettingsClick = () => setDialogOpen(true);

        const handleSubmit = (values: GeminiFormValues) => {
            setNodes((nodes) =>
                nodes.map((node) =>
                    node.id === props.id
                        ? {
                            ...node,
                            data: {
                                ...node.data,
                                ...values,
                            },
                        }
                        : node
                )
            );
        };

        return (
            <>
                <GeminiDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSubmit={handleSubmit}
                    defaultValues={nodeData}
                />

                <BaseExecutionNode
                    {...props}
                    id={props.id}
                    name="Gemini"
                    icon="/logos/gemini.svg"
                    description={description}
                    status={NodeStatus}
                    onSettings={handleSettingsClick}
                    onDoubleClick={handleSettingsClick}
                />
            </>
        );
    }
);

GeminiTriggerNode.displayName = "GeminiTriggerNode";
