"use client"

import type { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react"
import { memo } from "react"
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";

type HttpRequestNodeData = NodeProps & {
    endpoint?: string;
    body?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const nodeData = props.data as HttpRequestNodeData;
    const description = nodeData?.endpoint ? `${nodeData.method || "GET"} : ${nodeData.endpoint}` : "Not Configured";
    return (
        <>
            <BaseExecutionNode {...props} id={props.id} name="HTTP Request" icon={GlobeIcon} description={description} onSettings={() => { }} onDoubleClick={() => { }} />
        </>
    )
});

HttpRequestNode.displayName = "HttpRequestNode";