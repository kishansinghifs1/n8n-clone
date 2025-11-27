"use client"

import { ErrorView, LoadingView } from "@/components/entity-components"
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflow"

export const Editor = ({workflowId}: {workflowId: string}) => {
    const {data : workflow} = useSuspenseWorkflow(workflowId)
    return (
        <div>
            <h1>{JSON.stringify(workflow)}</h1>
        </div>
    )
}

export const EditorLoading = () => {
    return (
        <LoadingView message="Loading editor ..."/>
    )
}

export const EditorError = () => {
    return <ErrorView message="Failed to load editor"/>
}