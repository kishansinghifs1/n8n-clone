"use server"

import { getSubscriptionToken,type Realtime } from "@inngest/realtime"
import {inngest} from "@/inngest/client"
import { googleFormChannel } from "@/inngest/channels/google-form"

export type GoogleFormTriggerToken = Realtime.Token<typeof googleFormChannel,["status"]>

export async function fetchGoogleFormTriggerRealTimeToken(): Promise<GoogleFormTriggerToken>{
    const token = await getSubscriptionToken(inngest,{channel : googleFormChannel(),topics : ["status"]});
    return token;
}   