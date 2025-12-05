"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({ open, onOpenChange }: Props) => {
    const params = useParams();
    const workflowId = params?.workflowId as string;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const webhookUrl = `/api/webhooks/stripe-trigger?workflowId=${workflowId}`;
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
                    <DialogTitle>Stripe Trigger</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Stripe Dashboard to trigger this workflow on payment events.
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
                            <li>Go to your Stripe Dashboard and navigate to the "Webhooks" section.</li>
                            <li>Click on the "Add webhook" button.</li>
                            <li>Select the events you want to trigger the workflow.</li>
                            <li>Paste the webhook URL into the "Webhook URL" field.</li>
                            <li>Click on the "Save" button.</li>
                        </ol>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Available Variables:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li> <code className="bg-backgroud px-1 py-0.5 rounded">{"{{stripe.amount}}}"}</code> -Payment's Amount</li>
                            <li> <code className="bg-backgroud px-1 py-0.5 rounded">{"{{stripe.customerId}}}"}</code> - Customer ID</li>
                            <li> <code className="bg-backgroud px-1 py-0.5 rounded">{"{{stripe.currency}}}"}</code> - Currency Code</li>
                            <li> <code className="bg-backgroud px-1 py-0.5 rounded">{"{{stripe.json}}}"}</code> -Full Event As JSON</li>
                            <li> <code className="bg-backgroud px-1 py-0.5 rounded">{"{{stripe.eventType}}}"}</code> -Event type (e.g.,'payment_intent.succeeded')</li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
