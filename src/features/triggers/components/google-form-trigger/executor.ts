import type { NodeExecutor } from "@/features/executions/types";
import { googleFormChannel } from "@/inngest/channels/google-form";

type GoogleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor : NodeExecutor<GoogleFormTriggerData> = async ({ nodeId, context,step,publish }) => {
    await publish(googleFormChannel().status({nodeId , status : "loading"}))
    const result = await step.run("google-form-trigger",async () => {
        await publish(googleFormChannel().status({nodeId , status : "loading"}))
        return context;
    })
    await publish(googleFormChannel().status({nodeId , status : "success"}))
    return result;
}