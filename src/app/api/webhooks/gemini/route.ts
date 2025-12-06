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
            formId: body.formId,
            formTitle: body.formTitle,
            responseId: body.responseId,
            timestamp: body.timestamp,
            respondentEmail: body.respondentEmail,
            responses: body.responses,
            raw: body
        };
        //inngest job trigger
        await sendWorkflowExecution({ workflowId , initialData : {
            googleForm : formData
        }})
        return NextResponse.json({ success: true, data: formData });
    } catch (error) {
        console.error("Error in Google Form Trigger", error);
        return NextResponse.json({ success: false, error: "Failed to process Google Form Submission" });
    }
}