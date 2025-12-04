"use client"

import { createId } from "@paralleldrive/cuid2"
import { useReactFlow } from "@xyflow/react"
import {
    GlobeIcon,
    MousePointerIcon,
    WebhookIcon,
} from "lucide-react"
import { useCallback } from "react"
import { toast } from "sonner"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetDescription,
    SheetClose,
} from "@/components/ui/sheet"
import { NodeType } from "@/generated/prisma/enums"
import { Separator } from "@/components/ui/separator"


export type NodeTypeOption = {
    type: NodeType,
    label: string,
    icon: React.ComponentType<{ className?: string }> | string,
    description: string
}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.INITIAL,
        label: "Initial Node",
        icon: MousePointerIcon,
        description: "Initial node"
    },
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Manual Trigger",
        icon: WebhookIcon,
        description: "Runs the flow on clicking a button."
    },
]

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        icon: GlobeIcon,
        description: "Runs the flow when an HTTP request is received."
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: "Google Form Trigger",
        icon: "/logos/googleform.svg",
        description: "Runs the flow when a Google form is submitted."
    },
]
 
interface NodeSelectorProps {
    onOpenChange: (open: boolean) => void
    open: boolean
    children: React.ReactNode
}

export function NodeSelector({ onOpenChange, open, children }: NodeSelectorProps) {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();
    const handleNodeSelect = useCallback((selection: NodeTypeOption) => {
        if (selection.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes();
            const hasManualTrigger = nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER,);
            if (hasManualTrigger) {
                toast.error("Only one manual trigger is allowed.");
                return;
            }
        }
        setNodes((nodes) => {
            const hasInitialTrigger = nodes.some(
                (node) => node.type === NodeType.INITIAL
            )
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const flowPosition = screenToFlowPosition({
                x: centerX + (Math.random() - 0.5) * 200,
                y: centerY + (Math.random() - 0.5) * 200
            })
            const newNode = {
                id: createId(),
                position: flowPosition,
                data: {},
                type: selection.type,
            };
            if (hasInitialTrigger) {
                return [newNode];
            }
            return [...nodes, newNode];
        });
        onOpenChange(false);
    }, [setNodes, getNodes, onOpenChange, screenToFlowPosition]);
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>What triggers this workflow?</SheetTitle>
                    <SheetDescription>
                        A trigger is a step that starts the workflow.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                    {triggerNodes.map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                            <div
                                key={nodeType.type}
                                onClick={() => handleNodeSelect(nodeType)}
                                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string" ? (
                                        <img
                                            src={Icon}
                                            alt={nodeType.label}
                                            className="size-5 object-contain rounded-sm"
                                        />
                                    ) : (
                                        <Icon className="size-5" />
                                    )}
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium text-sm">
                                            {nodeType.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Separator />
                <div className="flex flex-col gap-4 p-4">
                    {executionNodes.map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                            <button
                                key={nodeType.type}
                                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                                onClick={() => handleNodeSelect(nodeType)}
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string" ? (
                                        <img
                                            src={Icon}
                                            alt={nodeType.label}
                                            className="size-5 object-contain rounded-sm"
                                        />
                                    ) : (
                                        <Icon className="size-5" />
                                    )}
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium text-sm">
                                            {nodeType.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}