import { createLoader } from "nuqs/server";
import {workflowsParams} from "@/features/workflows/params"

export const credentialsParamsLoader = createLoader(workflowsParams);
