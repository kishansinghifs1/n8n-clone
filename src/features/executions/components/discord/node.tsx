"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { useReactFlow } from "@xyflow/react";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchDiscordRealTimeToken } from "./action";
import { Discord_Channel } from "@/inngest/channels/discord";
import { DiscordDialog , DiscordFormValues } from "./dialog";

export type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
  username?:string;
  variableName?: string;
};

export type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo(
    (props: NodeProps<DiscordNodeType>) => {
        const { setNodes } = useReactFlow();

        const [dialogOpen, setDialogOpen] = useState(false);

        const nodeData = props.data || {};
        const description = nodeData.content
            ? `${nodeData.content.slice(0, 50)}...`
            : "Not Configured";


        const NodeStatus = useNodeStatus({
            nodeId: props.id,
            channel: Discord_Channel,
            topic: "status",
            refreshToken: fetchDiscordRealTimeToken,
        })
        const handleSettingsClick = () => setDialogOpen(true);

        const handleSubmit = (values: DiscordFormValues) => {
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
                <DiscordDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSubmit={handleSubmit}
                    defaultValues={nodeData}
                />

                <BaseExecutionNode
                    {...props}
                    id={props.id}
                    name="Discord"
                    icon="/logos/discord.svg"
                    description={description}
                    status={NodeStatus}
                    onSettings={handleSettingsClick}
                    onDoubleClick={handleSettingsClick}
                />
            </>
        );
    }
);

DiscordNode.displayName = "DiscordNode";
