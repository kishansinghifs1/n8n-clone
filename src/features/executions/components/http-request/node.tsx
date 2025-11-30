"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import {
    HttpRequestDialog,
    HttpRequestFormValues,
} from "./dialog";
import { useReactFlow } from "@xyflow/react";

export type HttpRequestNodeData = {
    variableName?: string;
    endpoint?: string;
    body?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

export type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo(
    (props: NodeProps<HttpRequestNodeType>) => {
        const { setNodes } = useReactFlow();
        const [dialogOpen, setDialogOpen] = useState(false);

        const nodeData = props.data || {};

        const description = nodeData.endpoint
            ? `${nodeData.method || "GET"} : ${nodeData.endpoint}`
            : "Not Configured";

        const handleSettingsClick = () => setDialogOpen(true);

        const handleSubmit = (values: HttpRequestFormValues) => {
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
                <HttpRequestDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSubmit={handleSubmit}
                    defaultValues={nodeData}
                />

                <BaseExecutionNode
                    {...props}
                    id={props.id}
                    name="HTTP Request"
                    icon={GlobeIcon}
                    description={description}
                    status="initial"
                    onSettings={handleSettingsClick}
                    onDoubleClick={handleSettingsClick}
                />
            </>
        );
    }
);

HttpRequestNode.displayName = "HttpRequestNode";
