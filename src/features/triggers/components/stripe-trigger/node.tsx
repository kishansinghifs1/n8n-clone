import { NodeProps } from "@xyflow/react";
import {memo, useState} from "react";
import {BaseTriggerNode} from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { stripeChannelName } from "@/inngest/channels/stripe-request";
import { fetchStripeTriggerRealTimeToken } from "./action";

export const StripeTrigger = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const nodeStatus = useNodeStatus({
                    nodeId : props.id,
                    channel : stripeChannelName,
                    topic : "status",
                    refreshToken : fetchStripeTriggerRealTimeToken,
                });
    const handleSettingsClick = () => {
        setDialogOpen(true);
    }
    return (
        <>
            <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseTriggerNode {...props} icon="/logos/stripe.svg" name="Stripe" description="When Strip Event Is Captured ?" onSettings={handleSettingsClick} onDoubleClick={handleSettingsClick} status={nodeStatus} />
        </>
    )
})

StripeTrigger.displayName = "StripeTrigger";