"use client"

import type { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { HttpRequestDialog } from "./dialog";
import { useReactFlow } from "@xyflow/react";

type HttpRequestNodeData = NodeProps & {
    endpoint?: string;
    body?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    [key: string]: unknown;

};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const { setNodes } = useReactFlow();
    const [dialogOpen, setDialogOpen] = useState(false);
    const nodeData = props.data;
    const nodeStatus = "initial";
    const description = nodeData?.endpoint ? `${nodeData.method || "GET"} : ${nodeData.endpoint}` : "Not Configured";
    const handleSettingsClick = () => {
        setDialogOpen(true);
    }
    const handleSubmit = (values: { endpoint: string; method: string; body?: string }) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        endpoint: values.endpoint,
                        method: values.method,
                        body: values.body
                    }
                }
            }
            return node;    
        }));
    }
    return (
        <>
            <HttpRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} defaultEndpoint={nodeData?.endpoint} defaultMethod={nodeData?.method} defaultBody={nodeData?.body} />
            <BaseExecutionNode status={nodeStatus} {...props} id={props.id} name="HTTP Request" icon={GlobeIcon} description={description} onSettings={handleSettingsClick} onDoubleClick={handleSettingsClick} />

        </>
    )
});

HttpRequestNode.displayName = "HttpRequestNode";