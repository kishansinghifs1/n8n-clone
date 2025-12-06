import {useQueryStates} from "nuqs"
import {workflowsParams} from "@/features/workflows/params"

export const useCredentialQueryStates = () => {
    return useQueryStates(workflowsParams)
}