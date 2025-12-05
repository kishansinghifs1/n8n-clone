import type { NodeExecutor } from "@/features/executions/types";
import { stripeChannel } from "@/inngest/channels/stripe-request";

type StripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor : NodeExecutor<StripeTriggerData> = async ({ nodeId, context,step,publish }) => {
    await publish(stripeChannel().status({nodeId , status : "loading"}))
    const result = await step.run("stripe-trigger",async () => {
        await publish(stripeChannel().status({nodeId , status : "loading"}))
        return context;
    })
    await publish(stripeChannel().status({nodeId , status : "success"}))
    return result;
}