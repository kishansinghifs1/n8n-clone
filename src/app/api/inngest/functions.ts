import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { NonRetriableError } from "inngest";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { googleFormChannel } from "@/inngest/channels/google-form";
import {  manualTriggerChannel } from "@/inngest/channels/manual-trigger";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" 
  },
  { event: "workflows/execute.workflow" , channels : [httpRequestChannel(),manualTriggerChannel(),googleFormChannel()] },
  async ({ event, step ,publish }) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {  
      throw new NonRetriableError("Workflow ID is missing");
    }   
    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId, 
        },
        include: {
          nodes: true,
          connections: true
        }
      });
      return topologicalSort(workflow.nodes, workflow.connections);
    })

    let context =  event.data.initalData || {};

    for(const node of sortedNodes){
      const executor = getExecutor (node.type as NodeType);
      context = await executor({
        data : node.data as Record<string, unknown>,
        nodeId : node.id,
        context ,
        step,
        publish
      })
    }

    return { workflowId,result:context };
  },
);