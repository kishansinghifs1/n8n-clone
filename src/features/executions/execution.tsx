"use client"

import { ExecutionStatus } from "@/generated/prisma/enums"
import { CheckCircle2Icon, Clock12Icon, Loader2Icon, XCircleIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useSuspenseExecution } from "./hooks/use-executions"
import { useState } from "react"


const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-success" />
        case ExecutionStatus.RUNING:
            return <Loader2Icon className="size-5 text-warning animate-spin" />
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-error" />
        default:
            return <Clock12Icon className="size-5 text-muted" />
    }
}


export const ExecutionView = ({ executionId }: { executionId: string }) => {
    const { data: execution } = useSuspenseExecution(executionId)
    const [showStackTrace, setShowStackTrace] = useState(false);
    const duration = execution.completedAt ? Math.round((new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000) : undefined;
    return (
        <Card className="shadow-none">
            <CardHeader>
                <div className="flex items-center gap-3">
                    {getStatusIcon(execution.status)}
                    <CardTitle>{execution.status}</CardTitle>
                </div>
                <CardDescription>
                    Execution for {execution.workflow.name}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Workflow</p>
                        <Link prefetch className="text-sm hover:underline text-primary" href={`/workflows/${execution.workflow.id}`}>
                            {execution.workflow.name}
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
