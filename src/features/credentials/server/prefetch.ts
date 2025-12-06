import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch,trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflows.getMany>;

/**
 * Prefetch all workflows
 */
export const prefetchCredentials= (params: Input) => {
  return prefetch(trpc.credentials.getMany.queryOptions(params));
};

export const prefetchCredential = (id : string) => {
  return prefetch(trpc.credentials.getOne.queryOptions({ id }));
};