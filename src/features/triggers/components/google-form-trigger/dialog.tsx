"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { CopyIcon } from "lucide-react";
import { generateGoogleFormScript } from "./utils";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: Props) => {
    const params = useParams();
    const workflowId = params?.workflowId as string;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const webhookUrl = `/api/webhooks/google-form?workflowId=${workflowId}`;
    const copyToClipboard = () => {
        try {
            navigator.clipboard.writeText(webhookUrl);
            toast.success("Copied to clipboard");
        } catch (error) {
            toast.error("Failed to copy to clipboard:", error as any);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Google Form Trigger</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Google Form's to trigger the workflow when the form is submitted.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <div className="flex gap-2">
                            <Input id="webhook-url" value={webhookUrl} readOnly />
                            <Button onClick={copyToClipboard} variant="outline" size="icon" type="button">
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-4">
                      <h4 className="font-medium text-sm">Setup Instructions</h4>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Go to your Google Form and click on the "Form responses" tab.</li>
                        <li>Click on the "Add response destination" button.</li>
                        <li>Select "Webhook" as the response destination.</li>
                        <li>Paste the webhook URL into the "Webhook URL" field.</li>
                        <li>Click on the "Save" button.</li>
                      </ol>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-3">
                        <h4 className="font-medium text-sm">Google Apps Scripts:</h4>
                        <Button variant="outline" type="button" onClick={async () => {
                            const script = generateGoogleFormScript(webhookUrl);
                            try{
                                navigator.clipboard.writeText(script);
                                toast.success("Script copied to clipboard");
                            }catch(error){
                                toast.error("Failed to copy to clipboard:", error as any);
                            }
                        }}>
                            <CopyIcon className="size-4 mr-2"/>
                            Copy Google Apps Scripts
                        </Button>
                        <p className="text-xs text-muted-foreground">The Script Inxludes Your Webhook URL And Handles The Form Submission.</p>
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                           <h4 className="font-medium text-sm">Available Variables:</h4>
                           <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li> <code className="bg-backgroud px-1 py-0.5">{"{{googleForm.respondentEmail}}}"}</code> - Respondent's Email</li>
                            <li> <code className="bg-backgroud px-1 py-0.5">{"{{googleForm.responses['Question Name']}}}"}</code> - Question Name</li>
                            <li> <code className="bg-backgroud px-1 py-0.5">{"{{json googleForm.response}}}"}</code> - Response Object</li>
                           </ul>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
