import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { NonRetriableError } from "inngest";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { geminiChannel } from "@/inngest/channels/gemini";
import { googleFormChannel } from "@/inngest/channels/google-form";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { discordChannel } from "@/inngest/channels/discord";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow", retries: 1, onFailure: async ({ event, step }) => {
      return prisma.execution.update({
        where: {
          inngestEventId: event.data.event.id
        },
        data: {
          status: ExecutionStatus.FAILED,
          error: event.data.error.message,
          errorStack: event.data.error.stack
        }
      })
    }
  },
  { event: "workflows/execute.workflow", channels: [httpRequestChannel(), manualTriggerChannel(), googleFormChannel(), geminiChannel(), discordChannel()] },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;
    if (!workflowId || !inngestEventId) {
      throw new NonRetriableError("Workflow ID or Event ID is missing");
    }

    await step.run("create-executions", async () => {
      return prisma.execution.create({
        data: {
          workflowId,
          inngestEventId
        }
      })
    })

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

    let context = event.data.initialData || {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish
      })
    }

    await step.run("update-execution", async () => {
      return prisma.execution.update({
        where: {
          inngestEventId,
          workflowId
        },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context
        }
      })
    })

    return { workflowId, result: context };
  },
);