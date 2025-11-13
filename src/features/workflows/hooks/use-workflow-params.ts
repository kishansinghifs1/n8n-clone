import {useQueryStates} from "nuqs"
import {workflowsParams} from "@/features/workflows/params"

export const useWorkflowsQueryStates = () => {
    return useQueryStates(workflowsParams)
}