import { NodeProps } from "@xyflow/react";
import {memo, useState} from "react";
import {BaseTriggerNode} from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GOOGLE_FORM_CHANNEL_NAME } from "@/inngest/channels/google-form";
import { fetchGoogleFormTriggerRealTimeToken } from "./action";

export const GooogleFormTrigger = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const nodeStatus = useNodeStatus({
                    nodeId : props.id,
                    channel : GOOGLE_FORM_CHANNEL_NAME,
                    topic : "status",
                    refreshToken : fetchGoogleFormTriggerRealTimeToken,
                });
    const handleSettingsClick = () => {
        setDialogOpen(true);
    }
    return (
        <>
            <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseTriggerNode {...props} icon="/logos/googleform.svg" name="Google Form" description="Runs on form submit." onSettings={handleSettingsClick} onDoubleClick={handleSettingsClick} status={nodeStatus} />
        </>
    )
})

GooogleFormTrigger.displayName = "GooogleFormTrigger";