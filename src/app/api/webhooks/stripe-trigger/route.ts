import { type NextRequest, NextResponse } from "next/server";
import { sendWorkflowExecution } from "../../inngest/utils";


export async function POST(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const workflowId = url.searchParams.get("workflowId");
        if (!workflowId) {
            return NextResponse.json({ success: false, error: "Workflow ID not found" }, { status: 400 });
        }
        const body = await request.json();
        const formData = {
            eventType : body.eventType,
            eventId : body.id,
            timestamp : body.created,
            livemode : body.livemode,
            raw : body.data?.object
        };

        await sendWorkflowExecution({ workflowId , initalData : {
            stripe : formData
        }})
        return NextResponse.json({ success: true, data: formData });
    } catch (error) {
        console.error("Error in Stripe Trigger", error);
        return NextResponse.json({ success: false, error: "Failed to process Stripe Trigger" });
    }
}