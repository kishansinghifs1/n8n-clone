import { NodeProps } from "@xyflow/react";
import { WebhookIcon } from "lucide-react";
import {memo, useState} from "react";
import {BaseTriggerNode} from "../base-trigger-node";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const nodeStatus = "initial";
    const handleSettingsClick = () => {
        setDialogOpen(true);
    }
    return (
        <>
            <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseTriggerNode {...props} icon={WebhookIcon} name="Manual Trigger" onSettings={handleSettingsClick} onDoubleClick={handleSettingsClick} status={nodeStatus} />
        </>
    )
})

ManualTriggerNode.displayName = "ManualTriggerNode";