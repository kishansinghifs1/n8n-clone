"use server"

import { getSubscriptionToken,type Realtime } from "@inngest/realtime"
import {inngest} from "@/inngest/client"
import { stripeChannel } from "@/inngest/channels/stripe-request"

export type StripeTriggerToken = Realtime.Token<typeof stripeChannel,["status"]>

export async function fetchStripeTriggerRealTimeToken(): Promise<StripeTriggerToken>{
    const token = await getSubscriptionToken(inngest,{channel : stripeChannel(),topics : ["status"]});
    return token;
}   