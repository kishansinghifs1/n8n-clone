import {useQueryStates} from "nuqs"
import {executionsParams} from "@/features/executions/server/params"

export const useExecutionsQueryStates = () => {
    return useQueryStates(executionsParams)
}