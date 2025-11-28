"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image"
import { memo, type ReactNode, useCallback } from "react"
import { BaseNode, BaseNodeContent, BaseNodeFooter, BaseNodeHeader, BaseNodeHeaderTitle } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";

interface BaseTriggerNodeProps extends NodeProps {
    name: string;
    description?: string;
    icon?: LucideIcon | string;
    // status?:NodeStatus;
    onSettings?: () => void;
    onDoubleClick?: () => void;
    children?: ReactNode;
}

export const BaseTriggerNode = memo(({
    id,
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
}: BaseTriggerNodeProps) => {
    const handleDelete = () => { };
    return (
        <WorkflowNode
            name={name}
            description={description}
            onSettings={onSettings}
            onDelete={handleDelete}
        >
            <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
                <BaseNodeContent>
                    {Icon && (typeof Icon === "string" ? (
                        <Image src={Icon} alt={name} width={16} height={16} />
                    ) : (
                        <Icon className="size-4 text-muted-foreground" />
                    ))}
                    {children}
                    <BaseHandle id="source-1" type="source" position={Position.Right} />
                </BaseNodeContent>
            </BaseNode>
        </WorkflowNode>
    );
})

BaseTriggerNode.displayName = "BaseTriggerNode";