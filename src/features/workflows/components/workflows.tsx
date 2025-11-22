"use client"
import { EntityHeader, EntityContainer, EntitySearch, EntityPagination, LoadingView, ErrorView, EmptyView, EntityList, EntityItem } from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflow";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsQueryStates } from "../hooks/use-workflow-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "@/generated/prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { resetRevalidatingSegmentEntry } from "next/dist/client/components/segment-cache-impl/cache";


export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();
  return (
    <EntityList 
      items={workflows.data.items}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkflowItem data={workflow} />}
      emptyView={<WorkflowsEmpty />}
    />
  )
};

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsQueryStates();
  const { searchValue, setSearchValue } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      placeholder="Search workflows"
      value={searchValue}
      onChange={setSearchValue}
    />
  );
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow();
  const {handleError,modal} = useUpgradeModal();
  const router = useRouter();
  const handleCreate = () => {
    createWorkflow.mutate(undefined , { 
      onSuccess : (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError : (error) => {
        handleError(error);
      }
    })
  }
  return (
    <>
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew={handleCreate}
        newButtonLabel="New workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
      {modal}
    </>
  );
};
export const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsQueryStates();

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      page={workflows.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};


export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};


export const WorkflowsLoading = () => {
  return <LoadingView message="Loading Workflows ... "/>
}

export const WorkflowsError= () => {
  return <ErrorView message="Error loading workflows ... "/>
}

export const WorkflowsEmpty = () => {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const {handleError,modal} = useUpgradeModal(); 

  const handleCreate = () => {
    createWorkflow.mutate(undefined, { 
      onError : (error) => {
        handleError(error);
      },
      onSuccess : (data) => {
        router.push(`/workflows/${data.id}`);
      }
    })
  }
  return (
    <>
      <EmptyView message="No workflows found. Get started by creating a new workflow" onNew={handleCreate} />
    </>
  )
}

export const WorkflowItem = ({
  data,
} : {
  data: Workflow
}) => {
  const  removeWorkflow = useRemoveWorkflow();
  const handleRemove = () => {
    removeWorkflow.mutate({ id: data.id });
  }
  
  return (
    <EntityItem
       href={`/workflows/${data.id}`}
       title={data.name}
       subtitle={
        <>  
        Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
        &bull; Created {" "}
        {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
       }
       image={
        <div className="size-8 flex items-center justify-center rounded-full bg-muted">
          <WorkflowIcon className="size-5 text-muted-foreground" /> 
        </div>
       }
       onRemove={handleRemove}
       isRemoving={removeWorkflow.isPending}
       />
   )
}