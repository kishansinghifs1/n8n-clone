import { NodeProps } from "@xyflow/react";
import { WebhookIcon } from "lucide-react";
import {memo} from "react";
import {BaseTriggerNode} from "../base-trigger-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
    return (
        <>
            <BaseTriggerNode {...props} icon={WebhookIcon} name="Manual Trigger" />
        </>
    )
})

ManualTriggerNode.displayName = "ManualTriggerNode";